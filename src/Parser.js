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
  *    | VariableStatement
  *    | IfStatement
  *    ;
  */
  Statement() {
    switch (this._lookahead.type) {
      case ';':
        return this.EmptyStatement();
        break;
      case 'if':
        return this.IfStatement();
        break;
      case '{':
        return this.BlockStatement();
        break;
      case 'let':
        return this.VariableStatement();
        break;
      default:
        return this.ExpressionStatement();
        break;
    }
  }

  /**
  * IfStatement
  *   : 'if' '(' Expression ')' Statement
  *   | 'if' '(' Expression ')' Statement 'else' Statement
  *   ;
  */
  IfStatement() {
    this._eat('if');

    this._eat('(');
    const test = this.Expression();
    this._eat(')');

    const consequent = this.Statement();

    const alternate =
      this._lookahead != null && this._lookahead.type === 'else'
        ? this._eat('else') && this.Statement()
        : null;

    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate,
    };
  }


  /**
  * VariableStatement
  *   : 'let' VariableDeclarationList ';'
  *   ;
  */
  VariableStatement() {
    this._eat('let');
    const declarations = this.VariableDeclarationList();
    this._eat(';');
    return {
      type: 'VariableStatement',
      declarations,
    };
  }



  /**
  * VariableDeclarationList
  *   : VariableDeclaration
  *   | VariableDeclarationList ',' VariableDeclaration
  *   ;
  */
  VariableDeclarationList() {
    const declarations = [];

    do {
      declarations.push(this.VariableDeclaration());
    } while (this._lookahead.type === ',' && this._eat(','));

    return declarations;
  }


  /**
  * VariableDeclaration
  *   : Identifier OptVariableInitializer
  *   ;
  */
  VariableDeclaration() {
    const id = this.Identifier();

    // OptVariableInitializer
    const init =
      this._lookahead.type !== ';' && this._lookahead.type !== ','
        ? this.VariableInitializer()
        : null;

    return {
      type: 'VariableDeclaration',
      id,
      init,
    };
  }

  /**
  * VariableInitializer
  *   : SIMPLE_ASSIGN AssignmentExpression
  *   ;
  */
  VariableInitializer() {
    this._eat('SIMPLE_ASSIGN');
    return this.AssignmentExpression();
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
    return this.AssignmentExpression();
  }

  /**
  * AssignmentExpression
  *   : LogicalORExpression
  *   | LeftHandSideExpression AssignmentOperator AssignmentExpression
  *   ;
  */
  AssignmentExpression() {
    const left = this.LogicalORExpression();

    if (!this._isAssignmentOperation(this._lookahead.type)) {
      return left;
    }

    return {
      type: "AssignmentExpression",
      operator: this.AssignmentOperator().value,
      left: this._checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    };
  }

  /**
  * LeftHandSideExpression
  *   : Identifier
  *   ;
  */
  LeftHandSideExpression() {
    return this.Identifier();
  }

  /**
  * Identifier
  *   : IDENTIFIER
  *   ;
  */
  Identifier() {
    const name = this._eat("IDENTIFIER").value;
    return {
      type: "Identifier",
      name,
    };
  }

  /**
  * Extra check whether it's valid assignment target
  */
  _checkValidAssignmentTarget(node) {
    if (node.type === "Identifier") {
      return node;
    }
    throw new SyntaxError("Invalid left-hand side in assignment expression");
  }

  /**
  * Whether the token is an assignment operator
  */
  _isAssignmentOperation(tokenType) {
    return tokenType === "SIMPLE_ASSIGN" || tokenType === "COMPLEX_ASSIGN";
  }

  /**
  * AssignmentOperator
  *   : SIMPLE_ASSIGN
  *   | COMPLEX_ASSIGN
  *   ;
  */
  AssignmentOperator() {
    if (this._lookahead.type === "SIMPLE_ASSIGN") {
      return this._eat("SIMPLE_ASSIGN");
    }
    return this._eat("COMPLEX_ASSIGN");
  }

  /**
  * Logical OR expression:
  *
  *   x || y
  *
  * LogicalORExpression
  *   : EqualityExpression LOGICAL_OR LogicalORExpression
  *   | EqualityExpression
  *   ;
  */
  LogicalORExpression() {
    return this._LogicalExpression('LogicalANDExpression', 'LOGICAL_OR');
  }


  /**
  * Logical AND expression:
  *
  *   x && y
  *
  * LogicalANDExpression
  *   : EqualityExpression LOGICAL_AND LogicalANDExpression
  *   | EqualityExpression
  *   ;
  */
  LogicalANDExpression() {
    return this._LogicalExpression('EqualityExpression', 'LOGICAL_AND');
  }


  /**
  * EQUALITY_OPERATOR: ==, !=
  *
  *   x == y
  *   x != y
  *
  * EqualityExpression
  *   : RelationalExpression EQUALITY_OPERATOR EqualityExpression
  *   | RelationalExpression
  *   ;
  */
  EqualityExpression() {
    return this._BinaryExpression('RelationalExpression', 'EQUALITY_OPERATOR');
  }


/**
  * RELATIONAL_OPERATOR: >, >=, <, <=
  *
  *   x > y
  *   x >= y
  *   x < y
  *   x <= y
  *
  * RelationalExpression
  *   : AdditiveExpression
  *   | AdditiveExpression RELATIOINAL_OPERATOR RelationalExpression
  *   ;
  */
  RelationalExpression() {
    return this._BinaryExpression('AdditiveExpression', 'RELATIONAL_OPERATOR');
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


  _LogicalExpression(builderName, operatorToken) {
    let left = this[builderName]();

    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken).value;

      const right = this[builderName]();

      left = {
        type: 'LogicalExpression',
        operator,
        left,
        right,
      };
    }
    return left;
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
  *    : LeftHandSideExpression
  *    | ParenthesizedExpression
  *    ;
  */
  PrimaryExpression() {
    if (this._isLiteral(this._lookahead.type)) {
      return this.Literal();
    }
    switch (this._lookahead.type) {
      case '(':
        return this.ParenthesizedExpression();
        break;
      default:
        return this.LeftHandSideExpression();
        break;
    }
  }

  /**
  * Whether the token iis a literal
  */
  _isLiteral(tokenType) {
    return (
      tokenType === 'NUMBER' ||
      tokenType === 'STRING' ||
      tokenType === 'true' ||
      tokenType === 'false' ||
      tokenType === 'null'
    );
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
      case 'true':
        return this.BooleanLiteral(true);
        break;
      case 'false':
        return this.BooleanLiteral(false);
        break;
      case 'null':
        return this.NullLiteral(false);
        break;
    }
    throw new SyntaxError(`Literal: unexpected literal production`);
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
  * BooleanLiteral
  *   : 'true'
  *   | 'false'
  *   ;
  */
  BooleanLiteral(value) {
    this._eat(value ? 'true' : 'false');
    return {
      type: 'BooleanLiteral',
      value,
    };
  }

  /**
  * NullLiteral
  *   : 'null'
  *   ;
  */
  NullLiteral(value) {
    this._eat('null');
    return {
      type: 'NullLiteral',
      value: null,
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
