const babel = require('babel-core');
const fs = require('fs');
const path = require('path');
const Visitor = require('./visitor');
const Project = require('./project');
const environment = require('./runtime/environment');
const glob = require('glob');

const options = {
  presets: ['es2015']
};

console.log(`${JSON.stringify(process.argv, null, 2)}`);

const jsnPath = path.dirname(__filename);
const cwd = process.cwd();

const projectPath = path.join(cwd, process.argv[2]);
const projectConfig = JSON.parse(fs.readFileSync(path.join(projectPath, 'project.json'), 'utf-8'));

function js2C(f) {
  return path.join(path.dirname(f), 'gen', `${path.basename(f, '.js')}.c`);
}


const project = new Project(projectPath, projectConfig);
project.addRuntime(environment);
project.addFiles(glob.sync(path.join(projectPath, '**/*.js')).filter(f => !path.dirname(f).endsWith('gen')).map(js2C));
project.addFiles(glob.sync(path.join(projectPath, '**/*.h')));

console.log(`Building ${project.config.name}...`);

babel.transformFile(path.join(projectPath, project.config.entry), options, (err, result) => {
  const v = new Visitor();
  v.visit(result.ast.program, 0);
  fs.writeFileSync(path.join(project.paths.root, js2C(project.config.entry)), v.code);
  project.generateProject();
  project.build();
  process.exit(0);
});

