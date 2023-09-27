const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}
const warn = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(...params)
  }
}

module.exports = {
  error, info, warn
}