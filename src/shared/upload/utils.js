function divmod(x, y) {
  let div = Math.trunc(x / y);
  let rem = x % y;
  return [div, rem];
}

function s4() {
  return intToBase64(Math.floor((1 + Math.random()) * 0x10000));
}

function intToBase64(num) {
  // """Converts a positive integer into a base36 string."""
  let digits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
  let res = "";
  let i;
  while (!res || num > 0) {
    let result = divmod(num, 64);
    num = result[0];
    i = result[1];
    res = digits[i] + res;
  }
  return res;
}

export function generateShortId(name = "ShortId") {
  return `${name}-${s4() + intToBase64(new Date().getTime())}`;
}

export function getPrefix(prefix) {
  let start = prefix.startsWith('/') ? 1 : 0;
  let end = prefix.endsWith('/') ? prefix.length - 1 : prefix.length;
  return prefix.slice(start, end);
}

export function generateFileKey(name, prefix) {
  return `${prefix}/${generateShortId('Attach')}/${name}`;
}

export function getIndex(array, key, value) {
  let index;
  for (let i = 0; i < array.length; i++) {
    if(array[i][key] === value) {
      index = i;
      break;
    }
  }
  return index;
}

export function getFileExtension(name) {
  if(name.lastIndexOf('.') === -1) {
    return 'unknown';
  }else{
    let extension = name.split('.').pop();
    return extension.toLowerCase();
  }
}

export function showMessage(message, color) {
  let x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = message || "";
  if(color) {
    x.style['background-color'] = color;
  }
  setTimeout(function() { x.className = x.className.replace("show", ""); }, 3000);
}

