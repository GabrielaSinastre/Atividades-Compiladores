const parser = function(tokens) {
    let current = 0;
    const reserved = ['var', 'if', 'else', 'while', 'for', 'function', 'return'];
    const operators = ['OP_SOMA', 'OP_SUB', 'OP_MULTI', 'OP_DIV', 'OP_IGUAL'];
  
    const walk = function() {
      let token = tokens[current];
  
      if (token.type === 'NUMBER') {
        current++;
        return {
          type: 'NumberLiteral',
          value: token.value,
        };
      }

      if (token.type === 'INTEIRO') {
        current++;
        return {
          type: 'IntegerLiteral',
          value: token.value,
        };
      }
  
      if (operators.includes(token.type)) {
        current++;
        return {
          type: 'Operator',
          value: token.value,
        };
      }

      if (token.type === 'PALAVRA') {
        current++;
        return {
          type: 'StringLiteral',
          value: token.value,
        };
      }
  
      if (token.type === 'PAREN' && token.value === '(') {
        token = tokens[++current];
        let node;
        if (reserved.includes(token.value)) {
          node = {
            type: 'ControlExpression',
            name: token.value,
            params: [],
          };
        } else {
          node = {
            type: 'CallExpression',
            name: token.value,
            params: [],
          };
        }
        token = tokens[++current];
        while (
          (token.type !== 'PAREN') ||
          (token.type === 'PAREN' && token.value !== ')')
        ) {
          node.params.push(walk());
          token = tokens[current];
        }
        current++;
        return node;
      }
  
      throw new TypeError(token.type);
    };
  
    let ast = {
      type: 'Program',
      body: [],
    };
    while (current < tokens.length) {
      ast.body.push(walk());
    }
    return ast;
  };

  module.exports = parser;
  