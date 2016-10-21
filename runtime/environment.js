const path = require('path');

module.exports = {
  sources: [
    path.join(__dirname, 'types', 'JValue.c'),
    path.join(__dirname, 'error', 'trycatch.c')
  ],
  headers: [
    path.join(__dirname, 'const.h'),
    path.join(__dirname, 'types', 'JValue.h'),
    path.join(__dirname, 'error', 'trycatch.h'),
    path.join(__dirname, 'error', 'exception.h')
  ]
}
