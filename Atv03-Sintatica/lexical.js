const reserved = [
    'program', 'procedure', 'var', 'int', 'boolean', 'read',
    'write', 'true', 'false', 'begin', 'end', 'if', 'then',
    'else', 'while', 'do', 'div', 'not', 'integer'
];

const simbols = [
    '>', '<', '<>', '<=', '>=', ':=', '=', ';', ',', '(', ')', ':',
    '+',
    '-',
    '/',
    '*',
    '.',
    '**',
    '"',
    "'",
];

const comments = [
    '//', '{', '}'
];

function splitCode(code) {
    const separateLines = code.split(/\r?\n|\r|\n/g);
    let tokensForLine = [];

    for (let i = 0; i < tokensForLine.length; i++) if ((/(\s+)/).test(tokensForLine[i])) tokensForLine.splice(i, 1);

    separateLines.forEach((line, index) => {
        // Separa o código por quebra de linha e pelos simbolos
        let currentTokens = line.split(/(\s+|[+, -, /, *, **, (, ), <, >, <>, <=, =>, :=, =, ;, ,, //, {, }, :, ., ', "])/);
        // Filtra espaços em brancos e vazio
        currentTokens = currentTokens.filter((token) => token && !(/(\s)/g).test(token));
        // Adiciona os tokens em array por linha
        if (currentTokens.length > 0) {
            tokensForLine.push({
                line: index + 1,
                tokens: currentTokens,
            })
        }
    });

    return tokensForLine;
};

function isReserved(codeSplited) {
    return reserved.includes(codeSplited);
};

function isSimbol(codeSplited) {
    return simbols.includes(codeSplited);
};

function isComment(codeSplited) {
    return comments.includes(codeSplited);
}

function isNumber(codeSplited) {
    return codeSplited && !isNaN(Number(codeSplited));
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

function verifyCommentIsClosed(codeSplitedArray) {
    const allCommentsOpened = codeSplitedArray.filter((code) => code === '{');
    const allCommentsClosed = codeSplitedArray.filter((code) => code === '}');

    return allCommentsClosed.length === allCommentsOpened.length;
}

// Split code inputed and open modal if result lexical
function calculateInput(str) {
    const tokensPerLine = splitCode(str);
    const tokensPatterns = [];
    const errors = [];

    tokensPerLine.forEach(({ tokens, line }) => {
        for (let i = 0; i < tokens.length; i++) {
            const char = tokens[i];
            if (isNumber(char)) {
                tokensPatterns.push({ lexema: char, token: 'num', line });
                if (NumberHasMaxLength(char)) errors.push({ error: `"${char}" -> NUMERO PRECISA TER NO MÁXIMO 20 CARACTERES.`, line });
            }
            else if (isReserved(char)) tokensPatterns.push({ lexema: char, token: 'reserved', line });
            else if (isSimbol(char)) tokensPatterns.push({ lexema: char, token: 'simbol', line });
            else if (isComment(char)) {
                tokensPatterns.push({ lexema: char, token: 'comment', line });
                if (!verifyCommentIsClosed(tokens)) errors.push({ error: `" ${char} " -> Comentário não foi fechado.`, line });
            }
            else if (isIdentifier(char)) {
                tokensPatterns.push({ lexema: char, token: 'id', line });
                if (IdentifierHasMaxLength(char)) errors.push({ error: `" ${char} " -> IDENTIFICADOR PRECISA TER NO MÁXIMO 15 CARACTERES.`, line });
            }
            else if (char) errors.push({ error: `" ${char} " -> CARACTER INVÁLIDO.`, line });
        }
    })

    // Tokens classificados para ser usado no parser (sintatico)
    return { tokensPatterns, errors };
};

module.exports = calculateInput;