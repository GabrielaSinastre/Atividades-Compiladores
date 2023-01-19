const util = require('util');

const lexico = require('./lexical');
const parser = require('./parser');

// Coloque o código aqui
const input = `program ADD_NUMEROS;

var

X : integer;

A : integer;

B : integer;

begin

     writeln ('entre com o primeiro valor: ');

readln(A);

writeln ('entre com o segundo valor: ');

readln(B);

X := A + B;

writeln('A soma e = ', X);

end.`;

const { tokensPatterns, errors } = lexico(input);
const parserErrors = parser(tokensPatterns);

console.log('ANALISADOR LEXICO', util.inspect(tokensPatterns, false, null, true));
console.log('Erros léxicos', util.inspect(errors, false, null, true));

console.log('ANALISADOR SINTATICO', util.inspect(parserErrors, false, null, true));