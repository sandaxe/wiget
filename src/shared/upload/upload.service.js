import DataService from '../../shared/service';

export const UploadService = {
  initUpload(uploadType, fileData) {
    return DataService.post(`v1/upload/${uploadType}/init`, { data: fileData });
  },
  getSignedUrl(uploadType, fileData) {
    return DataService.post(`v1/upload/${uploadType}`, { data: fileData });
  },
  uploadPart(url, options) {
    return fetch(url, { method: 'PUT', headers: options.headers || {}, body: options.data });
  },
  completeUpload(uploadType, data) {
    return DataService.post(`v1/upload/${uploadType}/complete`, { data: data });
  },
  getReadSignedUrl(uploadType, key) {
    return DataService.get(`v1/upload/${uploadType}?Key=${key}`);
  }
};
