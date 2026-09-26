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
- A point $x$ is a **convex combination** of points $y_{1}, \dots, y_{n}$ if it can be written as $x = \sum_{i=1}^{n} \lambda_i y_i$ for some $\lambda_1 \ge 0, \dots, \lambda_n \ge 0$, where $\sum_{i=1}^{n} \lambda_i = 1$.
	- A line segment between two points $\mathbf{x},\mathbf{y} \in \mathbb{R}^n$ is the same as "the set of all points that can be written as a convex combination of points $\mathbf{x}$, and $\mathbf{y}$".  
- The **convex hull** of a set $X \subseteq \mathbb{R}^n$, denoted $\text{conv}(X)$, is the intersection of all convex sets that contain $X$. Or less formally, the "smallest" convex set containing $X$. 
	- Equivalently, it is the set of all convex combinations of points in $X$.

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
- For a function $f: X \to \mathbb{R}$, its **convex envelope** (or **greatest convex minorant**) is defined as $\text{conv}(f)=\sup_{x\in X} \{g(x) \mid g \text{ is convex and } g(y) \le f(y) \text{ for all } y \in X\}$
	- Geometrically, $\text{conv}(f)$ is the function whose epigraph is the convex hull of the epigraph of $f$. 

### Polyhedra

- For a given vector $\mathbf{a} \in \mathbb{R}^n$ and a scalar $b \in \mathbb{R}$ the set $\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{a}^\top\mathbf{x} \leq b \}$ is called a **halfspace**.
- The intersection of a finite number of half spaces is called a **polyhedron**.
- A set $P \subseteq \mathbb{R}^n$ is a polyhedron if and only if there exists some $m \times n$ matrix $A$ and $\mathbf{b} \in \mathbb{R}^n$ such that $P=\{x \in \mathbb{R}^n \mid Ax \leq b\}$. Derivation: 
	1. Consider $m$ halfspaces in $\mathbb{R}^n$, such that for $1 \leq i \leq m$ the halfspace $H_{i}$ can be defined as $H_{i}=\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{a}_{i}^\top\mathbf{x} \leq b_{i} \}$. 
	2. The polyhedron $P=\bigcap_{i=1}^mH_{i}$ can then be rewritten as $P=\bigcap_{i=1}^m\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{a}_{i}^\top\mathbf{x} \leq b_{i} \}=\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{a}_{1}^\top\mathbf{x} \leq b_{1}, \dots, \mathbf{a}_{m}^\top\mathbf{x} \leq b_{m} \}$. 
	3. Using the matrix $A=[\mathbf{a}_{1}\ \cdots \ \mathbf{a}_{m}]^\top$ and vector $\mathbf{b}=[b_{1}\ \cdots\ b_{m}]^\top$, this gives $P=\{ \mathbf{x} \in \mathbb{R}^n \mid A\mathbf{x} \leq \mathbf{b} \}$.
- Any non-empty polyhedron $P \subseteq \mathbb{R}^n$ can be rewritten into a polyhedron $P' \subseteq \mathbb{R}^p$ constrained using only non-negative variables.
	- Rewrite: For every variable $x_{i} \in \mathbb{R}$, introduce two non-negative variables $x_{i}^+, x_{i}^- \geq 0$, and substitute $x_{i}=x_{i}^+ - x_{i}^-$ in every constraint.
	- Note: $P'$ and $P$ are not the same polyhedron, rather, $P$ is a projection of $P'$ under the linear map $\pi(\mathbf{x}^+, \mathbf{x}^-) = \mathbf{x}^+ - \mathbf{x}^-$. Multiple points in $P'$ may map to the same point in $P$.
- Any non-empty polyhedron $P \subseteq \mathbb{R}^n$ can be rewritten into a polyhedron $P' \subseteq \mathbb{R}^p$ defined entirely by equality constraints.
	- Rewrite: For every constraint $\mathbf{a}_{i}\mathbf{x}\leq b_{i}$, introduce a non-negative slack variable $s_{i}\geq 0$ and replace the constraint with $\mathbf{a}_{i}\mathbf{x}+ s_{i} = b_{i}$.
	- Note: $P'$ and $P$ are not the same polyhedron, however the mapping between them is strictly one-to-one. 
