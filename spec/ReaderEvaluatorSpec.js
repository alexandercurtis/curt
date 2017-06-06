const program1 = '((+ ((puts (+ 5)) 3)) ((+ 1) 9))';
const program2a = '(((if true) 99) 100)';
const program2b = '(((if false) 99) 100)';
const program2c = '(((if ((= 70) ((+ 2) 68))) ((+ 30) 5)) ((+ 42) 15))';
const program2d = '(((if ((= 52) ((+ 2) 68))) ((+ 30) 5)) ((+ 42) 15))';
const program3a =  '((= 2) 2)';
const program3b =  '((= 2) 4)';
const program3c =  '((= true) true)';
const program3d =  '((= false) true)';
const program4a = '(((let x) 99) x)';
const program4b = '(((let y) 98) (((let x) 99) ((+ x) y)))';
const program5 = `
  (
    (+ 3) 
    ((+ 2) 1)
  )
`;
const program6 = `
  (
    (+ 3)                                     ; 3-adder
    ((+ 2) 1)                                 ; 1+2
  )
`;
const program7 = '((do (puts 3)) 4)';
const program8 = '(((letfn f) ((+ 1) %)) (f 3))';
const program9a = '(((letfn f) (((if ((= 0) %)) 100)           ((- %) 1)))     (f 3)) ; if x==0 return 100 else return x-1';
const program9b = '(((letfn f) (((if ((= 0) %)) 100)           ((- %) 1)))     (f 0)) ; if x==0 return 100 else return x-1';
const program9c = '(((letfn f) (((if ((= 0) %)) 100)           ((- %) 1)))     (f 0)) ; if x==0 return 100 else return x-1';
const program10 = '(((letfn f) (((if ((= 0) %)) 100)        (f ((- %) 1))) )   (f 3)) ; if x==0 return 100 else return f(x-1)';
const program11 = '(((letfn f) (((if ((= 1) %)) %  ) ((* %) (f ((- %) 1))) ) ) (f 10)) ; factorial FTW!';

const ast1 = {
  type: 'A',
  left: {
    type: 'A',
    left: {type: 'T', internal: '+'},
    right: {
      type: 'A',
      left: {
        type: 'A',
        left: {type: 'T', internal: 'puts'},
        right: {
          type: 'A',
          left: {type: 'T', internal: '+'},
          right: {type: 'N', internal: 5}
        }
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
const result2a = { type: 'N', internal: 99 };
const result2b = { type: 'N', internal: 100 };
const result2c = { type: 'N', internal: 35 };
const result2d = { type: 'N', internal: 57 };
const result3a = { type: 'B', internal: true };
const result3b = { type: 'B', internal: false };
const result3c = { type: 'B', internal: true };
const result3d = { type: 'B', internal: false };
const result4a = { type: 'N', internal: 99 };
const result4b = { type: 'N', internal: 197 };
const result5 = { type: 'N', internal: 6 };
const result6 = { type: 'N', internal: 6 };
const result7 = { type: 'N', internal: 4 };
const result8 = { type: 'N', internal: 4 };
const result9a = { type: 'N', internal: 2 };
const result9b = { type: 'N', internal: 100 };
const result9c = { type: 'N', internal: 100 };
const result10 = { type: 'N', internal: 100 };
const result11 = { type: 'N', internal: 3628800 };

describe("Evaluator", function() {
  var parseExpression = require('../lib/Reader').parseExpression;
  it("should be able to parse an expression", function() {
    expect(parseExpression(program1)[0]).toEqual(ast1);
  });

  const {evaluate,coreScope} = require('../lib/Evaluator');
  it("should be able to evaluate an ast", function() {
    expect(evaluate(ast1,coreScope)).toEqual(result1);
  });

  it("should be able to parse and evaluate an expression", function() {
    expect(evaluate(parseExpression(program1)[0],coreScope)).toEqual(result1);
  });




  it("should be able to do 'if' true function", function() {
    expect(evaluate(parseExpression(program2a)[0],coreScope)).toEqual(result2a);
  });

  it("should be able to do 'if' false function", function() {
    expect(evaluate(parseExpression(program2b)[0],coreScope)).toEqual(result2b);
  });

  it("should be able to do 'equals' same number function", function() {
    expect(evaluate(parseExpression(program3a)[0],coreScope)).toEqual(result3a);
  });

  it("should be able to do 'equals' different number function", function() {
    expect(evaluate(parseExpression(program3b)[0],coreScope)).toEqual(result3b);
  });

  it("should be able to do 'equals' same boolean function", function() {
    expect(evaluate(parseExpression(program3c)[0],coreScope)).toEqual(result3c);
  });

  it("should be able to do 'equals' different boolean function", function() {
    expect(evaluate(parseExpression(program3d)[0],coreScope)).toEqual(result3d);
  });

  it("should be able to do more complex 'if' true function", function() {
    expect(evaluate(parseExpression(program2c)[0],coreScope)).toEqual(result2c);
  });

  it("should be able to do more complex 'if' false function", function() {
    expect(evaluate(parseExpression(program2d)[0],coreScope)).toEqual(result2d);
  });


  it("should be able to do variable substitution using 'let'", function() {
    expect(evaluate(parseExpression(program4a)[0],coreScope)).toEqual(result4a);
  });

  it("should be able to do nested variable substitution using 'let'", function() {
    expect(evaluate(parseExpression(program4b)[0],coreScope)).toEqual(result4b);
  });

  it("should be able to do multiline expressions", function() {
    expect(evaluate(parseExpression(program5)[0],coreScope)).toEqual(result5);
  });

  it("should be able to do multiline expressions with comments", function() {
    expect(evaluate(parseExpression(program6)[0],coreScope)).toEqual(result6);
  });

  it("should be able to do 'do'", function() {
    expect(evaluate(parseExpression(program7)[0],coreScope)).toEqual(result7);
  });

  it("should be able to do 'letfn'", function() {
    expect(evaluate(parseExpression(program8)[0],coreScope)).toEqual(result8);
  });

  it("should be able to do a more complex 'letfn' a", function() {
    expect(evaluate(parseExpression(program9a)[0],coreScope)).toEqual(result9a);
  });

  it("should be able to do a more complex 'letfn' b", function() {
    expect(evaluate(parseExpression(program9b)[0],coreScope)).toEqual(result9b);
  });

  it("should be able to do a more complex 'letfn' with eval", function() {
    expect(evaluate(parseExpression(program9c)[0],coreScope)).toEqual(result9c);
  });

  it("should be able to do a recursive function", function() {
    expect(evaluate(parseExpression(program10)[0],coreScope)).toEqual(result10);
  });

  it("should be able to do a useful recursive function", function() {
    expect(evaluate(parseExpression(program11)[0],coreScope)).toEqual(result11);
  });

});

