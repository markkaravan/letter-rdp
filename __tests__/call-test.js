module.exports = test => {

  test(`square();`,
    {
      type: 'Program',
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "square",
            },
            arguments: [],
          },
        },
      ],
    },
  );

  test(`square(2, 3);`,
    {
      type: 'Program',
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "square",
            },
            arguments: [
              {
                type: "NumericLiteral",
                value: 2
              },
              {
                type: "NumericLiteral",
                value: 3
              }
            ],
          },
        },
      ],
    },
  );


  test(`square(a=2, b=3);`,
    {
      type: 'Program',
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "square",
            },
            arguments: [
              {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "a"
                },
                right: {
                  type: "NumericLiteral",
                  value: 2
                }
              },
              {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "b"
                },
                right: {
                  type: "NumericLiteral",
                  value: 3
                }
              },
            ],
          },
        },
      ],
    },
  );

// module.exports = test => {
};
