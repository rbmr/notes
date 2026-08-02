### Mathematical Optimization

**Mathematical Optimization** (also known as **Mathematical Programming**) is the process of finding the best possible solution $\mathbf{x}$, with regard to some criterion $f(\mathbf{x})$, from a set of available alternatives $\mathbf{x} \in X$.

Mathematical optimization problems generally have the following form:
$$
\min_{\mathbf{x} \in X}f(\mathbf{x})
$$
where $f: X \to \mathbb{R}$ is a function, and $X\subseteq \mathbb{R}^n$ is a set. If $X = \mathbb{R}^n$ we call the problem **unconstrained**, and **constrained** otherwise.

### Variants

Variants of Mathematical Optimization problems include:

- **Linear Programming** (**LP**) is a specific class of mathematical optimization in which the objective function and all constraints are strictly linear. In general, for LP it is assumed all variables are continuous. See [[Linear Optimisation]].
- **Integer Linear Programming** (**ILP**) is variation of linear programming where all of the decision variables $\mathbf{x}$ are constrained to take on integer values $\mathbf{x} \in \mathbb{Z}^n$. ILP problems are strictly more difficult than LP problems. See [[Integer Linear Optimization#Integer Linear Optimization]]
- **Mixed Integer Linear Programming** (**MILP** or **MIP**) is the superclass of problems that includes both LP and ILP, or combinations of the two. See [[Integer Linear Optimization#Mixed-Integer Linear Programming]]
- **Non-linear Optimization** is a subclass of mathematical optimization in which the objective function and all constraints may be linear or non-linear. In general it is assumed all variables are continuous. See [[Non-Linear Optimization]].
- **Combinatorial Optimization** is a branch of mathematical optimization that involves finding an optimal object from a finite (or countably infinite) set of alternatives. In these problems, the set of feasible solutions $X$ is discrete or can be reduced to a discrete set, often dealing with integer assignments, graphs, or permutations.
- **Constraint Solving** generally refers to solvers that specifically aim to find any feasible object, rather than specifically optimize. Optimization may be implemented implicitly by repeatedly updating a bound on the objective function as a constraint.
- **Boolean Satisfiability** (**SAT**) is a form of combinatorial optimization where all variables take on boolean (true/false) values, and the goal is just to find some assignment that satisfies all logical constraints.

This list is definitely not exhaustive.
