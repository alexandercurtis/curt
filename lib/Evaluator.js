// || \\
const {red,green,yellow,blue,magenta,cyan,white} = require('./colours');

function makeFn(description, fn) {
  fn.description = description;
  return {type: 'F', internal: fn};
}

const _toString = function (x) {
  if (x.type === 'N') {
    return '' + x.internal;
  } else if (x.type === 'S') {
    return '' + x.internal;
  } else if (x.type === 'F') {
    return 'F:' + x.internal.description;
  } else if (x.type === 'U') {
    return 'U:' + _toString(x.ast);
  } else if (x.type === 'T') {
    return '' + x.internal;
  } else if (x.type === '%') {
    return '%';
  } else if (x.type === 'A') {
    return '(' + _toString(x.left) + ' ' + _toString(x.right) + ')';
  } else {
    return x.type + ':' + x.internal;
  }
};

const _add = makeFn('adder',
  function (ux,scope) {
    const x = evaluate(ux,scope);
    if (x.type === 'X') {
      return x;
    } else if (x.type !== 'N') {
      return {type: 'X', message: "Argument to + must be a number, not " + _toString(x)};
    } else {
      return makeFn(x.internal + 'adder',
        function (uy,scope) {
          const y = evaluate(uy,scope);
          if (y.type === 'X') {
            return y;
          } else if (y.type !== 'N') {
            return {type: 'X', message: 'Argument to +' + x.internal + ' must be a number, not ' + _toString(y)};
          } else {
            return {type: 'N', internal: x.internal + y.internal};
          }
        }
      );
    }
  });

const _subtract = makeFn('subtractor',
  function (ux,scope) {
    const x = evaluate(ux,scope);
    if (x.type === 'X') {
      return x;
    } else if (x.type !== 'N') {
      return {type: 'X', message: "Argument to - must be a number, not " + _toString(x)};
    } else {
      return makeFn(x.internal + 'subtractor',
        function (uy,scope) {
          const y = evaluate(uy,scope);
          if (y.type === 'X') {
            return y;
          } else if (y.type !== 'N') {
            return {type: 'X', message: 'Argument to -' + x.internal + ' must be a number, not ' + _toString(y)};
          } else {
            return {type: 'N', internal: x.internal - y.internal};
          }
        }
      );
    }
  });

const _multiply = makeFn('multiplier',
  function (ux,scope) {
    const x = evaluate(ux,scope);
    if (x.type === 'X') {
      return x;
    } else if (x.type !== 'N') {
      return {type: 'X', message: "Argument to * must be a number, not " + _toString(x)};
    } else {
      return makeFn(x.internal + 'multiplier',
        function (uy,scope) {
          const y = evaluate(uy,scope);
          if (y.type === 'X') {
            return y;
          } else if (y.type !== 'N') {
            return {type: 'X', message: 'Argument to *' + x.internal + ' must be a number, not ' + _toString(y)};
          } else {
            return {type: 'N', internal: x.internal * y.internal};
          }
        }
      );
    }
  });

const _divide = makeFn('divider',
  function (ux,scope) {
    const x = evaluate(ux,scope);
    if (x.type === 'X') {
      return x;
    } else if (x.type !== 'N') {
      return {type: 'X', message: "Argument to / must be a number, not " + _toString(x)};
    } else {
      return makeFn(x.internal + 'divider',
        function (uy,scope) {
          const y = evaluate(uy,scope);
          if (y.type === 'X') {
            return y;
          } else if (y.type !== 'N') {
            return {type: 'X', message: 'Argument to /' + x.internal + ' must be a number, not ' + _toString(y)};
          } else {
            return {type: 'N', internal: x.internal / y.internal};
          }
        }
      );
    }
  });

const _puts = makeFn('puts',
  function (ux,scope) {
    const x = evaluate(ux,scope);
    console.log(green(_toString(x)));
    return x;
  }
);

const _if = makeFn('if',
  function (ux,scope) {
    const x = evaluate(ux,scope);
    if (x.type === 'X') {
      return x;
    } else if (x.type !== 'B') {
      return {type: 'X', message: "Argument to 'if' must be a boolean, not " + _toString(x)};
    } else {
      return makeFn("if'",
        function (uy,scopey) {
          return makeFn("if''",
            function (uz,scopez) {
              if (x.internal) {
                return evaluate(uy,scopey);
              } else {
                return evaluate(uz,scopez);
              }
            }
          );
        }
      );
    }
  }
);

