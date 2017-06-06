const program1 = '(((let f) (((if ((> 10) x)) (f ((/ 2) x)) ) x)) (((let x) 17) f))';
const program2 = '(true false)';
const program3 = `(true
false)`;
const program4 = "(true\nfalse)";
const program5 = '; a first comment\n(true false) ; a second comment';
const program6 = "; a comment\n(true ; another comment\nfalse)\n";

const ast1 = {
  type: 'A',
  left: {
    type: 'A',
    left: {
      type: 'A',
      left: {type: 'T', internal: 'let'},
      right: {type: 'T', internal: 'f'}
    },
    right: {
      type: 'A',
      left: {
        type: 'A',
        left: {
          type: 'A',
          left: {type: 'T', internal: 'if'},
          right: {
            type: 'A',
            left: {
              type: 'A',
              left: {type: 'T', internal: '>'},
              right: {type: 'N', internal: 10}
            },
            right: {type: 'T', internal: 'x'}
          }
        },
        right: {
          type: 'A',
          left: {type: 'T', internal: 'f'},
          right: {
            type: 'A',
            left: {
              type: 'A',
              left: {type: 'T', internal: '/'},
              right: {type: 'N', internal: 2}
            },
            right: {type: 'T', internal: 'x'}
          }
        }
      },
      right: {type: 'T', internal: 'x'}
    }
  },
  right: {
    type: 'A',
    left: {
        type: 'A',
        left: {
          type: 'A',
          left: {type: 'T', internal: 'let'},
          right: {type: 'T', internal: 'x'}},
        right: {type:'N',internal:17}
    },
    right:{type:'T',internal:'f'}
  }
};

const ast2 = {
  type: 'A',
  left: {
    type: 'B',
    internal: true
    },
  right: {
    type: 'B',
    internal: false
  }
};

describe("Reader", function() {
  var parseExpression = require('../lib/Reader').parseExpression;

  // beforeEach(function() {
  //   reader = new Reader();
  // });



  it("should parse booleans", function() {
    expect(parseExpression(program2)[0]).toEqual(ast2);
  });

  it("should parse multiline expressions", function() {
    expect(parseExpression(program3)[0]).toEqual(ast2);
  });

  it("should parse multiline expressions", function() {
    expect(parseExpression(program4)[0]).toEqual(ast2);
  });

  it("should parse comments", function() {
    expect(parseExpression(program5)[0]).toEqual(ast2);
  });

  it("should be able to parse an expression", function() {
    expect(parseExpression(program1)[0]).toEqual(ast1);
  });
});

