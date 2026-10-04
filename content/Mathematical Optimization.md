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
where $f: X \to \mathbb{R}$ is a function, and $X\subseteq \mathbb{R}^n$ is the set of available alternatives.

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

### Relaxations

A **relaxation** of the problem $(P)$: $\inf_{\mathbf{x} \in X} f(\mathbf{x})$ is a problem $(R)$: $\inf_{\mathbf{x} \in X_R} f_R(\mathbf{x})$ such that:
- $X \subseteq X_R$, that is, every feasible solution of $(P)$ is feasible for $(R)$.
- $f_R(\mathbf{x}) \leq f(\mathbf{x})$ for all $\mathbf{x} \in X$, the objective is never overestimated on the original feasible region.

A relaxation is only useful if it is easier to solve than the original problem.

Properties:
- $v(R) \leq v(P)$, so a relaxation provides a lower bound.
	- _Proof_: $v(R) = \inf_{\mathbf{x} \in X_R} f_R(\mathbf{x}) \leq \inf_{\mathbf{x} \in X} f_R(\mathbf{x}) \leq \inf_{\mathbf{x} \in X} f(\mathbf{x}) = v(P)$.
- If an optimal solution $\mathbf{x}^*$ of $(R)$ satisfies $\mathbf{x}^* \in X$ and $f_R(\mathbf{x}^*) = f(\mathbf{x}^*)$, then $\mathbf{x}^*$ is an optimal solution of $(P)$ and $v(R) = v(P)$.
	- _Proof_: $v(P) \leq f(\mathbf{x}^*) = f_R(\mathbf{x}^*) = v(R) \leq v(P)$.
- In general, an optimal solution of a relaxation is not feasible for $(P)$.
- For a maximization problem the inequalities flip: $f_R(\mathbf{x}) \geq f(\mathbf{x})$ for all $\mathbf{x} \in X$, and $v(R) \geq v(P)$ is an upper bound.

### Branch and Bound

**Branch-and-Bound** (**B&B**) is a method for solving optimization problems by breaking them down into smaller subproblems, and using a bounding function to eliminate subproblems that cannot contain the optimal solution.

Formally, consider the problem $(P)$ with optimal value $v(P) = \inf_{\mathbf{x} \in X} f(\mathbf{x})$.
- **Branching**: if $X = \bigcup_{k=1}^{K} X_k$, then $v(P) = \min_{k} \inf_{\mathbf{x} \in X_k} f(\mathbf{x})$. So $(P)$ can be solved by solving each **subproblem** $\inf_{\mathbf{x} \in X_k} f(\mathbf{x})$ and taking the best one. Note that $X_{k}$ need not be disjoint, but are usually chosen so to avoid exploring the same solutions more than once. Applying this recursively gives a search tree, in which every node is a subproblem with feasible region $\tilde{X} \subseteq X$.
	- Example for MILP: if $x_j^*$ is fractional in the optimal solution of the LP relaxation, branch into $x_j \leq \lfloor x_j^* \rfloor$ and $x_j \geq \lceil x_j^* \rceil$.
- **Bounding**: instead of solving a subproblem exactly, compute at each node:
	- a lower bound $\underline{z}(\tilde{X}) \leq \inf_{\mathbf{x} \in \tilde{X}} f(\mathbf{x})$, usually the optimal value of a [[#Relaxations|relaxation]].
	- an upper bound $\bar{z}(\tilde{X}) = f(\mathbf{x}')$ for some feasible $\mathbf{x}' \in \tilde{X}$, usually found by a heuristic. If no feasible point is known, $\bar{z}(\tilde{X}) = \infty$.
- After branching $\tilde{X}$ into $\tilde{X}_1, \dots, \tilde{X}_K$, the bounds of the parent are updated:
	$$
	\underline{z}(\tilde{X}) := \min_{k} \underline{z}(\tilde{X}_k), \qquad \bar{z}(\tilde{X}) := \min\{\bar{z}(\tilde{X}),\ \min_{k} \bar{z}(\tilde{X}_k)\}
	$$
	- At the root, $\bar{z}(X)$ is the objective value of the best feasible solution found so far, called the **incumbent**.
- **Pruning**: a node $\tilde{X}_k$ is not branched on further if:
	1. **by optimality**: its subproblem is solved to optimality, e.g. the optimal solution of its relaxation is feasible for the subproblem.
	2. **by bound**: $\underline{z}(\tilde{X}_k) \geq \bar{z}(X)$, so it cannot contain a solution better than the incumbent.
	3. **by infeasibility**: $\tilde{X}_k = \emptyset$, e.g. its relaxation is infeasible.
- **Node selection**: deciding which open node to branch on next. Common strategies are **best-bound-first** (the node with the lowest lower bound, which tends to minimize the number of nodes that need to be explored) and **depth-first search** (which tends to find feasible solutions quickly).
- When no open nodes remain, the incumbent is an optimal solution.
