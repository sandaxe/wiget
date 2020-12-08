var _ = require('lodash');
var globalStore;

function getInstance() {
  if (!globalStore) globalStore = createStore();
  return globalStore;
}

function createStore() {
  var currentState = {};
  var subscribers = [];
  var currentReducerSet = {};
  currentReducer = function(state, action) {
    return state;
  };

  function dispatch(action) {
    var prevState = currentState;
    currentState = currentReducer(_.cloneDeep(currentState), action);
    subscribers.forEach(function(subscriber) {
      subscriber(currentState, prevState);
    });
  }

  function addReducers(reducers) {
    currentReducerSet = _.assign(currentReducerSet, reducers);
    currentReducer = function(state, action) {
      var ret = {};
      _.each(currentReducerSet, function(reducer, key) {
        ret[key] = reducer(state[key], action);
      });
      return ret;
    };
  }

  function subscribe(fn) {
    subscribers.push(fn);
  }

  function unsubscribe(fn) {
    subscribers.splice(subscribers.indexOf(fn), 1);
  }

  function getState() {
    return _.cloneDeep(currentState);
  }

  return {
    addReducers,
    dispatch,
    subscribe,
    unsubscribe,
    getState
  };
}
module.exports = getInstance();
