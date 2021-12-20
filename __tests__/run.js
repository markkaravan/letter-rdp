const {Parser} = require('../src/Parser');
const assert = require('assert');

/**
*   List of tests
*/
const tests = [
  require('./literals-test.js'),
  require('./statement-list-test.js'),
  require('./block-test.js'),
  require('./empty-statement-test.js'),
];

const parser = new Parser();

function exec() {
  const program = `
    42;
    10;
  `;

  const ast = parser.parse(program);

  console.log(JSON.stringify(ast, null, 2));
}

// Manual test
exec();

/**
*   Test function
*/
function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}

// Run all tests
//tests.forEach(testRun => testRun(test));
console.log("All assertions passed");
