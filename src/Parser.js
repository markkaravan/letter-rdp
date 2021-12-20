/**
* Letter parser: recursive descent implementation
*/

class Parser {
  /**
  *   Parses a string into an AST
  */
  parse(string) {
    this._string = string;


    return this.Program();
  }

  /**
  *
  */
  Program() {
    return this.NumericLiteral();
  }

  /**
  *
  */
  NumericLiteral() {
    return {
      type: 'NumericLiteral',
      value: Number(this._string),
    };
  }
}

module.exports = {
  Parser,
}
