const keywords = ['var', 'if', 'else', 'while', 'for', 'function', 'return'];

function Token(type, value) {
    this.type = type;
    this.value = value;
}

function Lexer(input) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[this.position];
}

Lexer.prototype.nextChar = function () {
    this.position += 1;
    if (this.position > this.input.length - 1) {
        this.currentChar = null;
    } else {
        this.currentChar = this.input[this.position];
    }
}

Lexer.prototype.skipWhitespace = function () {
    while (this.currentChar !== null && this.currentChar === ' ') {
        this.nextChar();
    }
}

Lexer.prototype.integer = function () {
    let result = '';
    while (this.currentChar !== null && /\d/.test(this.currentChar)) {
        result += this.currentChar;
        this.nextChar();
    }
    return new Token('INTEIRO', parseInt(result));
}

Lexer.prototype.id = function () {
    let result = '';
    while (this.currentChar !== null && /[a-zA-Z_]/.test(this.currentChar)) {
        result += this.currentChar;
        this.nextChar();
    }
    if (keywords.includes(result)) {
        return new Token('PALAVRA', result);
    }
    return new Token('IDENTIFICADOR', result);
}

Lexer.prototype.getNextToken = function () {
    while (this.currentChar !== null) {
        if (/\s/.test(this.currentChar)) {
            this.skipWhitespace();
            continue;
        }
        if (/\d/.test(this.currentChar)) {
            return this.integer();
        }
        if (/[0-9]/.test(this.currentChar)) {
            this.nextChar();
            return new Token('NUMERO', this.currentChar);   
        }
        if (/[a-zA-Z_]/.test(this.currentChar)) {
            return this.id();
        }
        if (this.currentChar === '=') {
            this.nextChar();
            if (this.currentChar === '=') {
                this.nextChar();
                return new Token('IGUALDADE', '==');
            }
            return new Token('OP_IGUAL', '=');
        }
        if (this.currentChar === '+') {
            this.nextChar();
            return new Token('OP_SOMA', '+');
        }
        if (this.currentChar === '-') {
            this.nextChar();
            return new Token('OP_SUB', '-');
        }
        if (this.currentChar === '*') {
            this.nextChar();
            return new Token('OP_MULTI', '*');
        }
        if (this.currentChar === '/') {
            this.nextChar();
            return new Token('OP_DIV', '/');
        }
        if (this.currentChar === '(') {
            this.nextChar();
            return new Token('PAREN', '(');
        }
        if (this.currentChar === ')') {
            this.nextChar();
            return new Token('PAREN', ')');
        }
        if (this.currentChar === '{') {
            this.nextChar();
            return new Token('SIMB_ABRE_CHAVES', '{');
        }
        if (this.currentChar === '}') {
            this.nextChar();
            return new Token('SIMB_ABRE_CHAVES', '}');
        }
        if (this.currentChar === ';') {
            this.nextChar();
            return new Token('SIMB_PONTOVIRG', ';');
        }
        if (this.currentChar === ',') {
            this.nextChar();
            return new Token('SIMB_VIRG', ',');
        }
        throw new Error(`Invalid character: ${this.currentChar}`);
    }
    return new Token('EOF', null);
}

module.exports = Lexer;