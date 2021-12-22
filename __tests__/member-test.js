module.exports = test => {
  test(`a.b;`,
    {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: false,
            object: {
              type: "Identifier",
              name: "a",
            },
            property: {
              type: "Identifier",
              name: "b",
            },
          },
        },
      ],
    },
  );


  test(`a[b];`,
    {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: true,
            object: {
              type: "Identifier",
              name: "a",
            },
            property: {
              type: "Identifier",
              name: "b",
            },
          },
        },
      ],
    },
  );

// module.exports = test => {
};
