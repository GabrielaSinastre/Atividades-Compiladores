const reserved = [
    'program', 'procedure', 'var', 'int', 'boolean', 'read',
    'write', 'true', 'false', 'begin', 'end', 'if', 'then',
    'else', 'while', 'do', 'div', 'not',
];

const simbols = [
    '>', '<', '<>', '<=', '>=', ':=', '=', ';', ','
];

const comments = [
    '//', '{', '}'
];

function splitCode(code) {
    const splited = code.split(/(\s+)/);

    for (let i = 0; i < splited.length; i++) {
        if ((/(\s+)/).test(splited[i])) splited.splice(i, 1);
    }

    return splited;
};

function isReserved(codeSplited) {
    return reserved.includes(codeSplited);
};

function isSimbol(codeSplited) {
    return simbols.includes(codeSplited);
};

function isNumber(codeSplited) {
    return !isNaN(Number(codeSplited));
}

function isIdentifier(str) {
    return (/[a-zA-Z]/).test(str);
};

function IdentifierHasMaxLength(str) {
    return str.length > 15;
};

function calculateInput(e) {
    if (e) e.preventDefault();
    const str = document.querySelector('input').value;
    const strSplited = splitCode(str);
    let message = '';
    for (let i = 0; i < strSplited.length; i++) {
        const char = strSplited[i];
        if (isNumber(char)) message = message.concat('\n', `${char} -> NÚMERO`);
        else if (isReserved(char)) message = message.concat('\n', `${char} -> PALAVRA RESERVADA`);
        else if (isSimbol(char)) message = message.concat('\n', `${char} -> É UM SÍMBOLO`);
        else if (isIdentifier(char)) {
            if (IdentifierHasMaxLength(str)) message = message.concat('\n', `ERRO: ${char} -> IDENTIFICADOR PRECISA TER NO MÁXIMO 15 CARACTERES`);
            else message = message.concat('\n', `${char} -> IDENTIFICADOR`);
        }
    }

    window.alert(message);
    return message;
};
