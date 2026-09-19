---
tags:
  - mathematics/optimization
---
### Integer Linear Optimization

**Integer Linear Optimization** (also called **integer linear programming**) is a variation of linear programming where the decision variables are constrained to be integers, instead of allowing all real values like in basic [[Linear Optimisation|Linear Programming]].

The feasible region is no longer a continuous convex polyhedron $\mathcal{P}$ like with real linear optimization, but rather a discrete set of lattice points contained within that polyhedron. 

A foundational concept in solving ILPs is the **LP relaxation**. This is formed by dropping the integer constraint $\mathbf{x} \in \mathbb{Z}^n$, transforming the ILP back into a standard LP. 
- The optimal value of the LP relaxation always provides an upper bound on the optimal value of the ILP. 
- If the optimal solution to the LP relaxation happens to consist entirely of integers, then it is also the optimal solution to the original LP.
- Rounding the solution to the LP relaxation to the nearest integers is generally ineffective, leading to highly suboptimal solutions or commonly a point outside the feasible region.

### Mixed-Integer Linear Programming

**Mixed Integer Linear Programming** (**MILP** or simply **MIP**) is a variation of linear programming where the decision variables are partitioned into two sets: continuous variables, and integer variables. The feasible region of a MILP can be understood as a union of disjoint polyhedrons. 

Because MILP contains integer constraints, it inherits the mathematical complexity of ILP, and is therefore generally NP-hard. 

### Formulations

(TODO: define formulations, polyhedra, convex hulls, and all the interesting theory around it. This should serve as an indication as a step towards "why ILP is so much more difficult than standard LP")

### Modelling notes

(TODO: handling logical negation, and logical AND of one or more constraints is trivial, but it might be nice to explain how to handle logical OR, and if-then of multiple constraints)