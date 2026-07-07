### Mathematical Optimization

**Mathematical Optimization** (also known as **Mathematical Programming**) is the process of finding the best possible solution $\mathbf{x}$, with regard to some criterion $f(\mathbf{x})$, from a set of available alternatives $\mathbf{x} \in X$.

Mathematical optimization problems are problems of the form
$$
\min_{\mathbf{x} \in X}f(\mathbf{x})
$$
where $f: X \to \mathbb{R}$ is a function, and $X\subseteq \mathbb{R}^n$ is a set. If $X = \mathbb{R}^n$ we call the problem **unconstrained**, and if $X \neq \mathbb{R}^n$ we call the problem **constrained**.

### Variants

- **Linear Programming** (**LP**) is a specific class of mathematical optimization in which the objective function and all constraints are strictly linear. In general, for LP it is assumed all variables are continuous. See [[Linear Optimisation]].
- **Integer Linear Programming** (**ILP**) is variation of linear programming where all of the decision variables $\mathbf{x}$ are constrained to take on integer values $\mathbf{x} \in \mathbb{Z}^n$. ILP problems are strictly more difficult than ILP problems. See [[Integer Linear Optimization#Integer Linear Optimization]]
- **Mixed Integer Linear Programming** (**MILP** or **MIP**) is the superclass of problems that includes both LP and ILP, or combinations of the two. See [[Integer Linear Optimization#Mixed-Integer Linear Programming]]
- **Non-linear Optimization** is a subclass of mathematical optimization in which the objective function and all constraints may be linear or non-linear. In general it is assumed all variables are continuous. See [[Non-Linear Optimization]].
- **Constraint Solving** generally refers to solvers that specifically aim to find any feasible object, rather than specifically optimize. Optimization may be implemented implicitly by repeatedly updating a bound on the objective function as a constraint.

