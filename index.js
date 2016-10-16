const babel = require('babel-core');
const fs = require('fs');
const path = require('path');

const Visitor = require('./visitor');

const options = {
  presets: ['es2015']
};

console.log(`${JSON.stringify(process.argv, null, 2)}`);

const projectPath = process.argv[2];
const project = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));

console.log(`Building ${project.name}...`);



babel.transformFile(path.join(projectPath, project.entry), options, (err, result) => {
  const v = new Visitor();
  v.visit(result.ast.program, 0);

  const buildPath = path.join(projectPath, 'build');


  fs.writeFileSync('./jsenv/app.c', v.code);
  process.exit(0);
});

function createCMake(project, path) {
  const build = process.env.NODE_ENV === 'production' ? 'set(CMAKE_BUILD_TYPE Debug)' : '';
  const headers = [
    'runtime/const.h',
    'runtime/types/JValue.h',
    'runtime/error/trycatch.h',
    'runtime/error/exception.h'
  ];
  const sources = [
    'runtime/types/JValue.c',
    'runtime/error/trycatch.c'
  ];

  fs.writeFileSync(path.join(path, 'CMakeLists.txt'),
`
cmake_minimum_required(VERSION 2.8.9)
project (app)
${build}
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/lib)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY \${CMAKE_BINARY_DIR}/bin)
add_executable(app 
  runtime/const.h
  runtime/types/JValue.h
  runtime/error/trycatch.h
  runtime/error/exception.h
  $headers
  $modules
  runtime/types/JValue.c
  runtime/error/trycatch.c
)
`);
}
