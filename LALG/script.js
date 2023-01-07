const Lexico = require('./lexico');
const parser = require('./sintatico');
const util = require('util');

const input = '(add 2 (subtract 4 (multiply 2 2)))';
const lexico = new Lexico(input);
const tokens = [];

let token = lexico.getNextToken();
while (token.type !== 'EOF') {
  tokens.push(token);
  token = lexico.getNextToken();
}
console.log('ANALISADOR LEXICO', util.inspect(tokens, false, null, true));

let ast = parser(tokens);
console.log('ANALISADOR SINTATICO', util.inspect(ast, false, null, true));
// console.log(JSON.stringify(ast, null, 1));
