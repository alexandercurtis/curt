const program1 = '((+ ((+ 5) 3)) ((+ 1) 9))';

const ast1 = {
  type: 'A',
  left: {
    type: 'A',
    left: {type: 'T', internal: '+'},
    right: {
      type: 'A',
      left: {
        type: 'A',
        left: {type: 'T', internal: '+'},
        right: {type: 'N', internal: 5}
      },
      right: {type: 'N', internal: 3}
    }
  },
  right: {
    type: 'A',
    left: {
      type: 'A',
      left: {type: 'T', internal: '+'},
      right: {type: 'N', internal: 1}
    },
    right: {type: 'N', internal: 9}
  }
};
const result1 = { type: 'N', internal: 18 };

describe("Evaluator", function() {
  const {evaluate,coreScope} = require('../lib/Evaluator');

  it("should be able to evaluate an ast", function() {
    expect(evaluate(ast1,coreScope)).toEqual(result1);
  });

});

