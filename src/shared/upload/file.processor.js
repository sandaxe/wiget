export class FileProcessor {
  constructor(file, chunkSize) {
    this.file = file;
    this.chunkSize = chunkSize;
  }
  async run(fn, startIndex = 0, endIndex) {
    const { file, chunkSize } = this;
    const totalChunks = Math.ceil(file.size / chunkSize);

    const processIndex = async(index) => {
      if (index === totalChunks || index === endIndex) {
        return;
      }
      const start = index * chunkSize;
      const section = file.slice(start, start + chunkSize);
      const chunk = await getData(section);
      await fn(index, chunk);
      await processIndex(index + 1);
    };
    await processIndex(startIndex);
  }
}

async function getData(blob) {
  return new Promise((resolve, reject) => {
    let reader = new window.FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
