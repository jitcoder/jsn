'use strict';

const babel = require('babel-core');

const options = {
  presets: ['es2015']
}

const ast = babel.transformFile('./app.js', options, (err, result) => {
  const v = new Visitor();
  v.visit(result.ast.program, 0);

  console.log('done');
});


function visitNode(node, tabsize) {
  console.log(`${fillString(' ', tabsize)}${node.type}`);
  const children = getChildren(node, tabsize);
  for (let i = 0; i < children.length; i++){
    visitNode(children[i], tabsize + 2);
  }
}



class Visitor {

  visit(node, indent) {
    const children = this[node.type.toLowerCase()](node, indent);
    if (children) {
      for (let i = 0; i < children.length; i++){
        this.visit(children[i], indent + 2);
      }
    }
  }

  program(node, tabsize) {
    print('Program', tabsize);
    return node.body;
  }

  variabledeclaration(node, tabsize) {
    print(`JValue_declareVariable`,tabsize);
    return node.declarations;
  }

  variabledeclarator(node, tabsize) {
    print(`$ ${node.id.name}`, tabsize + 2);
  }

  identifier(node, tabsize) {
    print(`variable ${node.name}`, tabsize);
  }

  expressionstatement(node, tabsize) {
    switch (node.expression.type) {
      case 'CallExpression':
        print(`call-function ${node.expression.callee.name} with arguments: `, tabsize);
        return node.expression.arguments;
    }
    debugger;
  }
}

function print(message, tabsize) {
  console.log(`${fillString(' ', tabsize)}${message }`);
}

function getChildren(node, tabsize) {
  switch (node.type) {
    case 'Program':
      return node.body;
    case 'VariableDeclaration':
      return node.declarations;
    case 'VariableDeclarator':
      console.log(`${fillString(' ', tabsize+2)}:: ${node.id.name}`);
      return [];
    case 'ExpressionStatement':
      return node.expression;
  }
}

function fillString(character, size) {
  let result = '';

  for (let i = 0; i < size; i++){
    result += character;
  }

  return result;
}