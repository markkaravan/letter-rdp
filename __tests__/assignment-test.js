module.exports =  test => {
  test(`x = 42;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: "x",
          },
          right: {
            type: 'NumericLiteral',
            value: 42,
          },
        },
      },
    ],
  });

  test(`x = y = 42;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: "x",
          },
          right: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'Identifier',
              name: "y",
            },
            right: {
              type: 'NumericLiteral',
              value: 42,
            },
          },
        },
      },
    ],
  });


  test(`x += 10;`, {
    type: 'Program',
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "+=",
          left: {
            type: "Identifier",
            name: "x"
          },
          right: {
            type: "NumericLiteral",
            value: 10
          }
        }
      }
    ]
  });

//module.exports =  test => {
};
