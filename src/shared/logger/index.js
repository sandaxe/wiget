// import StackTrace from 'stacktrace-js';

// import { StoreProvider } from './store.provider';

// let logQueue = [];

// function sendMessageToServer() {
//   return;
//   // if(logQueue.length === 0) return;
//   // let log = logQueue.splice(0, 1)[0];
//   // let isQueued = navigator.sendBeacon(url, log);
//   // console.log('log is queued', isQueued, log);
//   // if(!isQueued) {
//   //   logQueue.unshift(log);
//   // }
//   // while(logQueue.length) {
//   //   sendMessageToServer();
//   // }
// }

// const getTimeStamp = () => {
//   return new Date().toString();
// };

// const getTrace = function(stackFrames) {
//   let stringifiedStack = stackFrames.slice(1, -1).map(function(sf) {
//     return sf.toString();
//   }).join('\n');
//   return stringifiedStack;
// };

// function logMessage() {
//   if(process.env.REACT_APP_LOGGER === 'false') return;
//   let accountDetails = StoreProvider.getStore('App').get('accountDetails');
//   let userDetails = StoreProvider.getStore('App').get('userDetails');
//   let timeStamp = getTimeStamp();
//   // There is already a loop running om 'sendMessageToServer' method to make sure logs are being sent.
//   // That loop will stop when the logQueue is empty.
//   // Trigger sending message to server only if logQueue is empty.
//   let shouldSendMessageToServer = logQueue.length === 0;
//   let argumentList = Array.from(arguments);
//   logQueue.push({
//     accountId: accountDetails._id,
//     userId: userDetails._id,
//     timeStamp,
//     type: argumentList[0],
//     message: argumentList.slice(1, -1).join('\n'),
//     trace: argumentList.slice(-1)
//   });
//   if(shouldSendMessageToServer) {
//     sendMessageToServer();
//   }
// }

// const callback = (type, ...args) => (stackFrames) => {
//   let trace = getTrace(stackFrames);
//   logMessage(type, ...args, trace);
// };

// var errCallback = () => {};

// Captures all runtime errors
window.onerror = function(msg, file, line, col, error) {
  //Logger.error(error);
};

export const Logger = {
  log() {
    // StackTrace.get().then(callback('Info', ...arguments)).catch(errCallback);
  },

  warn() {
    // StackTrace.get().then(callback('Warn', ...arguments)).catch(errCallback);
  },

  error(err) {
    let type = typeof err;
    if(type === 'object') {
      // StackTrace.fromError(err).then(callback('Error', ...arguments)).catch(errCallback);
    }else {
      // StackTrace.get().then(callback('Error', ...arguments)).catch(errCallback);
    }
  },

  info() {
    // StackTrace.get().then(callback('Info', ...arguments)).catch(errCallback);
  }
};


const consoleLog = console.log;
function fakeLog() {
  //do nothing for console.log
  if(window.enableLog) {
    consoleLog(...arguments);
  }
}
//do not print anything in console except error;
/*
console.log = fakeLog;
console.info = fakeLog;
console.warn = fakeLog;
console.error = fakeLog;
console.memory = fakeLog;
*/
