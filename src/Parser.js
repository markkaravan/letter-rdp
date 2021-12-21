/**
* Letter parser: recursive descent implementation
*/
const {Tokenizer} = require('./Tokenizer');

class Parser {
  constructor() {
    this._string = '';
    this._tokenizer = new Tokenizer();
  }
  /**
  *   Parses a string into an AST
  */
  parse(string) {
    this._string = string;
    this._tokenizer.init(string);

    // Prime the tokenizer to obtain the first
    // token which is our lookahead.   The lookahead
    // iis used iin predictive parsing
    this._lookahead = this._tokenizer.getNextToken();


    return this.Program();
  }

  /**
  * Main entry point
  *
  * Program
  *   : StatementList
  *   ;
  */
  Program() {
    return {
      type: 'Program',
      body: this.StatementList(),
    };
  }

  /**
  * StatementList
  *   : Statement
  *   | StatementList Statement
  *   ;
  */
  StatementList(stopLookahead = null) {
    const statementList = [this.Statement()];

    while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
      statementList.push(this.Statement())
    }

    return statementList;
  }

  /**
  * Statement
  *    : ExpressionStatement
  *    | BlockStatement
  *    | EmptyStatement
  *    ;
  */
  Statement() {
    switch (this._lookahead.type) {
      case ';':
        return this.EmptyStatement();
        break;
      case '{':
        return this.BlockStatement();
        break;
      default:
        return this.ExpressionStatement();
        break;
    }
  }

  /**
  * EmptyStatement
  *    : ;
  *    ;
  */
  EmptyStatement() {
    this._eat(';');
    return {
      type: 'EmptyStatement',
    }
  }

  /**
  * BlockStatement
  *    : '{' OptStatementList '}'
  *    ;
  */
  BlockStatement() {
    this._eat('{');

    const body = this._lookahead.type !== "}"
      ? this.StatementList("}")
      : [];

    this._eat('}');

    return {
      type: 'BlockStatement',
      body,
    };
  }

  /**
  * ExpressionStatement
  *    : ExpressionStatement ';'
  *    ;
  */
  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(';');
    return {
      type: 'ExpressionStatement',
      expression,
    };
  }

  /**
  * Expression
  *    : AdditiveExpression
  *    ;
  */
  Expression() {
    return this.AdditiveExpression();
  }

  /**
  * AdditiveExpression
  *   : MultiplicativeExpression
  *   | AdditiveExpression ADDITIVE_OPERATOR Literal
  *   ;
  */
  AdditiveExpression() {
    return this._BinaryExpression(
      'MultiplicativeExpression',
      'ADDITIVE_OPERATOR'
    );
  }

  /**
  * MultiplicativeExpression
  *   : PrimaryExpression
  *   | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
  *   ;
  */
  MultiplicativeExpression() {
    return this._BinaryExpression(
      'PrimaryExpression',
      'MULTIPLICATIVE_OPERATOR'
    );
  }

  _BinaryExpression(builderName, operatorToken) {
    let left = this[builderName]();

    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken).value;

      const right = this[builderName]();

      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      };
    }
    return left;
  }

  /**
  * PrimaryExpression
  *    : Literal
  *    | ParenthesizedExpression
  *    ;
  */
  PrimaryExpression() {
    switch (this._lookahead.type) {
      case '(':
        return this.ParenthesizedExpression();
        break;
      default:
        return this.Literal();
        break;
    }
  }

  /**
  * ParenthesizedExpression
  *   : '(' Expression ')'
  *   ;
  */
  ParenthesizedExpression() {
    this._eat('(');
    const expression = this.Expression();
    this._eat(')');
    return expression;
  }

  /**
  * Literal
  *   : NumericLiteral
  *   | StringLiteral
  *   ;
  */
  Literal() {
    switch (this._lookahead.type) {
      case 'NUMBER':
        return this.NumericLiteral();
        break;
      case 'STRING':
        return this.StringLiteral();
        break;
    }
    throw new SyntaxError(`Literal: unexpected literal production`);
  }

  /**
  * StringLiteral
  *   : STRING
  *   ;
  */
  StringLiteral() {
    const token = this._eat('STRING');
    return {
      type: 'StringLiteral',
      value: token.value.slice(1, -1),
    };
  }


  /**
  * NumericLiteral
  *   : NUMBER
  *   ;
  */
  NumericLiteral() {
    const token = this._eat('NUMBER');
    return {
      type: 'NumericLiteral',
      value: Number(token.value),
    };
  }

  _eat(tokenType) {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`,
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected: "${tokenType}"`,
      );
    }

    // Advance to next token.
    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}

module.exports = {
  Parser,
}
