---
tags:
  - mathematics/optimization
---
### Mathematical Optimization

**Mathematical Optimization** (also known as **Mathematical Programming**) is the process of finding the best possible solution $\mathbf{x}$, with regard to some criterion $f(\mathbf{x})$, from a set of available alternatives $\mathbf{x} \in X$.

Mathematical optimization problems generally have the following form:
$$
\inf_{\mathbf{x} \in X}f(\mathbf{x})
$$
where $f: X \to \mathbb{R}$ is a function, and $X\subseteq \mathbb{R}^n$ is the set of available alternatives. If $X = \mathbb{R}^n$ we call the problem **unconstrained**, and **constrained** otherwise.

The problem is stated with $\inf$ rather than $\min$ because a minimizer is not guaranteed to exist, when one does, the infimum is attained and equals the minimum.

### Variants

Variants of Mathematical Optimization problems include but are not limited to:

- **[[Linear Optimisation]]** (**LP**) is a specific class of mathematical optimization in which the objective function and all constraints are strictly linear. In general, for LP it is assumed all variables are continuous.
- **[[Integer Linear Optimization#Integer Linear Optimization|Integer Linear Optimization]]** (**ILP**) is variation of linear programming where all of the decision variables $\mathbf{x}$ are constrained to take on integer values $\mathbf{x} \in \mathbb{Z}^n$. ILP problems are strictly more difficult than LP problems.
- **[[Integer Linear Optimization#Mixed-Integer Linear Programming|Mixed Integer Linear Programming]]** (**MILP** or **MIP**) is the superclass of problems that includes both LP and ILP, or combinations of the two.
- **Non-Linear Optimization** is a subclass of mathematical optimization in which the objective function and all constraints may be linear or non-linear. In general it is assumed all variables are continuous. See [[Unconstrained Optimization]] and [[Constrained Optimization]].
- **Combinatorial Optimization** is a branch of mathematical optimization that involves finding an optimal object from a finite (or countably infinite) set of alternatives. In these problems, the set of feasible solutions $X$ is discrete or can be reduced to a discrete set, often dealing with integer assignments, graphs, or permutations.
- **[[Constraint Solving]]** generally refers to solvers that specifically aim to find any feasible object, rather than specifically optimize. Optimization may be implemented implicitly by repeatedly updating a bound on the objective function as a constraint.
- **[[Boolean Satisfiability]]** (**SAT**) is a form of combinatorial optimization where all variables take on boolean (true/false) values, and the constraints are boolean formulas and the goal is just to find some assignment that satisfies all logical constraints.

This list is definitely not exhaustive.

### Branch and Bound

(TODO: Provide formal definition of a branch and bound, take lecture 3 from FEB22002X Combinatorial Optimization 2025-2026 as reference)

**Branch-and-Bound** (**B&B**) is a method for solving optimization problems by breaking them down into smaller subproblems, and using a bounding function to eliminate subproblems that cannot contain the optimal solution.

General Process:
1. Branch (Divide): Divide the problem space into two or more smaller, mutually exclusive subproblems (representing child nodes in a search tree).
2. Bound: Calculate an optimistic estimate of the best possible solution that can be found within each subproblem.
3. Prune: Keep track of the best valid solution found globally. If the subproblem's bound is worse than or equal to the current global best, discard (prune) that subproblem and all its potential children.

### Relaxations

(TODO: Provide formal definition of a relaxation, take lecture 4&5 from FEB22002X Combinatorial Optimization 2025-2026 as reference)