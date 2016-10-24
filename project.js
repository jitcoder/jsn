const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const glob = require('glob');
const os = require('os');
const PrettyError = require('pretty-error');
const copy = require('copy');

const pe = new PrettyError();
const runtimePath = path.join(path.dirname(__filename), 'runtime');
const WIN = os.type() === 'Windows_NT';

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
    this.ensureOutputDir();
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
      this.sources.push(src);
    }
  }

  clean() {
    try {
      if (fs.existsSync(this.paths.outputPath)) {
        if (WIN) {
          cp.execSync(`rmdir "${this.paths.outputPath}" /S /Q`);
        } else {
          cp.execSync(`rm -rf ${this.paths.outputPath}`);
        }
      }
    } catch (e) {
      console.log('Clean failed..');
      console.log(pe.render(e));
    }

    // if (fs.existsSync(this.paths.outputPath)) {
    //   const files = glob.sync(path.join(this.paths.outputPath, '/**/*'));
    //   for (let i = 0; i < files.length; i += 1) {
    //     try {
    //       fs.unlinkSync(files[i]);
    //     } catch (e) {
    //       console.error(e);
    //     }
    //   }
    // }
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.paths.outputPath)) {
      fs.mkdirSync(this.paths.outputPath);
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
    this.ensureOutputDir();
    try {
      if (WIN) {
        cp.execSync(`robocopy ${runtimePath} ${this.paths.outputPath} /s /e`);
      } else {
        cp.execSync(`cp -rf ${runtimePath} ${this.paths.outputPath}`);
      }
    } catch (e) {
      
    }


    fs.writeFileSync(path.join(this.paths.outputPath, 'CMakeLists.txt'), lines.join('\n'), 'utf-8');
    cp.execSync(`cmake ${this.paths.outputPath}`, { cwd: this.paths.outputPath });
  }

  build() {
    cp.execSync('cmake --build .', { cwd: this.paths.outputPath, stdio: [0, 1, 2] });
  }

}

module.exports = Project;