- Every polyhedron is a convex set.
- The point $x$ is called an **extreme point** (or **vertex**) of a set $S$ if $x\in S$ and there are no two distinct points $x_{1},x_{2}\in S$ such that $x=\lambda x_{1}+(1-\lambda)x_{2}$ for some $\lambda\in(0,1)$.
- Suppose we have some polyhedron $P=\{ \mathbf{x}\in\mathbb{R}^n \mid A\mathbf{x}\leq \mathbf{b} \}$ for some $A\in\mathbb{R}^{m\times n}$ and $\mathbf{b}\in\mathbb{R}^m$, and a point $\mathbf{x}\in P$. Then $\mathbf{x}$ is an extreme point of $P$ if and only if at least $n$ linearly independent rows of $A$ correspond to active constraints ($A\mathbf{x}=\mathbf{b}$) at $\mathbf{x}$.
	- Intuition: each active constraint defines a hyperplane, $n$ linearly independent rows are needed to pin down the intersection of these hyperplanes to a single point in $\mathbb{R}^n$.
	- If $m<n$, $P$ cannot have any extreme points.
	- If $P$ is instead written as $\{ \mathbf{x}\in\mathbb{R}^n \mid A\mathbf{x}\leq \mathbf{b}, \mathbf{x}\geq \mathbf{0} \}$, the non-negativity constraints are counted as rows of the inequality too, giving $m+n$ rows in total.
	- For $A\in \mathbb{R}^{m\times n}$, $P=\{ \mathbf{x}\in\mathbb{R}^n \mid A\mathbf{x}=\mathbf{b}, \mathbf{x}\geq \mathbf{0} \}$, every extreme point of $P$ has at least $n-\text{rank}(A)$ zero elements.
		- If $A$ has one slack variable added per original constraint, then $m<n$ and the $m$ rows of $A$ are independent, thus every extreme point has at least $n - m$ zero elements.
- For any polyhedron, the set of extreme points is finite.
	- In the worst case, a polyhedron with $m$ constraints in $\mathbb{R}^n$ has $\binom{m}{n}$ extreme points.

### Directions and Convex Cones

- A **ray** (or **half-line**) is a set of the form $\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{x}=\mathbf{x}_{0}+\mu \mathbf{d},\ \mu\geq 0 \}$ for a point $\mathbf{x}_{0}\in \mathbb{R}^n$ and a nonzero direction $\mathbf{d}\in \mathbb{R}^n$.
- A vector $\mathbf{d}\in\mathbb{R}^n$ is called a **direction** of a set $S$ if $\mathbf{d}\neq \mathbf{0}$ and for every point $\mathbf{x}_{0}\in S$ the ray $\{ \mathbf{x} \in \mathbb{R}^n \mid \mathbf{x}=\mathbf{x}_{0}+\mu \mathbf{d},\ \mu\geq 0 \}$ is contained in $S$.
	- For a convex set $S$, the set of directions of $S$ is empty if and only if $S$ is bounded.
	- If $\mathbf{d}$ is a direction of $S$ then so is $\lambda \mathbf{d}$ for $\lambda>0$.
- For the polyhedron $P=\{ \mathbf{x}\in\mathbb{R}^n \mid A\mathbf{x}\leq \mathbf{b}, \mathbf{x}\geq \mathbf{0} \}$, the vector $\mathbf{d}\in\mathbb{R}^n$ is a direction of $P$ if and only if $\mathbf{d}\neq \mathbf{0}$, $A\mathbf{d}\leq \mathbf{0}$ and $\mathbf{d}\geq \mathbf{0}$.
	- _Proof ($\Rightarrow$)_: if $\mathbf{d}$ is a direction, $\mathbf{d}\neq \mathbf{0}$ by definition. Then $A(\mathbf{x}_{0}+\mu\mathbf{d})\leq \mathbf{b}$ for all $\mu\geq 0$ forces $A\mathbf{d}\leq \mathbf{0}$, and $\mathbf{x}_{0}+\mu\mathbf{d}\geq \mathbf{0}$ for all $\mu\geq 0$ forces $\mathbf{d}\geq \mathbf{0}$.
	- _Proof ($\Leftarrow$)_: if the three properties hold, then for any $\mathbf{x}_{0}\in P$ and $\mu\geq 0$, $A(\mathbf{x}_{0}+\mu\mathbf{d})=A\mathbf{x}_{0}+\mu A\mathbf{d}\leq \mathbf{b}$ and $\mathbf{x}_{0}+\mu\mathbf{d}\geq \mathbf{0}$, so the ray lies in $P$ and $\mathbf{d}$ is a direction.
