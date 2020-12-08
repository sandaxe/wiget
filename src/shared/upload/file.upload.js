import { RE_TRY_LIMIT, MIN_CHUNK_SIZE } from './constants';
import { generateShortId } from './utils';
import { FileProcessor } from './file.processor';
import { UploadService } from './upload.service';
import { Progress } from "./progress";
import { getFileExtension } from "./utils";

export class FileUpload {
  constructor(file, prefix, config = {}) {
    this.file = file;
    this.file.fileExtension = getFileExtension(file.name);
    this.id = generateShortId("Oic");
    this.prefix = prefix;
    this.file.id = this.id;
    this.file.isAsync = this.file.size > MIN_CHUNK_SIZE;
    this.file.progress = new Progress(this.file.setStatus);
    this.config = config;
  }

  async multipartUpload(data, callback) {
    const {
      file
    } = this;
    const urls = data.Urls;
    this.file.key = data.Key;
    let uploads = [];
    let uploaded = 0;
    let processor = new FileProcessor(this.file, data.ChunkSize);
    const put = async(index, chunk) => {
      uploads.push(safePut(urls[index], chunk).then((val) => {
        uploaded = uploaded + chunk.byteLength / file.size * 100.0;
        this.file.progress.setProgress(Math.round(uploaded));
        callback({
          name: this.file.name,
          id: this.id,
          uploaded: uploaded
        });
      }));
    };
    await processor.run(put);
    await Promise.all(uploads);
    UploadService.completeUpload(this.config.uploadType, {
      Key: data.Key,
      UploadId: data.UploadId
    }).then((response) => {
      this.uploadFinish(callback);
    });
  }

  async singlePartUpload(data, callback) {
    const {
      file
    } = this;
    let blob = file.slice(0, file.size);
    this.file.progress.asyncProgress(5);
    safePut(data.Url, blob).then((response) => {
      this.file.key = data.Key;
      this.file.progress.asyncProgress(70, 95);
      this.uploadFinish(callback);
    });
  }

  async upload(callback = () => {}) {
    let data = {
      name: this.file.name,
      size: this.file.size,
      key: `${this.prefix}/${this.id}/${this.file.name}`
    };
    if (this.file.isAsync) {
      let response = await UploadService.initUpload(this.config.uploadType, data);
      this.file.progress.asyncProgress(0, 20);
      this.multipartUpload(await response, callback);
    } else {
      this.file.progress.asyncProgress(0, 5);
      let response = await UploadService.getSignedUrl(this.config.uploadType, data);
      this.singlePartUpload(await response, callback);
    }
  }

  uploadFinish(callback) {
    this.file.progress.setProgress(100);
    callback({ uploaded: 100,
      name: this.file.name,
      id: this.id,
      key: this.file.key,
      size: this.file.size,
      fileExtension: this.file.fileExtension });
  }
}


async function safePut(url, data, headers = {}, reTry = 1) {
  try {
    if (reTry <= RE_TRY_LIMIT) {
      return await UploadService.uploadPart(url, {
        data: data,
        headers: headers
      });
    }
    throw Error("Maximum try filed");
    // return await put(...arguments);
  } catch (e) {
    console.log(e);
    return await safePut(url, data, headers, reTry + 1);
  }
}
