exports.foo = function (x) {
  return x * 2;
}

'use strict';

// || \\

const readline = require('readline');

function isWhitespace(c) {
  return (c === ' ' || c === '\r' || c === '\n' || c === '\t');
}

function isLineTerminatorChar(c) {
  return (c === '\r' || c === '\n');
}

function isTokenChar(c) {
  return (c !== ' ' && c !== '\n' && c !== '\t' && c !== '(' && c !== ')');
}

function isNumberChar(c) {
  return c === '0' || c === '1' || c === '2' || c === '3' || c === '4' || c === '5' || c === '6' || c === '7' || c === '8' || c === '9';
}

function parseComment(line, offset) {
  if (offset < line.length - 1) {
    if (line[offset] === ';') {
      let current = offset + 1;
      while (current < line.length && !isLineTerminatorChar(line[current])) {
        current++;
      }
      return [true,current];
    }
  }
  return [false,offset];
}

function parseOptionalWhitespace(line, offset) {
  let current = offset;
  while (1) {
    if (current >= line.length) {
      break;
    }
    let start = current;
    // Remove a comment
    [, current] = parseComment(line, current);
    // Remove a whitespace char
    if (isWhitespace(line[current])) {
      current++;
    }
    // Did we remove something?
    if (current === start) {
      // No. Nothing left to remove
      break;
    }
  }
  return [current !== offset, current];
}

function parseToken(line, offset) {
  let token = '';
  while (offset < line.length) {
    const c = line[offset];
    if (!isTokenChar(c)) {
      break;
    }
    token += c;
    ++offset;
  }
  return [{type: 'T', internal: token}, offset];
}

function parseArgPlaceholder(line, offset) {
  if(offset < line.length && line[offset] === '%') {
    return [{type: '%'},offset+1];
  }
  return [null, offset];
}

function parseNumber(line, offset) {
  let token = '';
  let current = offset;
  while (current < line.length) {
    const c = line[current];
    if (!isNumberChar(c)) {
      break;
    }
    token += c;
    ++current;
  }
  if (token.length > 0) {
    return [{type: 'N', internal: parseInt(token, 10)}, current];
  } else {
    return [null, offset];
  }
}

function parseBoolean(line, offset) {
  if (line.slice(offset, offset + 4) === 'true') {
    return [{type: 'B', internal: true}, offset + 4];
  } else if (line.slice(offset, offset + 5) === 'false') {
    return [{type: 'B', internal: false}, offset + 5];
  }
  else return [null, offset];
}

function parseApplication(line, offset) {
  let left = null;
  let ws = null;
  let right = null;
  let ignore = null;
  if (line[offset] === '(') {
    let current = offset + 1;
    [, current] = parseOptionalWhitespace(line, current);
    [left, current] = parseExpression(line, current);
    [ws, current] = parseOptionalWhitespace(line, current);
    [right, current] = parseExpression(line, current);
    [, current] = parseOptionalWhitespace(line, current);
    if (line[current] === ')' && left && ws && right) {
      return [{type: 'A', left: left, right: right}, current + 1];
    }
  }
  return [null, offset];
}

function parseExpression(line, offset = 0) {
  // console.log('parseExpression', line.substr(offset));

  let value;
  let current = offset;

  [, current] = parseOptionalWhitespace(line, current);
  [value, current] = parseApplication(line, current);
  // console.log('parseApplication returned', value, current);
  if (value) {
    return [value, current];
  } else {
    [value, current] = parseNumber(line, current);
    if (value) {
      return [value, current];
    } else {
      [value, current] = parseBoolean(line, current);
      if (value) {
        return [value, current];
      } else {
        [value, current] = parseArgPlaceholder(line, current);
        if (value) {
          return [value, current];
        } else {
          [value, current] = parseToken(line, current);
          if (value) {
            return [value, current];
          } else {
            return [null, offset];
          }
        }
      }
    }
  }
}

function nextPrefix(p) {
  return p.replace(/[LR]:/, '  ');
}

function dumpAst(node, prefix = '') {
  if (node.type === 'A') {
    console.log(prefix + 'A');
    dumpAst(node.left, nextPrefix(prefix) + 'L:');
    dumpAst(node.right, nextPrefix(prefix) + 'R:');
  } else {
    console.log(prefix + node.type + ':' + node.internal);
  }
}

exports.parseExpression = parseExpression;
exports.dumpAst = dumpAst;