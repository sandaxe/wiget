/* eslint-disable import/prefer-default-export */
/* eslint-enable import/prefer-default-export */

import { toast } from "./toast";
import { StoreProvider } from "../shared/store.provider";

const STATICURL = "https://app.oicapps.com/api";
const createRequest = (url, reqConfig) => {
  url = `${reqConfig.baseUrl || STATICURL}/${url}`;
  Reflect.deleteProperty(reqConfig, "baseUrl");
  var headerTokens = StoreProvider.getStore("Tokens") || {};
  var headers = Object.assign(
    {
      "Content-Type": "application/json",
    },
    headerTokens["state"] || {}
  );

  if (reqConfig.query) {
    url = serializeQueryParams(url, reqConfig.query);
  }

  var requestOption = {
    method: reqConfig.method,
    headers: headers,
    //mandatory for sending cookie along with request.
    //to block sending cookie set "omit" which is default as per fetch's spec
    credentials: reqConfig.isCORS ? "include" : "same-origin",
    //body: (typeof reqConfig.data !== "string") ? JSON.stringify(reqConfig.data) : reqConfig.data
  };

  if (reqConfig.data) {
    requestOption["body"] =
      typeof reqConfig.data !== "string"
        ? JSON.stringify(reqConfig.data)
        : reqConfig.data;
  }

  if (reqConfig.signal) {
    requestOption["signal"] = requestOption.signal;
  }

  return new Request(url, requestOption);
};

const serializeQueryParams = (url, params = {}) => {
  var queryString = url.lastIndexOf("?") !== -1 ? `&` : `?`;
  Object.keys(params).forEach((key) => {
    queryString += `${key}=${params[key]}&`;
  });
  return `${url}${queryString}`;
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    try {
      if (response.headers.get("Content-Type") === "application/json") {
        return response.json().then((json) => {
          return Promise.reject(json);
        });
      }
      return Promise.reject({ errorMessage: "Unhandled server error" });
    } catch (err) {
      return Promise.reject({ status: response.statusText });
    }
  }
};

const parseJSON = (response) => {
  return response.json();
};

const sendRequest = (url, options) => {
  let controller = new AbortController();
  options.signal = controller.signal;
  let request = createRequest(url, options);
  let promise = fetch(request)
    .then(checkStatus)
    .then(parseJSON)
    .catch((err) => {
      if (options.method !== "GET") {
        let showToast = options.hasOwnProperty("toast") ? options.toast : true;
        showToast && toast.error(err.message);
      }
      return Promise.reject(err);
    });
  promise.cancel = controller.abort;
  return promise;
};

const service = {
  get: (url, options = {}) => {
    options.method = "GET";
    return sendRequest(url, options);
  },

  post: (url, options = {}) => {
    options.method = options.method || "POST";
    return sendRequest(url, options);
  },

  update: function(url, options = {}) {
    options.method = "PUT";
    return this.post(url, options);
  },

  patch: function(url, options = {}) {
    options.method = "PATCH";
    return sendRequest(url, options);
  },

  delete: (url, options = {}) => {
    options.method = "DELETE";
    return sendRequest(url, options);
  },

  postq: (url, options = {}, callback = () => false, queueName = "default") => {
    let queue = Queue.getQueue(queueName);
    options.method = "POST";
    return queue.queueRequest(url, options, callback);
  },
};

export default service;

class Queue {
  static requestQueue = {};

  static getQueue(name = "system") {
    if (!this.requestQueue[name]) {
      this.requestQueue[name] = new Queue(name);
    }
    return this.requestQueue[name];
  }

  constructor(name) {
    this.name = name;
    this.requestQueue = [];
    this.executeQueue = this.executeQueue.bind(this);
  }

  queueRequest(url, option, callback) {
    let queueId = new Date().getTime();
    this.requestQueue.push({
      id: queueId,
      url,
      option,
      callback,
    });
    //trigger the queue
    this.executeQueue();
  }

  executeQueue(updatedRequestData = null) {
    if (this.requestStatus === "waiting") {
      //break the recurrsion;
      return;
    }
    let requestObj = this.requestQueue.shift();
    if (!requestObj) {
      return;
    }
    //if data is present then update request object with latest data
    if (updatedRequestData) {
      requestObj.option.data = updatedRequestData;
    }
    this.requestStatus = "waiting";
    let res = null;
    let err = null;
    sendRequest(requestObj.url, requestObj.option)
      .then(
        (data) => {
          res = data;
        },
        (error) => {
          err = error;
        }
      )
      .finally(() => {
        this.requestStatus = "done";
        let shouldWait = (data) => {
          //proceed to next request
          this.executeQueue(data);
        };
        //check if the waiting callback method is accepted in the given callback
        //if so then wait untill callback is called, then proceed with queue execution
        if (requestObj.callback.length === 3) {
          requestObj.callback(err, res, shouldWait);
        } else {
          requestObj.callback(err, res);
          //proceed to next request
          this.executeQueue();
        }
      });
  }

  clear() {
    if (this.name === "system") {
      return;
    }
    Reflect.deleteProperty(Queue.requestQueue, this.name);
  }
}
