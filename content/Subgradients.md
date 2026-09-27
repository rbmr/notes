---
tags:
  - mathematics/optimization
---
Theorems for minimization/maximization frequently rely on the gradient. For functions that are not differentiable everywhere (e.g. $f(x) = |x|$), the gradient generalizes to a *set* of admissible slopes.

### Core Definitions

- Let $X \subseteq \mathbb{R}^n$, and let $f: X \to \mathbb{R}$. A vector $r \in \mathbb{R}^n$ is a **subgradient** of $f$ at $x \in X$ if:
	$$
	f(y) \ge f(x) + r^\top (y - x) \quad \forall y \in X
	$$
	Geometrically: $r$ is the slope of an affine function that touches the graph of $f$ at $x$ and lies below the graph everywhere else.
- The set of all subgradients of $f$ at $x$ is called the **subdifferential**, denoted $\partial f(x)$.
- Example: $f(y) = |y|$ at $x = 0$: $r$ is a subgradient if and only if $|y| \geq ry$ for all $y \in \mathbb{R}$, which holds exactly for $r \in [-1, 1]$. Hence $\partial f(0) = [-1,1]$: every line through the origin with slope between $-1$ and $1$ stays below the V-shape.

### Properties

- If a convex function $f$ is finite everywhere then its subdifferential is non-empty for every $x$.
- If a convex function $f$ is differentiable at $x$, then $\partial f(x) = \{\nabla f(x)\}$. That is, the tangent plane is the only affine lower bound touching the graph at $x$.
- For non-convex $f$, $\partial f(x)$ is empty except where $f$ is equal to its [[Convexity and Polyhedra#Convex Functions|convex envelope]].
- **Fermat Theorem (subgradient version)**: Let $f: \mathbb{R}^n \to \mathbb{R}$, and let $x^* \in \mathbb{R}^n$. Then $x^*$ is a *global* minimizer of $f$ if and only if $0 \in \partial f(x^*)$. If $f$ is strictly convex, then $x^*$ is the *unique* global minimizer of $f$.
	- Intuition: substituting $r = 0$ into the subgradient inequality gives $f(y) \geq f(x^*)$ for all $y$, which *is* the definition of a global minimizer, the converse makes intuitive sense aswell.
- Subdifferentials of complicated convex functions can be computed using the subdifferentials of simpler convex functions. Let $f: X \to \mathbb{R}$ and $g: X \to \mathbb{R}$ be convex functions and $x \in X$:
	- **Norm**: if $f(x) = \|x\|$, then $\partial f(0) = \{r \in \mathbb{R}^n : \|r\| \leq 1\}$ (the unit ball), at any $x \neq 0$ the norm is differentiable.
	- **Non-negative scaling**: $\partial(\alpha f)(x) = \alpha\,\partial f(x) := \{\alpha r : r \in \partial f(x)\}$ for all $\alpha \geq 0$.
	- **Sum**: $\partial(f+g)(x) \supseteq \partial f(x) + \partial g(x) := \{r + s \mid r \in \partial f(x), s \in \partial g(x)\}$, with equality if $f$ or $g$ is continuous.
		- This "sum of sets", where every element of the resulting set is the sum of one element from either set is called the **Minkowski sum**.
	- **Separability**: let $I_1,\dots,I_p$ partition the coordinate indices $\{1,\dots,n\}$ of $x\in\mathbb{R}^n$, and write $x_j$ for the sub-vector of $x$ indexed by $I_j$. If $f(x)=\sum_{j=1}^p f_j(x_j)$, for some functions $f_{j}:\mathbb{R}^{|I_{j}|}\to \mathbb{R}$, then $\partial f(x) = \partial f_1(x_1)\times\cdots\times\partial f_p(x_p)$.
	- **Maximum**: $\partial(\max\{f,g\})(x)$ equals $\partial f(x)$ where $f(x) > g(x)$, equals $\partial g(x)$ where $g(x) > f(x)$, and equals $\text{conv}(\partial f(x) \cup \partial g(x))$ at the kink where $f(x) = g(x)$.

### Note on Constrained Optimization

- The **normal cone** of a convex set $C$ at $x^* \in C$ is defined as $N_C(x^*) = \{ g \in \mathbb{R}^n \mid g^\top(x-x^*) \le 0\ \forall x \in C \}$. Informally, it is the set of directions $g$ that make an angle of at least $90°$ with every feasible direction at $x^*$.
	- If $x^*$ is in the interior of $C$, then any small enough direction is a feasible direction, so the only $g$ satisfying the inequality against every one of them is $g=0$, thus $N_C(x^*) = \{0\}$.
	- $N_C(x^*)$ is always a convex cone (scaling a valid $g$ by any $\lambda\ge0$ keeps the inequality).
- **Constrained optimality**: let $f$ be convex and $C$ a convex feasible set. Then $x^* \in C$ minimizes $f$ over $C$ if and only if $0 \in \partial f(x^*) + N_C(x^*)$.
	- This generalizes the unconstrained Fermat theorem $0\in\partial f(x^*)$.
	- Understanding: $0\in\partial f(x^*)+N_C(x^*)$ means there *exists* some $r\in\partial f(x^*)$ with $-r\in N_C(x^*)$, or alternatively, $(-\partial f(x^*)) \cap N_C(x^*) \neq \varnothing$. It *does not* mean $-\partial f(x^*)\subseteq N_C(x^*)$ (every subgradient's negation lying in the normal cone), which is a strictly stronger, generally false claim.
	- Example: $f(x)=|x|$, $C=[0,\infty)$, $x^*=0$ (which does minimize $f$ over $C$). Here $\partial f(0)=[-1,1]$ and $N_C(0)=(-\infty,0]$. Then, $0 \in [-1,1]+(-\infty,0]=(-\infty,1]$. But $-\partial f(0)=[-1,1]\not\subseteq(-\infty,0]$.