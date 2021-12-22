module.exports = test => {

  test(`
    class Point {
      def calc() {
        return this.x + this.y;
      }
    }
    `,
    {
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Point"
          },
          superClass: null,
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "FunctionDeclaration",
                name: {
                  type: "Identifier",
                  name: "calc"
                },
                params: [],
                body: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ReturnStatement",
                      argument: {
                        type: "BinaryExpression",
                        operator: "+",
                        left: {
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression"
                          },
                          property: {
                            type: "Identifier",
                            name: "x"
                          }
                        },
                        right: {
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression"
                          },
                          property: {
                            type: "Identifier",
                            name: "y"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  );


  test(`
    class Point3D extends Point {
      def constructor(x, y, z) {
        super(x, y);
        this.z = z;
      }
    }
    `,
    {
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          id: {
            type: "Identifier",
            name: "Point3D"
          },
          superClass: {
            type: "Identifier",
            name: "Point"
          },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "FunctionDeclaration",
                name: {
                  type: "Identifier",
                  name: "constructor"
                },
                params: [
                  {
                    type: "Identifier",
                    name: "x"
                  },
                  {
                    type: "Identifier",
                    name: "y"
                  },
                  {
                    type: "Identifier",
                    name: "z"
                  }
                ],
                body: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "CallExpression",
                        callee: {
                          type: "Super"
                        },
                        arguments: [
                          {
                            type: "Identifier",
                            name: "x"
                          },
                          {
                            type: "Identifier",
                            name: "y"
                          }
                        ]
                      }
                    },
                    {
                      type: "ExpressionStatement",
                      expression: {
                        type: "AssignmentExpression",
                        operator: "=",
                        left: {
                          type: "MemberExpression",
                          computed: false,
                          object: {
                            type: "ThisExpression"
                          },
                          property: {
                            type: "Identifier",
                            name: "z"
                          }
                        },
                        right: {
                          type: "Identifier",
                          name: "z"
                        }
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  );



  test(`
    let p = new Point3D(10, 20, 30);
    `,
    {
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              id: {
                type: "Identifier",
                name: "p"
              },
              init: {
                type: "NewExpression",
                callee: {
                  type: "Identifier",
                  name: "Point3D"
                },
                arguments: [
                  {
                    type: "NumericLiteral",
                    value: 10
                  },
                  {
                    type: "NumericLiteral",
                    value: 20
                  },
                  {
                    type: "NumericLiteral",
                    value: 30
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  );



  test(`
    p.calc();
    `,
    {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "Identifier",
                name: "p"
              },
              property: {
                type: "Identifier",
                name: "calc"
              }
            },
            arguments: []
          }
        }
      ]
    }
  );


// module.exports = test => {
};
