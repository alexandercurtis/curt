# Curt
## A programming language that is terse to the point of being rude

First order functions. Functions only take one argument. Lazy evaluation. No syntactic sugar - enter the syntax tree directly, which is why it looks like Lisp.

### My first useful program

    ; Factorial
    (
      (
        (letfn f) 
        (
          (
            (if 
              (
                (= 1) 
                %
              )
            ) 
            %
          ) 
          (
            (* %) 
            (
              f 
              (
                (- %) 
                1
              )
            )
          ) 
        ) 
      ) 
      (f 10)
    )

### Getting started

    npm test

    node rt.js

