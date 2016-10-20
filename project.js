const fs = require('fs');
const path = require('path');
const cp = require('child_process');

class Project {
  constructor(rootPath, config) {
    this.sources = [];
    this.headers = [];
    this.debug = false;
    this.paths = {
      root: rootPath
    };
    this.config = config;
  }

  addRuntime(runtime) {
    if (runtime.sources) {
      this.sources = [...this.sources, ...runtime.sources];
    }

    if (runtime.headers) {
      this.headers = [...this.headers, ...runtime.headers];
    }
  }

  generateProject() {
    let lines = [];
    lines.push('cmake_minimum_required(VERSION 2.8.9)');
    lines.push(`project (${this.config.name})`);
    lines.push(`set(CMAKE_BUILD_TYPE ${this.debug ? 'Debug' : 'Release'})`);
    lines.push(`add_executable(${this.config.name}`);
    lines = [...lines, ...this.sources];
    lines = [...lines, ...this.headers];
    lines.push(')');

    fs.writeFileSync(path.join(this.paths.root, 'CMakeLists.txt'));
    cp.execSync('cmake .', { cmd: this.paths.root });
  }

}

module.exports = Project;
