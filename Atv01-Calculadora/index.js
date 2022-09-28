const operators = [
  '+',
  '-',
  '/',
  '*',
  '**',
  '(',
  ')'
];

function splitStrings(str) {
  let operatorsAux = [];
  const re = new RegExp('[+, -]');
  for (let i = 0; i<str.length; i++) {
    if (operators.includes(str[i]) && !operatorsAux.includes(str[i])) operatorsAux.push(str[i]);
  }

  return str.split(re).concat(operatorsAux);

};


 function negativeNumbers(str) {
    return Number(str) < 0;
};

function positiveNumbers(str) {
    return Number(str) > 0;
};

function isInvalidChar(str) {
    return (/[a-zA-Z]/).test(str) && !operators.includes(str);
};

function calculateInput(e) {
    if (e) e.preventDefault();
    const str = document.querySelector('input').value;
    const strSplited = splitStrings(str);
    let message = '';
    for (let i = 0; i < strSplited.length; i++) {
        const char = strSplited[i];
        if (negativeNumbers(char)) message = message.concat('\n', `${char} -> NÚMERO NEGATIVO`);
        else if (positiveNumbers(char)) message = message.concat('\n', `${char} -> NÚMERO POSITIVO`);
        else if (isInvalidChar(char)) message = message.concat('\n', `${char} -> CARACTER INVÁLIDO`);
        else if (char === '+') message = message.concat('\n', "(+) -> OPERADOR DE SOMA")
        else if (char === '-')
            message = message.concat('\n', "(-) -> OPERADOR DE SUBTRAÇÃO")
        else if (char === '*')
            message = message.concat('\n', "(*) -> OPERADOR DE MULTIPLICAÇÃO")
        else if (char === '**')
            message = message.concat('\n', "(**) -> OPERADOR DE EXPONENCIAÇÃO")
        else if (char === '/')
            message = message.concat('\n', "(/) -> OPERADOR DE DIVISÃO")
        else if (char === ')')
            message = message.concat('\n', " ) -> DELIMITADOR PARENTESES")
        else if (char === '(')
            message = message.concat('\n', " ( -> DELIMITADOR PARENTESES");
    }
    window.alert(message);
    return message;
};

console.log(splitStrings('1+22+3'));
