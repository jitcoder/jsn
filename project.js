const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const glob = require('glob');

class Project {
  constructor(rootPath, config) {
    this.inputs = glob.sync(path.join(rootPath, '**/*.js'));
    this.sources = [];
    this.headers = [];
    this.debug = false;
    this.paths = {
      root: rootPath,
      outputPath: path.join(rootPath, 'gen')
    };
    this.config = config;
    this.clean();
  }

  addRuntime(runtime) {
    if (runtime.sources) {
      this.sources = [...this.sources, ...runtime.sources];
    }

    if (runtime.headers) {
      this.headers = [...this.headers, ...runtime.headers];
    }
  }

  addFiles(src) {
    if (src instanceof Array) {
      for (let i = 0; i < src.length; i += 1) {
        this.addFiles(src[i]);
      }
    } else {
      if (path.extname(src) === '.js') {
        this.inputs.push()
      }
      this.sources.push(src);
    }
  }

  clean() {
    if (fs.existsSync(this.paths.outputPath)) {
      const files = glob.sync(path.join(this.paths.outputPath, '/**/*'));
      for (let i = 0; i < files.length; i += 1) {
        try {
          fs.unlinkSync(files[i]);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  generateProject() {
    let lines = [];
    lines.push('cmake_minimum_required(VERSION 2.8.9)');
    lines.push(`project (${this.config.name})`);
    lines.push(`set(CMAKE_BUILD_TYPE ${this.debug ? 'Debug' : 'Release'})`);
    lines.push(`add_executable(${this.config.name}`);
    lines = [...lines, ...this.sources.map(s => s.split('\\').join('/'))];
    lines = [...lines, ...this.headers.map(s => s.split('\\').join('/'))];
    lines.push(')');
    if (!fs.existsSync(this.paths.outputPath)) {
      fs.mkdirSync(this.paths.outputPath);
    }

    fs.writeFileSync(path.join(this.paths.outputPath, 'CMakeLists.txt'), lines.join('\n'), 'utf-8');
    cp.execSync(`cmake ${this.paths.outputPath}`, { cwd: this.paths.outputPath });
  }

}

module.exports = Project;
