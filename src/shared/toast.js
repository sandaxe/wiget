import React from 'react';
import { toast as Toast } from 'react-toastify';
import { ERROR_MESSAGES } from './resource/error.message';

import { ToastBox } from './resource/toast';

let activeToasts = [];
let toastId = null;

const closeCallback = () => {
  activeToasts = [];
  toastId = null;
};

const getErrorText = (err) => {
  if(typeof err === 'string') {
    return err;
  }
  let transMessage = ERROR_MESSAGES[err.error_code];
  return (transMessage, err.args) || "Something went wrong. Please contact customer support.";
};

export const toast = {
  // success: (message, option) => {
  //   Toast(message, {
  //     position: Toast.POSITION.TOP_CENTER,
  //     autoClose: true,
  //     hideProgressBar: true,
  //     className: 'dark-toast'
  //   });
  // },
  success: (message, option) => {
    Toast(<ToastBox messages={[message]}/>, {
      position: Toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
      autoClose: 2000,
      closeButton: false,
      className: 'dark-toast'
    });
  },
  error: function(err, option) {
    let message = "";
    let shownToast;
    if(typeof err === 'string') {
      message = err;
    }else {
      if(!err.error_code) {
        err.error_code = "ERROR_UNEXPECTED";
      }
      message = getErrorText(err);
      shownToast = activeToasts.find(error => error.error_code === err.error_code);
    }

    let toastOption = Object.assign({
      closeButton: false,
      position: Toast.POSITION.TOP_RIGHT,
      autoClose: true,
      hideProgressBar: true,
      className: 'error-toast',
      onClose: closeCallback
    }, option);

    let messages = [message];

    if(shownToast) return;

    if(Toast.isActive(toastId) && !shownToast) {
      messages = messages.concat(activeToasts.map(err => getErrorText(err)));
      toastOption.render = <ToastBox type="error" messages={messages}/>;
      Toast.update(toastId, toastOption);
      activeToasts.push(err);
      return;
    }
    activeToasts.push(err);
    toastId = Toast(<ToastBox messages={messages} type="error"/>, toastOption);
  },
  warn: Toast.warn
};

export const POSITION = Toast.POSITION;
