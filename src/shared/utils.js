import shortid from 'shortid';
import _findIndex from 'lodash/findIndex';

function generateId(name) {
  return `${name}-${shortid.generate()}`;
}

function getCurrentModelId(history) {
  let url = history.location.pathname;
  return url.split("/")[2];
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2
  // the default value for minimumFractionDigits depends on the currency
  // and is usually already 2
});
function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
function isoFormatDMY(d) {
  function pad(n) {return (n < 10 ? '0' : '') + n;}
  return pad(d.getUTCDate()) + '/' + pad(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear();
}

function parsedDate(s) {
  let date = parseISOString(s);
  return isoFormatDMY(date);
}
/*
var s = '2014-11-03T19:38:34.203Z';
var date = parseISOString(s);

console.log(isoFormatDMY(date)); // 03/11/2014 */

function values(obj) {
  const result = [];
  for (const k in obj) {
    result.push(obj[k]);
  }
  return result;
}

function getEpochString(timestamp) {
  // Epochs
  const epochs = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['min', 60]
    // ['sec', 1]
  ];

  // Get duration
  const getDuration = (timeAgoInSeconds) => {
    for (let [name, seconds] of epochs) {
      const interval = Math.floor(timeAgoInSeconds / seconds);

      if (interval >= 1) {
        return {
          interval: interval,
          epoch: name
        };
      }
    }
  };

  const timeAgoInSeconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  const epochDetail = getDuration(timeAgoInSeconds);
  if(!epochDetail) {
    return "now";
  }
  const { interval, epoch } = getDuration(timeAgoInSeconds);
  const suffix = interval === 1 ? '' : 's';
  return `${interval} ${epoch}${suffix} ago`;
}

function parseQueryString(queryString) {
  var assoc = {};
  var keyValues = (queryString || window.location.search).slice(1).split('&');
  var decode = function(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  };

  for (var i = 0; i < keyValues.length; ++i) {
    var key = keyValues[i].split('=');
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  }

  return assoc;
}

function decodeJWTToken(token) {
  var payload = JSON.parse(atob(token.split('.')[1]));
  return payload;
}

function hideShow(col, allColumns, allFields) {
  if(col !== 'hideall' && col !== 'showall') {
    let index = _findIndex(allColumns, function(o) { return o.Id === col.Id; });
    if(index !== -1) {
      allColumns[index]['Visible'] = !col.Visible;
    }else{
      let newcol = {
        Visible: true,
        Id: col.Id
      };
      allColumns.push(newcol);
    }
  }else if(col === 'hideall') {
    allColumns = [];
  }else{
    allColumns = allFields;
    allColumns.forEach((column, index) => {
      allColumns[index]['Visible'] = true;
    });
  }
  return allColumns;
}

function hideShowSmall(col, allColumns, allFields) {
  if(col !== 'hideall' && col !== 'showall') {
    let index = _findIndex(allColumns, function(o) { return o.id === col.id; });
    if(index !== -1) {
      allColumns[index]['Visible'] = !col.Visible;
    }else{
      let newcol = {
        Visible: true,
        id: col.id
      };
      allColumns.push(newcol);
    }
  }else if(col === 'hideall') {
    allColumns = [];
  }else{
    allColumns = allFields;
    allColumns.forEach((column, index) => {
      allColumns[index]['Visible'] = true;
    });
  }
  return allColumns;
}

function isNumber(evt) {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

const storeAuthTokens = (tokens) => {
  localStorage.setItem("authTokens", JSON.stringify(tokens));
};

const getAuthTokens = () => {
  try{
    if(localStorage.authTokens) {
      return JSON.parse(localStorage.authTokens);
    }
  }catch(err) {
    console.error(err);
  }
  return false;
};


export { hideShowSmall, isNumber, hideShow, generateId, getCurrentModelId,
  values, getEpochString, parseQueryString, decodeJWTToken, getAuthTokens, storeAuthTokens, formatter, isoFormatDMY, parsedDate };
