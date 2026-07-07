
I frequently see scenarios where a collection of real numbers must sum up to one, and each real number must be greater than or equal to zero. 

Scenarios include probabilities, but also convex combinations, and the $(n-1)$ simplex. 

I also notice that once you know the constraints, you can safely leave out one of the numbers, and determine it using the rest of the numbers reducing the degrees of freedom. This also frequently happens implicitly in binary classification. For two classes, if we have probability $p$ for class $A$, then we implicitly know we have probability $(1-p)$ for class not $A$.  

Also any collection of real numbers where not all numbers are zero may be converted to such a probability vector. Methods include:
- simple linear scaling
- softmax (or any other linear scaling after applying a function to all the numbers)
- Note here you can also calculate the last probability via the 1 - sum rule.

Don't know what else to say. Just noticed this pattern showing up everywhere.