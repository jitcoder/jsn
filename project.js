const fs = require('fs');
const generate = require('./templating');
const path = require('path');

class Project {
  constructor(rootPath) {
    this.sources = [];
    this.headers = [];
    this.debug = false;
    this.paths = {
      root: rootPath
    };
  }

  addRuntime(runtime) {
    if (runtime.sources) {
      this.sources = [...this.sources, ...runtime.sources];
    }

    if (runtime.headers) {
      this.headers = [...this.headers, ...runtime.headers];
    }
  }

  generateCMake(env) {
    fs.writeFileSync()
  }

}

module.exports = Project;
