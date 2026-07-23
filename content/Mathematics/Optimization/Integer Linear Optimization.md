### Integer Linear Optimization

The feasible region is no longer a continuous convex polyhedron $\mathcal{P}$ like with real linear optimization, but rather a discrete set of lattice points contained within that polyhedron. 

A foundational concept in solving ILPs is the **LP relaxation**. This is formed by dropping the integer constraint $\mathbf{x} \in \mathbb{Z}^n$, transforming the ILP back into a standard LP. 
- The optimal value of the LP relaxation always provides an upper bound on the optimal value of the ILP. 
- If the optimal solution to the LP relaxation happens to consist entirely of integers, then it is also the optimal solution to the original LP.
- Rounding the solution to the LP relaxation to the nearest integers is generally ineffective,, leading to highly suboptimal solutions or commonly a point outside the feasible region.

To find the true optimal we may take the following approaches:
- **Branch and bound**:
	- Bound: Solves the LP relaxation at each node of the tree to find an upper bound.
	- Branch: If the LP solution contains a fractional value for a variable that must be an integer (e.g. $x_{1}=3.14$), the algorithm creates two new sub-problems (branches) with mutually exclusive constraints (e.g. $x \leq 3$ and $x \geq 4$).
	- Prune: If a branch yields an LP bound that is worse than the best integer solution found so far, or if the sub-problem is infeasible, that entire branch is pruned and explored no further. 
- **Cutting-plane method**: This approach solves the LP relaxation, and then iteratively adds new linear constraints (called "cuts"). These cuts are mathematically designed to slice away the fractional optimal solution from the continuous feasible region, without eliminating any valid integer points. This process repeats until the continuous optimal solution naturally lands on an integer coordinate.
- **Branch and Cut**: State of the art commercial solvers utilize a hybrid approach. They execute branch and bound, but apply cutting planes at the nodes to tighten the LP relaxations.

Integer Linear Programming is NP-hard in general.

### Mixed-Integer Linear Programming

**Mixed Integer Linear Programming** (**MILP** or simply **MIP**) is a variation of linear programming where the decision variables are partitioned into two sets: continuous variables, and integer variables. 

The feasible region of a MILP can be understood as a union of disjoint polyhedrons. Because MILP contains integer constraints, it inherits the mathematical complexity of ILP, and is therefore generally NP-hard. 

The same approaches of LP relaxation, branch and bound, cutting planes, and branch and cut apply to MILP aswell.