const _equalq = makeFn('equalq',
  function (ux,scope) {
    const x = evaluate(ux,scope);
    if (x.type === 'X') {
      return x;
    } else {
      return makeFn(x.internal + 'equaller',
        function (uy,scope) {
          const y = evaluate(uy,scope);
          if (x.type === y.type) {
            if (x.internal === y.internal) {
              console.log(x.internal + 'equaller returns true for ' + _toString(y));
              return {type: 'B', internal: true};
            } else {
              console.log(x.internal + 'equaller returns false for ' + _toString(y));
              return {type: 'B', internal: false};
            }
          } else {
            return {type: 'X', message: "Can't perform = on differing types:" + _toString(x) + ", " + _toString(y)};
          }
        }
      );
    }
  }
);

const _let = makeFn('letter',
  function (ux,scope) {
    if (ux.type !== 'T') {
      return {type: 'X', message: "Argument to 'let' must be a symbol, not " + _toString(ux)};
    } else {
      return makeFn(ux.internal + 'letter',
        function (uy,scope) {
          const y = evaluate(uy,scope);
          return makeFn('let' + ux.internal + '=' + _toString(y) + 'er',
            function (uz,scope) {
              const localScope = Object.assign({}, scope);
              localScope[ux.internal] = y;
              return evaluate(uz, localScope);
            }
          );
        }
      );
    }
  }
);

const _letfn = makeFn('letfner',
  function (ux,scope) {
    if (ux.type !== 'T') {
      return {type: 'X', message: "Argument to 'letfn' must be a symbol, not " + _toString(ux)};
    } else {
      return makeFn(ux.internal + 'letfner',
        function (uy,scope) {
          return makeFn('letfn' + ux.internal + '=' + _toString(uy) + 'er',
            function (uz,scope) {
              const localScope = Object.assign({}, scope);
              console.log("Letf sets local var " + ux.internal + " to the U-typed fn body");
              localScope[ux.internal] = {type:'U', ast: uy, scope: scope};
              return evaluate(uz, localScope);
            }
          );
        }
      );
    }
  }
);

// Evaluates first argument and returns identity function (i.e. evaluates first argument and evaluates second argument and returns second argument)
const _do = makeFn('doer',
  function (ux,scope) {
    const x = evaluate(ux,scope);
    if (x.type === 'X') {
      return x;
    } else {
      return makeFn(ux.internal + 'doer',
        function (uy,scope) {
          return evaluate(uy,scope);
        }
      );
    }
  }
);

// Provides a way for user defined functions to choose when to evaluate their arguments
const _eval = makeFn('evaller',
  function (ux,scope) {
    console.log("Evaluating",_toString(ux));
    return evaluate(ux,scope);
  }
);

const coreScope = {
  fortytwo: 42,
  '+': _add,
  '-': _subtract,
  '*': _multiply,
  '/': _divide,
  'puts': _puts,
  'if': _if,
  '=': _equalq,
  'let': _let,
  'do': _do,
  'letfn': _letfn,
  'eval': _eval
};

// Apply an internal core builtin native function
function _apply(l, r, scope) {
  console.log("applying " + _toString(l) + " to " + _toString(r)) ;
  if( !scope ) {
    throw new Error("apply needs scope man");
  }
  return l.internal(r, scope);
}

// Apply a user defined function
function _uapply(l, r, scope) {
  console.log("upplying " + _toString(l) + " to " + _toString(r)) ;
  if( !scope ) {
    throw new Error("uapply needs scope man");
  }
  const newScope = Object.assign({},scope,l.scope);
  newScope['%'] = {type:'%', ast:r, scope:scope}; // TODO: not scope:newScope? scope:l.scope?
  console.log("upply set % to " + _toString(newScope['%']));
  return evaluate(l.ast,newScope);
}

function evaluate(ast,scope) {
  console.log("Evaluating " + _toString(ast));
  if( !scope ) {
    throw new Error("evaluate needs scope man");
  }
  if (ast.type === 'X') {
    return ast;
  }
  else if (ast.type === 'A') {
    const left = evaluate(ast.left,scope);
    if (left.type === 'X') {
      return left;
    } else if (left.type === 'U') {
      return _uapply(left, ast.right, scope);
    } else if (left.type === 'F') {
      return _apply(left, ast.right, scope);
    } else {
      return {type: 'X', message: 'Left of apply must be a function, not a ' + _toString(left)};
    }
  } else if (ast.type === '%') {
    const arg = scope['%'];
    if( arg ) {
      return evaluate(arg.ast,arg.scope);
    }
    else {
      return {type:'X', message:'% is not defined in the current scope'};
    }
  } else if (ast.type === 'T') {
    console.log("var " + ast.internal + " resolves to " + _toString(scope[ast.internal]));
    return scope[ast.internal] || {type: 'X', message: 'Undefined symbol ' + ast.internal};
  } else {
    return ast;
  }
}

exports.evaluate = evaluate;
exports.coreScope = coreScope;


