const fs = require('fs');
const { print } = require('./util');

const stub = fs.readFileSync('./runtime/stub.c', 'utf8');


class Visitor {

  constructor() {
    this.code = '';
  }

  visit(node, indent) {
    const nodeTypeFunc = this[node.type.toLowerCase()];
    if (nodeTypeFunc) {
      const children = nodeTypeFunc.bind(this, node, indent)();
      if (children) {
        for (let i = 0; i < children.length; i += 1) {
          this.visit(children[i], indent + 2);
        }
      }
    } else {
      throw new Error(`unsupported node: ${node.type}`);
    }
  }

  emit(tailCode) {
    this.code = this.code.replace('//%%TAIL%%', tailCode);
  }

  program(node, tabsize) {
    print('Program', tabsize);
    this.code = stub;
    return node.body;
  }

  variabledeclaration(node, tabsize) {
    print('JValue_declareVariable', tabsize);
    const identifier = node.declarations[0].id.name;
    this.emit(
      `
      struct JValue *${identifier} = JValue_declareVariable("${identifier}");
      //%%TAIL%%
      `
    );
    return node.declarations;
  }

  variabledeclarator(node, tabsize) {
    print(`$ ${node.id.name}`, tabsize + 2);
    if (node.init) {
      let initType = 'String';
      let initValue = `"${node.init.value}"`;

      if (node.init.type === 'NumberLiteral') {
        initType = 'Integer';
        initValue = node.init.value;
      }
      this.emit(
        `
        JValue_set${initType}Value(${node.id.name}, ${initValue});
        //%%TAIL%%
        `
      );
    }
  }

  identifier(node, tabsize) {
    print(`variable ${node.name}`, tabsize);
    // this.emit(`${node.name}`)
  }

  expressionstatement(node, tabsize) {
    switch (node.expression.type) {
      case 'CallExpression':
        print(`call-function ${node.expression.callee.name} with arguments: `, tabsize);
        this.emit(`${node.expression.callee.name}(//%%TAIL%%)`);
        const args = node.expression.arguments;

        for (let i = 0; i < args.length; i += 1) {
          const arg = args[i];

          if (arg.type === 'Identifier') {
            this.emit(`${arg.name}//%%TAIL%%`);
          } else {
            throw new Error(`unsupported argument type: ${arg.type}`);
          }

          if (i < args.length && i < args.length - 1) {
            this.emit(', //%%TAIL%%');
          }

          if (i === node.expression.arguments.length - 1) {
            this.emit(');\n//%%TAIL%%');
          }
        }

        return node.expression.arguments;
      default:
        throw new Error(`unsupported expression: ${node.expression.type}`, tabsize);
    }
  }
}

module.exports = Visitor;