- The **recession cone** of a set $S$, denoted $\text{rec}(S)$, is the set of all directions of $S$ together with the zero vector. For $P=\{ \mathbf{x}\in\mathbb{R}^n \mid A\mathbf{x}\leq \mathbf{b}, \mathbf{x}\geq \mathbf{0} \}$ this gives $\text{rec}(P)=\{ \mathbf{d}\in\mathbb{R}^n \mid A\mathbf{d}\leq \mathbf{0}, \mathbf{d}\geq \mathbf{0} \}$.
- A direction $\mathbf{d}$ of $P$ is called an **extreme direction** if there are no two directions $\mathbf{d}_{1},\mathbf{d}_{2}$ of $P$ (with $\mu_{1}\mathbf{d}_{1}\neq \mathbf{d}$ and $\mu_{2}\mathbf{d}_{2}\neq \mathbf{d}$ for all $\mu_{1},\mu_{2}\geq 0$) for which there exist $\lambda_{1},\lambda_{2}>0$ such that $\mathbf{d}=\lambda_{1}\mathbf{d}_{1}+\lambda_{2}\mathbf{d}_{2}$.
	- The ray $\{ \mathbf{x}\in\mathbb{R}^n \mid \mathbf{x}=\mathbf{x}_{0}+\mu\mathbf{d},\ \mu\geq 0 \}$, where $\mathbf{x}_{0}\in P$ is an extreme point and $\mathbf{d}$ is a corresponding extreme direction of $P$, is called an **extreme ray**.
- To ease notation, only normalized directions are considered from here on, i.e. those $\mathbf{d}$ with $\mathbf{e}^\top \mathbf{d}=1$. A normalized direction $\mathbf{d}^*$ of $P$ is an extreme direction if and only if $\mathbf{d}^*$ is an extreme point of the polyhedron $P'=\text{rec}(P)\cap \{ \mathbf{d}\in\mathbb{R}^n \mid \mathbf{e}^\top \mathbf{d}=1 \} = \{ \mathbf{d}\in\mathbb{R}^n \mid A\mathbf{d}\leq \mathbf{0}, \mathbf{d}\geq \mathbf{0}, \mathbf{e}^\top\mathbf{d}=1 \}$.
	- _Proof_: (both directions, by contradiction) if $\mathbf{d}^*$ is an extreme direction of $P$ but not an extreme point of $P'$, it can be written as a convex combination of two other points of $P'$, which are themselves directions of $P$, contradicting extremality of $\mathbf{d}^*$. Conversely if $\mathbf{d}^*$ is an extreme point of $P'$ but not an extreme direction of $P$, it can be written as $\lambda_{1}\mathbf{d}_{1}+\lambda_{2}\mathbf{d}_{2}$ for directions $\mathbf{d}_{1},\mathbf{d}_{2}$ of $P$ and $\lambda_{1},\lambda_{2}>0$. Normalizing $\mathbf{d}_{1},\mathbf{d}_{2}$ and using $\mathbf{e}^\top\mathbf{d}^*=\lambda_{1}+\lambda_{2}=1$ rewrites $\mathbf{d}^*$ as a convex combination of two points of $P'$, contradicting extremality of $\mathbf{d}^*$.
- For any non-empty unbounded polyhedron, the collection of (normalized) extreme directions is finite.
	- _Proof_: the polyhedron is non-empty and unbounded, so its set of directions is non-empty. Its extreme directions are the extreme points of the associated polyhedron $P'$ above, and the set of extreme points of any polyhedron is finite.
- A set $C\subseteq \mathbb{R}^n$ is a **convex cone** if it is convex and $\lambda \mathbf{x}\in C$ for all $\mathbf{x}\in C$ and $\lambda\geq 0$.
- The polyhedron $C=\{ \mathbf{x}\in\mathbb{R}^n \mid A\mathbf{x}\leq \mathbf{0}, \mathbf{x}\geq \mathbf{0} \}$ is a convex cone with exactly one extreme point, namely $\mathbf{0}$, and finitely many extreme directions.
- **Representation theorem**: consider a polyhedron $P\subseteq \mathbb{R}^n$ with extreme points $\mathbf{x}_{1},\dots,\mathbf{x}_{k}$ and extreme directions $\mathbf{d}_{1},\dots,\mathbf{d}_{p}$ (count $k$ or $p$ may be zero). Then $P$ can be written as 
	$$
	P=\left\{ \mathbf{x}\in\mathbb{R}^n \;\middle|\; \begin{aligned}
	&\mathbf{x}=\textstyle\sum_{i=1}^{k}\lambda_{i}\mathbf{x}_{i}+\sum_{i=1}^{p}\mu_{i}\mathbf{d}_{i} \\
	&\textstyle\sum_{i=1}^{k}\lambda_{i}=1 \\
	&\lambda_{i}\geq 0 \quad \forall i=1,\dots,k \\
	&\mu_{i}\geq 0 \quad \forall i=1,\dots,p
	\end{aligned} \right\}
	$$
	- If $P$ is bounded it has no extreme directions, so every point reduces to a plain convex combination of the extreme points: $\mathbf{x}=\sum_{i=1}^{k}\lambda_{i}\mathbf{x}_{i}$ with $\sum_{i}\lambda_{i}=1$ and $\lambda_{i}\geq 0$.

