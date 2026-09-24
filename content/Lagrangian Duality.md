---
tags:
  - mathematics/optimization
---
Turning a constrained optimization problem into an unconstrained min-max problem, and using it to derive lower bounds (weak duality) and, under convexity, exact bounds (strong duality).

### Lagrangian Function

The **Lagrangian function** of a [[Constrained Optimization#Constrained Optimization|constrained optimization problem]] puts the constraints into the objective, attaching to each constraint a variable price $\lambda_i$, called its **Lagrange multiplier**:
$$
\mathcal{L}(\mathbf{x}, \boldsymbol{\lambda})=f(\mathbf{x})-\sum_{i\in\mathcal{E}\cup \mathcal{I}}\lambda_{i}c_{i}(\mathbf{x})
$$

The fundamental property of the Lagrangian: *maximizing* the Lagrangian over the Lagrange multipliers $\boldsymbol{\lambda}$ (with $\lambda_i \geq 0$ for the inequality constraints) recovers the original constrained problem. For any $\mathbf{x} \in \mathbb{R}^n$:
$$
\sup_{\substack{\lambda_{i} \in \mathbb{R},\ i \in \mathcal{E} \\ \lambda_{i} \geq 0,\ i \in \mathcal{I}}}\mathcal{L}(\mathbf{x},\boldsymbol{\lambda})=\begin{cases}
f(\mathbf{x})&\text{if } \mathbf{x} \text{ is feasible} \\ 
\infty&\text{otherwise}
\end{cases}
$$

Reasoning:
- If $\mathbf{x}$ is feasible: every equality term contributes $\lambda_i \cdot 0 = 0$, and every inequality term satisfies $c_i(\mathbf{x}) \geq 0$ and $\lambda_i \geq 0$, so $-\lambda_i c_i(\mathbf{x}) \le 0$ is maximized by choosing $\lambda_i = 0$. The supremum is $f(\mathbf{x})$.
- If $\mathbf{x}$ is infeasible: some constraint is violated, and scaling up its multiplier (with the appropriate sign for a violated equality, or towards $+\infty$ for a violated inequality, where $c_i(\mathbf{x}) < 0$) drives $\mathcal{L}(\mathbf{x}, \mathbf{\lambda}) \to \infty$.

Consequently, the original constrained optimization problem can be rewritten as an unconstrained min-max problem:
$$
\inf_{\mathbf{x}\in \mathbb{R}^n}\, \{f(\mathbf{x}) : \mathbf{x} \text{ feasible}\} \;=\; \inf_{\mathbf{x}\in \mathbb{R}^n}\ \sup_{\substack{\lambda_{i} \in \mathbb{R},\ i \in \mathcal{E} \\ \lambda_{i} \geq 0,\ i \in \mathcal{I}}} \mathcal{L}(\mathbf{x},\boldsymbol{\lambda})
$$
The inner supremum acts as an infinitely harsh penalty: infeasible points are ruled out by their infinite objective value rather than by explicit constraints. 

This reformulation is the core idea behind duality below, and for the [[Constrained Optimization#Augmented Lagrangian Method|augmented Lagrangian method]].

### Duality

The sup-property above suggests a second problem: instead of maximizing over $\boldsymbol{\lambda}$ for fixed $\mathbf{x}$, fix $\boldsymbol{\lambda}$ and ask what minimizing over $\mathbf{x}$ gives.

- In the context of duality, the original constrained optimization problem is called the **primal problem** $(P)$, and $v(P)$ denotes its optimal value, the lowest value of $f(\mathbf{x})$ among all feasible $\mathbf{x} \in \mathbb{R}^n$.
- By the sup-property of the Lagrangian, the primal problem is the min-max problem
	$$
	v(P) = \inf_{\mathbf{x} \in \mathbb{R}^n}\ \sup_{\substack{\lambda_{i} \in \mathbb{R},\ i \in \mathcal{E} \\ \lambda_{i} \geq 0,\ i \in \mathcal{I}}} \mathcal{L}(\mathbf{x},\boldsymbol{\lambda})
	$$
- Suppose instead we fix some valid multipliers $\boldsymbol\lambda$ ($\lambda_i \in \mathbb{R}$ for $i \in \mathcal{E}$, $\lambda_i \geq 0$ for $i \in \mathcal{I}$) and vary $\mathbf{x}$ first. For every feasible $\mathbf{x}$, the equality terms of the Lagrangian vanish and the inequality terms satisfy $\lambda_i c_i(\mathbf{x}) \geq 0$, so
	$$
	\mathcal{L}(\mathbf{x},\boldsymbol\lambda) = f(\mathbf{x}) - \sum_i \lambda_i c_i(\mathbf{x}) \leq f(\mathbf{x})
	$$
	Interpretation: The Lagrangian $\mathcal{L}(\mathbf{x},\boldsymbol{\lambda})$, at any valid $\boldsymbol\lambda$ is a lower bound on the primal objective $f(\mathbf{x})$ for all *feasible* $\mathbf{x}$.
- Taking the infimum over all $\mathbf{x} \in \mathbb{R}^n$, including infeasible points, can only lower this bound further:
	$$
	\inf_{\mathbf{x} \in \mathbb{R}^n} \mathcal{L}(\mathbf{x}, \boldsymbol\lambda) \;\leq\; \inf_{\mathbf{x} \text{ feasible}} \mathcal{L}(\mathbf{x},\boldsymbol\lambda) \;\leq\; \inf_{\mathbf{x} \text{ feasible}} f(\mathbf{x}) \;=\; v(P)
	$$
- We define the **dual (objective) function** as this infimum, $q(\boldsymbol\lambda) := \inf_{\mathbf{x} \in \mathbb{R}^n} \mathcal{L}(\mathbf{x},\boldsymbol\lambda)$. Thus, every valid $\boldsymbol\lambda$ gives an easy-to-compute lower bound $q(\boldsymbol\lambda)$ on the true optimal value $v(P)$.
- The **dual problem** $(D)$ asks for the best (largest), such lower bound:
	$$
	\begin{align}
	\sup_{\lambda}\quad & q(\lambda) = \inf_{x\in \mathbb{R}^n}\,\mathcal{L}(x,\lambda) \\
	\text{subject to}\quad & \lambda_{i} \geq 0 \quad \forall i \in \mathcal{I}
	\end{align}
	$$
	The optimal value of the dual is denoted as $v(D)$.


Side by side, the primal and dual problems are the same expression with the order of optimization swapped:
$$
(P): \quad v(P) = \inf_{x \in \mathbb{R}^n}\ \sup_{\substack{\lambda_{i} \in \mathbb{R},\ i \in \mathcal{E} \\ \lambda_{i} \geq 0,\ i \in \mathcal{I}}} \mathcal{L}(x,\lambda)
$$
$$
(D): \quad v(D) = \sup_{\substack{\lambda_{i} \in \mathbb{R},\ i \in \mathcal{E} \\ \lambda_{i} \geq 0,\ i \in \mathcal{I}}}\ \inf_{x \in \mathbb{R}^n} \mathcal{L}(x,\lambda)
$$
Weak duality $v(D) \leq v(P)$ is then just the generic "$\max\min \leq \min\max$" inequality specialized to the Lagrangian.

### Duality Theorems

- **Weak Duality**: if $x$ is feasible for $(P)$ and $\lambda$ is feasible for $(D)$, then $f(x) \geq q(\lambda)$. This is exactly the lower-bound argument from the previous section, and it holds for any problem, convex or not.
- If $(P)$ is [[Constrained Optimization#Convex Optimization Problem|convex]], the dual objective $q$ is concave and its domain $\{\lambda : q(\lambda) > -\infty\}$ is convex, so the dual is itself a convex problem, maximizing a concave function over a convex set, even if the primal is hard. In fact $q$ is concave for any primal problem, convex or not: for fixed $x$, $\mathcal{L}(x,\lambda)$ is affine in $\lambda$, and a pointwise infimum of affine functions is concave.
- If $(P)$ is convex with optimal solution $x^*$, and $f$ and the $c_{i}$ are differentiable at $x^*$, then any $\lambda^*$ for which $(x^*, \lambda^*)$ is a [[Constrained Optimization#KKT Conditions|KKT point]] is an optimal solution of $(D)$. Conversely, solving the often easier dual problem produces multipliers with which KKT points can be constructed and optimality can be proven.
- **Strong Duality**: suppose $(P)$ is convex. If Slater's condition holds for $(P)$, then $(D)$ has an optimal solution and $v(P) = v(D)$. Symmetrically, if Slater's condition holds for $(D)$, then $(P)$ has an optimal solution and $v(P) = v(D)$.
- Slater's condition matters, even for convex problems. Consider $\inf\{x : -x^2 \geq 0\}$, which is convex since $-x^2$ is concave, with feasible region $\{0\}$ and optimal value $0$, but no strictly feasible point exists. The dual function is:
	$$
	q(\lambda) = \inf_{x}\{x + \lambda x^2\} = \begin{cases}-\infty & \text{if } \lambda = 0 \\ -\frac{1}{4\lambda} & \text{if } \lambda > 0\end{cases}
	$$
	so $v(D) = \sup_{\lambda > 0} -\frac{1}{4\lambda} = 0 = v(P)$. The optimal values coincide, yet the supremum is not attained, so the dual problem has no optimal solution.
