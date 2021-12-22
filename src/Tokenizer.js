const Spec = [
  //-------------------------------
  // WHITESPACE
  [/^\s+/, null],

  //-------------------------------
  // COMMENTS

  // Skip single line
  [/^\/\/.*/, null],

  // Skip multi-line
  [/^\/*[\s\S]*?\*\//, null],

  //-------------------------------
  // SYMBOLS AND DELIMITERS
  [/^;/, ";"],
  [/^\{/, "{"],
  [/^\}/, "}"],
  [/^\(/, "("],
  [/^\)/, ")"],
  [/^,/, ","],

  //-------------------------------
  // KEYWORDS
  [/^\blet\b/, "let"],
  [/^\bif\b/, "if"],
  [/^\belse\b/, "else"],
  [/^\btrue\b/, "true"],
  [/^\bfalse\b/, "false"],
  [/^\bnull\b/, "null"],
  [/^\bwhile\b/, "while"],
  [/^\bdo\b/, "do"],
  [/^\bfor\b/, "for"],


  //-------------------------------
  // NUMBERS
  [/^\d+/, "NUMBER"],

  //-------------------------------
  // Identifiers:
  [/^\w+/, "IDENTIFIER"],


  //-------------------------------
  // EQUALITY OPERATORS: ==, !=
  [/^[=!]=/, "EQUALITY_OPERATOR"],


  //-------------------------------
  // ASSIGNMENT: =, *=, /=, +=, -=
  [/^=/, "SIMPLE_ASSIGN"],
  [/^[\*\/\+\-]=/, "COMPLEX_ASSIGN"],


  //-------------------------------
  // MATH OPERATORS
  [/^[+\-]/, 'ADDITIVE_OPERATOR'],
  [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],


  //-------------------------------
  // RELATIONAL OPERATORS: >, >=, <, <=
  [/^[><]=?/, "RELATIONAL_OPERATOR"],


  //-------------------------------
  // LOGICAL OPERATORS: &&, ||
  [/^&&/, "LOGICAL_AND"],
  [/^\|\|/, "LOGICAL_OR"],
  [/^!/, "LOGICAL_NOT"],


  //-------------------------------
  // STRINGS
  [/^"[^"]*"/, "STRING"],
  [/^'[^']*'/, "STRING"]
];



class Tokenizer {
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (const [regexp, tokenType] of Spec) {
      const tokenValue = this._match(regexp, string);

      // Can't match this rule, continue
      if (tokenValue == null) {
        continue;
      }

      // Should skip token, e.g. whitespace.
      if (tokenType == null) {
        return this.getNextToken();
      }

      return {
        type: tokenType,
        value: tokenValue,
      };
    }
    throw new SyntaxError(`Unexpected token: "${string[0]}"`);
  }

  _match(regexp, string) {
    const matched = regexp.exec(string);
    if (matched == null) {
      return null;
    }
    this._cursor += matched[0].length;
    return matched[0]
  }
}

module.exports = {
  Tokenizer,
}
