export const format = (string, args) => {
  let str = string.toString()

  for (const key in args) {
    str = str.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key])
  }

  return str
}
