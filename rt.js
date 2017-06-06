#!/usr/bin/env node
'use strict';

// || \\

const readline = require('readline');
const {red,green,yellow,blue,magenta,cyan,white} = require('./lib/colours');

const {parseExpression,dumpAst} = require('./lib/Reader');
const {evaluate,coreScope} = require('./lib/Evaluator');


let rl;
let repl;
if (process.argv[2]) {
  console.log("Evaluating expressions contained in file", process.argv[2]);
  rl = readline.createInterface({
    input: require('fs').createReadStream(process.argv[2]),
    output: process.stdout,
    terminal: false
  });
  repl = false;
} else {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
  });
  console.log(magenta("> "));
  repl = true;
}
rl.on('line', function (line) {
  const [parsed,] = parseExpression(line);
  if (parsed) {
    console.log("Program is" );
    dumpAst(parsed);
    const val = evaluate(parsed,coreScope);
    console.log("Evaluated");
    console.log(val);
  } else {
    console.log("Can't parse input");
  }
});
