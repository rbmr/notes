---
tags:
  - mathematics/optimization
---
The most common sets in optimization theory.

### Convex Sets

- The **line** through points $\mathbf{x},\mathbf{y} \in \mathbb{R}^n$, is defined as the set $\{ \mathbf{z} \in \mathbb{R}^n \mid \mathbf{z}=\alpha \mathbf{x}+(1-\alpha)\mathbf{y},\ \alpha\in \mathbb{R}\}$.
- The **line segment** between points $\mathbf{x},\mathbf{y} \in \mathbb{R}^n$, is defined as the set $\{ \mathbf{z} \in \mathbb{R}^n \mid \mathbf{z}=\alpha \mathbf{x}+(1-\alpha)\mathbf{y},\ \alpha\in [0,1]\}$.
- A set $X \subseteq \mathbb{R}^n$ is **convex** if the line segment between any two points $\mathbf{x}, \mathbf{y} \in X$ of the set lies entirely within the set.
- Operations that preserve convexity of sets:
	- **Intersection**: the intersection of any collection of convex sets is convex. (the union of two convex sets is generally *not* convex.)
	- **Affine preimage**: if $S$ is convex, then $\{x : Ax + b \in S\}$ is convex.
	- **Affine image**: if $S$ is convex, then $\{Ax + b : x \in S\}$ is convex.

### Convex Functions

- Let $X \subseteq \mathbb{R}^n$ be a convex set. A function $f:X \rightarrow \mathbb{R}$ is:
	- **convex** if for every $x, y \in X$ and $t \in [0,1]$, we have $f(tx + (1-t)y) \le tf(x) + (1-t)f(y)$. 
	- **strictly convex** if for every $x, y \in X$ such that $x \ne y$ and $t \in (0,1)$, we have $f(tx + (1-t)y) < tf(x) + (1-t)f(y)$. 
	- **(strictly) concave** if $-f$ is (strictly) convex.
	- Intuitively: a function is convex if the line between any two points on its graph lies on or above the graph.
- For a function $f:S \to \mathbb{R}$ with domain $S \subseteq \mathbb{R}^n$, its **epigraph** $\text{epi}(f)$ is defined as $\text{epi}(f):= \{ (\mathbf{x},t) \in S \times \mathbb{R} \mid t\geq f(\mathbf{x}) \}$.
	- that is, the set of all points on or above the graph of $f$.
	- A function is convex if and only if its epigraph is a convex set.
- Ar a function $f$, its **sublevel set** for a given $\alpha \in \mathbb{R}$ is defined as $\{x : f(x) \le \alpha\}$.
	- If $f$ is a convex function, its sublevel sets are convex sets for all $\alpha \in \mathbb{R}$.
	- The converse fails: a function can have perfectly convex sublevel sets without being a convex function itself.
- Convexity can be verified with [[Multivariate Calculus#The Hessian|the Hessian]]. Let $X \subseteq \mathbb{R}^n$ be an open convex set, and let $f:X \rightarrow \mathbb{R}$ be twice continuously differentiable on $X$. Then,
	- $f$ is convex **if and only if** its Hessian $\nabla^2 f(x) \succeq 0$ for all $x \in X$. 
	- $f$ is strictly convex **if** its Hessian $\nabla^2 f(x) \succ 0$ for all $x \in X$. 
	- Note a positive definite hessian is sufficient but not necessary for strict convexity, for example: $f(x)=x^4$ is strictly convex, yet $f''(0) = 0$.
	- To compute the Hessian of an objective written in matrix notation (e.g. $\mathbf{x}^\top A\mathbf{x}$ or $\|A\mathbf{x}-\mathbf{b}\|^2$), see [[Multivariate Calculus#Gradients and Hessians in Matrix Notation]].
- Sometimes its easiest to establish convexity by recognizing $f$ as being composed from simpler convex functions:
	- **Nonnegative combination**: if $f$, and $g$ are convex functions and $\alpha, \beta \ge 0$, then $x \mapsto \alpha f(x) + \beta g(x)$ is convex. 
	- **Affine precomposition**: if $f$ is convex, then $x \mapsto f(Ax + b)$ is convex. 
	- **Pointwise maximum**: if $f_1, \dots, f_k$ are convex functions, then both $\max_i f_i$ and $\sup_{i}f_{i}$ are convex. 
		- Intuition: the region on or above the graph of $\max_i f_i$ is the intersection of the epigraphs of each $f_i$, and an intersection of convex sets is convex.
	- **Scalar composition**: for $h: \mathbb{R} \to \mathbb{R}$ and a convex or concave inner function $g$, the composition $h \circ g$ is convex when the signs line up: $g$ convex with $h$ convex nondecreasing, OR $g$ concave with $h$ convex nonincreasing.
		- _Proof_: Apply the one dimensional chain rule twice $(h\circ g)'' = h''(g)\,(g')^2 + h'(g)\,g''$. The first term is $\ge 0$ when $h$ is convex. The second term is $\ge 0$ when the monotonicity of $h$ (the sign of $h'$) matches the curvature of $g$ (the sign of $g''$).
- Some examples of convex funtions:
    - **Affine functions**: every affine function $a^\top x + b$ is both convex and concave.
    - **Norms**: every [[Similarity#Norms|norm]] is convex.
    - **Quadratic forms**: a quadratic form $x^\top A x$ is convex if and only if $A \succeq 0$.
- **Convex Fermat Theorem**: Let $f:\mathbb{R}^n \rightarrow \mathbb{R}$ be a continuously differentiable, convex function. Then, $x^* \in \mathbb{R}^n$ is a global minimizer of $f$ if and only if $\nabla f(x^*) = 0$. If $f$ is strictly convex, then $x^*$ is the unique global minimizer of $f$ if and only if $\nabla f(x^*) = 0$.
	- Contrast this with the [[Univariate Calculus#Extreme values|plain Fermat's theorem]]: stationarity is normally only *necessary* for *local* minimizers; under convexity it is both *necessary* AND *sufficient* for *global* minimizers.

### Polyhedra

- For a given vector $\mathbf{a} \in \mathbb{R}^n$ and a scalar $b \in \mathbb{R}$ the set $\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{a}^\top\mathbf{x} \leq b \}$ is called a **halfspace**.
- The intersection of a finite number of half spaces is called a **polyhedron**.
- A set $P \subseteq \mathbb{R}^n$ is a polyhedron if and only if there exists some $m \times n$ matrix $A$ and $\mathbf{b} \in \mathbb{R}^n$ such that $P=\{x \in \mathbb{R}^n \mid Ax \leq b\}$. Derivation: 
	1. Consider $m$ halfspaces in $\mathbb{R}^n$, such that for $1 \leq i \leq m$ the halfspace $H_{i}$ can be defined as $H_{i}=\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{a}_{i}^\top\mathbf{x} \leq b_{i} \}$. 
	2. The polyhedron $P=\bigcap_{i=1}^mH_{i}$ can then be rewritten as $P=\bigcap_{i=1}^m\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{a}_{i}^\top\mathbf{x} \leq b_{i} \}=\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{a}_{1}^\top\mathbf{x} \leq b_{1}, \dots, \mathbf{a}_{m}^\top\mathbf{x} \leq b_{m} \}$. 
	3. Using the matrix $A=[\mathbf{a}_{1}\ \cdots \ \mathbf{a}_{m}]^\top$ and vector $\mathbf{b}=[b_{1}\ \cdots\ b_{m}]^\top$, this gives $P=\{ \mathbf{x} \in \mathbb{R}^n \mid A\mathbf{x} \leq \mathbf{b} \}$.
- Any 