# Letter Recursive Descent Parser
Based on [Essentials of Parsing course](https://www.dmitrysoshnikov.education/p/parser-from-scratch) by [Dmitry Soshnikov](https://www.dmitrysoshnikov.education/).

Parses the Letter syntax and outputs a typed AST in json format

## Execution
### from command line:
```
./bin/letter-rdp -e 'let x = 10; console.log(x);'
```
### from file:
```
./bin/letter-rdp -f __tests__/example.lt
```
