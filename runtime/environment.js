const path = require('path');

module.exports = {
  sources: [
    path.resolve('types', 'JValue.c'),
    path.resolve('error', 'trycatch.c')
  ],
  headers: [
    path.resolve('const.h'),
    path.resolve('types', 'JValue.h'),
    path.resolve('error', 'trycatch.h'),
    path.resolve('error', 'exception.h')
  ]
}
