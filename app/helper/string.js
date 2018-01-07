export const format = (string, args) => {
  let str = string.toString()

  for (const key in args) {
    str = str.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key])
  }

  return str
}

export const generateId = (len) => {
  function byteToHex (byte) {
    return ('0' + byte.toString(16)).slice(-2)
  }

  const arr = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(arr)
  return [].map.call(arr, byteToHex).join('')
}
