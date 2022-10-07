const reserved = [
    'program', 'procedure', 'var', 'int', 'boolean', 'read',
    'write', 'true', 'false', 'begin', 'end', 'if', 'then',
    'else', 'while', 'do', 'div', 'not',
];

const simbols = [
    '>', '<', '<>', '<=', '>=', ':=', '=', ';', ',', '(', ')'
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

function isIdentifier(codeSplited) {
    return (/[a-zA-Z]/).test(codeSplited);
};

function IdentifierHasMaxLength(codeSplited) {
    return codeSplited.length > 15;
};

function NumberHasMaxLength(codeSplited) {
    return codeSplited.length > 20;
};

function getInputValue() {
    return document.querySelector('textarea').value;
}

// Split code inputed and open modal if result lexical
function calculateInput(e) {
    if (e) e.preventDefault();
    const str = getInputValue();

    const strSplited = splitCode(str);
    let message = '';
    for (let i = 0; i < strSplited.length; i++) {
        const char = strSplited[i];
        if (isNumber(char)) {
            if (NumberHasMaxLength(char)) message = message.concat('\n\n', `ERRO: ${char} -> NUMERO PRECISA TER NO MÁXIMO 20 CARACTERES`);
            else message = message.concat('\n\n', `${char} -> NÚMERO`);
        }
        else if (isReserved(char)) message = message.concat('\n\n', `${char} -> PALAVRA RESERVADA`);
        else if (isSimbol(char)) message = message.concat('\n\n', `${char} -> É UM SÍMBOLO`);
        else if (isIdentifier(char)) {
            if (IdentifierHasMaxLength(char)) message = message.concat('\n\n', `ERRO: ${char} -> IDENTIFICADOR PRECISA TER NO MÁXIMO 15 CARACTERES`);
            else message = message.concat('\n\n', `${char} -> IDENTIFICADOR`);
        }
    }

    const modal = document.getElementById('modal');
    const content = document.querySelector('.content');
    content.innerHTML = message;
    modal.style.display = 'block';
    return message;
};


// Close modal when click outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');

    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
