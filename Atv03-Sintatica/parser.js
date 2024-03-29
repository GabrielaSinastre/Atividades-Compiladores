const types = [
    'byte',
    'shortint',
    'smallint',
    'word',
    'integer',
    'cardinal',
    'longint',
    'longword',
    'int64',
    'qword'
];

const verifyVars = (tokens, index) => {
    let declaretedVars = [];
    let nextTokenIndex = index + 1;
    let nextToken = tokens[nextTokenIndex];

    if (nextToken.token !== 'id') return { error: `É esperado um identificador, porém um ${nextToken.token} "${nextToken.lexema}" foi recebido`, line: nextToken.line };
    declaretedVars.push(nextToken.lexema);

    // Após o primeiro identificador, precisamos verificar as proximas regras
    nextTokenIndex = nextTokenIndex + 1;
    nextToken = tokens[nextTokenIndex];
    // Primeiro de declaração x, y, z: integer;
    if (nextToken.lexema === ',') {
        // O próximo precisa ser um identificador
        while (nextToken.lexema !== ':') {
            if (nextToken.lexema === ':') break;
            if (nextToken.lexema !== ',') return { error: `É esperado o simbolo ",", mas um ${nextToken.token} "${nextToken.lexema}" foi recebido`, line: nextToken.line };
            // Pula as virgurlas e verifica se é um id
            nextTokenIndex = nextTokenIndex + 1;
            nextToken = tokens[nextTokenIndex];
            if (nextToken.token !== 'id') return { error: `É esperado um identificador, mas um ${nextToken.token} "${nextToken.lexema}" foi recebido`, line: nextToken.line };
            declaretedVars.push(nextToken.lexema);
            // Pula as virgurlas e verifica se é um id
            nextTokenIndex = nextTokenIndex + 1;
            nextToken = tokens[nextTokenIndex];
        }
    }

    // Segundo caso de declaração x : int;
    if (nextToken.lexema === ':') {
        while (nextToken.lexema !== ';' || tokens[nextTokenIndex + 1].token === 'id') {
            if (nextToken.lexema === ':') {
                // O próximo precisa ser um tipo definido em pascal (int, boolean, etc)
                nextTokenIndex = nextTokenIndex + 1;
                nextToken = tokens[nextTokenIndex];

                if (nextToken.token !== 'reserved') return { error: `É esperado uma declaração de tipo, porém um ${nextToken.token}: "${nextToken.lexema}" foi recebido`, line: nextToken.line };
                if (!types.includes(nextToken.lexema)) return { error: `É esperado um tipo definido do pascal, porém o tipo "${nextToken.lexema}" foi recebido`, line: nextToken.line };
                // Apos a definicao de tipo o proximo token precisa finalizar com um ';';
                nextTokenIndex = nextTokenIndex + 1;
                nextToken = tokens[nextTokenIndex];


                if (nextToken.lexema !== ';') return { error: `É esperado um ";" para finalizar a declaração, porém um "${nextToken.lexema}" foi recebido`, line: nextToken.line };
            }

            else if (tokens[nextTokenIndex + 1].token === 'id') {
                declaretedVars.push(tokens[nextTokenIndex + 1].lexema);

                // O próximo precisa ser o simbolo ':' para declarar o tipo
                nextTokenIndex = nextTokenIndex + 2;
                nextToken = tokens[nextTokenIndex];

                if (nextToken.lexema !== ":") return { error: `É esperado o simbolo ':', mas um ${nextToken.token} "${nextToken.lexema}" foi recebido`, line: nextToken.line };

                // O próximo precisa ser um tipo
                nextTokenIndex = nextTokenIndex + 1;
                nextToken = tokens[nextTokenIndex];

                if (nextToken.token !== 'reserved') return { error: `É esperado uma declaração de tipo, porém um ${nextToken.token}, mas "${nextToken.lexema}" foi recebido`, line: nextToken.line };
                if (!types.includes(nextToken.lexema)) return { error: `É esperado um tipo definido do pascal, porém o tipo "${nextToken.lexema}" foi recebido`, line: nextToken.line };

                // Apos a definicao de tipo o proximo token precisa finalizar com um ';';
                nextTokenIndex = nextTokenIndex + 1;
                nextToken = tokens[nextTokenIndex];


                if (nextToken.lexema !== ';') return { error: `É esperado um ";" para finalizar a declaração, porém um "${nextToken.lexema}" foi recebido`, line: nextToken.line };
            }
        }
    }

    return { declaretedVars, nextTokenIndex };
};

