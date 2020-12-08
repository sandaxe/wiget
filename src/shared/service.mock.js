

const MockData = {

};


const postData = (url, options) => {
  if(url.indexOf('process') > -1) {
    let formData = options.data || '{}';
    return JSON.parse(formData);
  }
  if(url.lastIndexOf('signin') !== -1) return true;

  if(url.endsWith('/metadata/list')) {
    return MockData['list'];
  }

  return getData(url);
};

const service = {

};

export default service;
