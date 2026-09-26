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
- **Convex Fermat Theorem (subgradient version)**: Let $f: \mathbb{R}^n \to \mathbb{R}$ be a convex function, and let $x^* \in \mathbb{R}^n$. Then $x^*$ is a global minimizer of $f$ if and only if $0 \in \partial f(x^*)$. If $f$ is strictly convex, then $x^*$ is the unique global minimizer of $f$.
	- Intuition: substituting $r = 0$ into the subgradient inequality gives $f(y) \geq f(x^*)$ for all $y$, which *is* the definition of a global minimizer, the converse makes intuitive sense aswell.
- Subdifferentials of complicated convex functions can be computed using the subdifferentials of simpler convex functions. Let $f: X \to \mathbb{R}$ and $g: X \to \mathbb{R}$ be convex functions and $x \in X$:
	- **Norm**: if $f(x) = \|x\|$, then $\partial f(0) = \{r \in \mathbb{R}^n : \|r\| \leq 1\}$ (the unit ball), at any $x \neq 0$ the norm is differentiable.
	- **Non-negative scaling**: $\partial(\alpha f)(x) = \alpha\,\partial f(x) := \{\alpha r : r \in \partial f(x)\}$ for all $\alpha \geq 0$.
	- **Sum**: $\partial(f+g)(x) = \partial f(x) + \partial g(x) := \{r + s \mid r \in \partial f(x), s \in \partial g(x)\}$. 
		- This "sum of sets", where every element of the resulting set is the sum of one element from either set is called the **Minkowski sum**.
	- **Maximum**: $\partial(\max\{f,g\})(x)$ equals $\partial f(x)$ where $f(x) > g(x)$, equals $\partial g(x)$ where $g(x) > f(x)$, and equals $\text{conv}(\partial f(x) \cup \partial g(x))$ at the kink where $f(x) = g(x)$.

(TODO: extend this section to include all the rules for subdifferentials from the lecture "Basics of convex optimization" from 2026-2027 FEM21061 ML in OR )