const verifyWriteBlock = (tokens, index) => {
    let errors = [];
    let nextTokenIndex = index + 1;
    let nextToken = tokens[nextTokenIndex];
    if (nextToken.lexema !== '(') errors.push({ error: `É esperado um "(" para chamar a função write, porém um "${nextToken.lexema}" foi recebido`, line: nextToken.line });

    while ((tokens.length !== nextTokenIndex)) {
        if (nextToken.lexema === ')') break;
        nextTokenIndex++;
        nextToken = tokens[nextTokenIndex];
    }

    if (nextToken.lexema === ')') {
        nextTokenIndex++;
        nextToken = tokens[nextTokenIndex];
        if (nextToken.lexema !== ';') errors.push({ error: `É esperado o simbolo ";", porém um "${nextToken.lexema}" foi recebido`, line: nextToken.line });
    } else errors.push({ error: `É esperado o simbolo ")" para encerrar a função write, porém um "${nextToken.lexema}" foi recebido`, line: nextToken.line });

    return { nextTokenIndex, errors };
};

const verifyBegin = (tokens, index) => {
    const beginPairs = [];
    const errors = [];

    const findBeginWithoutEnd = () => beginPairs.findIndex(({ end }) => (!end));
    const filterBeginWithoutEnd = () => beginPairs.filter(({ end }) => (!end));


    for (let i = index; i < tokens.length; i++) {
        if (tokens[i].lexema === 'begin') beginPairs.push({ begin: true, line: tokens[i].line });
        if (tokens[i].lexema === 'end') {
            const idx = findBeginWithoutEnd();
            const pair = beginPairs[idx];
            beginPairs[idx] = { ...pair, end: true };
        }
    }

    const beginsWithError = filterBeginWithoutEnd();
    beginsWithError?.forEach(({ line }) => {
        errors.push({ error: 'begin foi declarado porém não foi finalizado com end', line });
    });

    return { nextTokenIndex: index, errors };
};

const verifyComment = (tokens, index) => {
    let nextTokenIndex = index + 1;
    let nextToken = tokens[nextTokenIndex];
    while (nextToken && nextToken.lexema !== '}') {
        nextTokenIndex++;
        nextToken = tokens[nextTokenIndex];
    }
    return { nextTokenIndex };
};


function parser(tokens) {
    let errors = [];
    let declaredVariables = [];

    for (let i = 0; i < tokens.length; i++) {
        const { lexema, token, line } = tokens[i];
        switch (token) {
            case 'reserved':
                if (lexema === 'program') {
                    i++;
                    if (tokens[i].token !== 'id') {
                        errors.push({ error: `É esperado um identificador, porém um ${token} foi recebido`, line });
                        i = i - 1;
                    }
                    i++;
                    if (tokens[i].lexema !== ';') {
                        errors.push({ error: `É esperado o simbolo ";", porém um ${token} foi recebido`, line });
                        i = i - 1;
                    }
                    break;
                }
                if (lexema === 'var') {
                    const { declaretedVars: vars, nextTokenIndex, error, line } = verifyVars(tokens, i);
                    i = nextTokenIndex;
                    if (vars) declaredVariables = [...vars];
                    if (error) errors.push({ error, line });
                    break;
                }
                if (lexema === 'write' || lexema === 'writeln') {
                    const { nextTokenIndex, errors: newErrors } = verifyWriteBlock(tokens, i);
                    i = nextTokenIndex;
                    if (newErrors.length > 0) errors = [...errors, newErrors];
                    break;
                }
                if (lexema === 'begin') {
                    const { nextTokenIndex, errors: newErrors } = verifyBegin(tokens, i);
                    i = nextTokenIndex;
                    if (newErrors.length > 0) errors = [...errors, newErrors];
                    break;
                }
                break;
            case 'id':
                if (!declaredVariables.includes(lexema)) errors.push({ error: `identificador ${lexema} não declarado`, line });
                break;
            case 'comment':
                if (lexema === '{') {
                    const { nextTokenIndex } = verifyComment(tokens, i);
                    i = nextTokenIndex;
                    break;
                }
                break;
        }
    }

    return errors;
}

module.exports = parser;