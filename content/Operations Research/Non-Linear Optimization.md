The following are my notes for the course FEB22006X Non-linear Optimization 2025/2026 at Erasmus School of Economics. 

### Basic Topology

- An **open ball** centered at a point $x \in \mathbb{R}^n$ with a radius $r > 0$, denoted $B_r(x)$, is the set of all points whose distance from $x$ is strictly less than $r$. Formally: $B_r(x) = \{y \in \mathbb{R}^n \mid \|y - x\| < r\}$.
- A set $X \subseteq \mathbb{R}^n$ is **open** if for every point $x \in X$, there exists a radius $r > 0$ such that the open ball $B_r(x) \subseteq X$.
- A set $X \subseteq \mathbb{R}^n$ is **closed** if its complement, $\mathbb{R}^n \setminus X$, is an open set.
- The **interior** of a set $X$, denoted $\text{int}(X)$, is the largest open set contained within $X$.
- A set $X \subseteq \mathbb{R}^n$ is **bounded** if it can be contained within a ball of finite radius. Formally, there exists a real number $M > 0$ such that $\|x\| < M$ for all $x \in X$. A set $X \subseteq \mathbb{R}^n$ is **unbounded** if it is not bounded.
- A set $X \subseteq \mathbb{R}^n$ is **compact** if and only if it is both closed and bounded.
- A set $X \subseteq \mathbb{R}^n$ is **convex** if for every $x, y \in X$ and $t \in [0,1]$, we have $tx + (1-t)y \in X$.

### Basic Linear Algebra

This document relies on basic knowledge of linear algebra. For a full list of relevant calculation rules and definitions see [[5. Matrix Calculation Rules Cheatsheet]].

### Basic Optimization

- The notions of **(global and local) minimizer** and **maximizer**, **minimum** and **maximum**, and **infimum** and **supremum** carry over unchanged from the univariate case (see [[1. Univariate Calculus]]): for $f:X \rightarrow \mathbb{R}$ with $X \subseteq \mathbb{R}^n$ we only replace the interval condition $|x - x^*| < \epsilon$ with the open ball $\|x - x^*\| < \epsilon$ (i.e. $x \in B_\epsilon(x^*)$). We phrase everything below in terms of minimization; the maximization case follows by negating $f$.
- The **gradient** $\nabla f(x^*)$ (the vector of first-order partials) and the **Hessian** $\nabla^2 f(x^*)$ (the matrix of second-order partials, symmetric when those partials are continuous) are defined as in [[4. Multivariate Calculus]].
- Any point $x^*$ where $\nabla f(x^*) = 0$ is called a **stationary point**.
- **Fermat's Theorem**: Let $x^*$ be a local minimizer of a function $f:\mathbb{R}^n \rightarrow \mathbb{R}$, and assume $f$ is continuously differentiable in an open set $S$ containing $x^*$. Then $\nabla f(x^*) = 0$.
- Let $X \subseteq \mathbb{R}^n$ be a convex set. A function $f:X \rightarrow \mathbb{R}$ is:
	- **convex** if for every $x, y \in X$ and $t \in [0,1]$, we have $f(tx + (1-t)y) \le tf(x) + (1-t)f(y)$. 
	- **strictly convex** if for every $x, y \in X$ such that $x \ne y$ and $t \in (0,1)$, we have $f(tx + (1-t)y) < tf(x) + (1-t)f(y)$. 
	- **(strictly) concave** if $-f$ is (strictly) convex.
- Let $X \subseteq \mathbb{R}^n$ be an open convex set, and let $f:X \rightarrow \mathbb{R}$ be twice continuously differentiable on $X$. Then,
	- $f$ is convex **if and only if** its Hessian $\nabla^2 f(x) \succeq 0$ for all $x \in X$. 
	- $f$ is strictly convex **if** its Hessian $\nabla^2 f(x) \succ$ for all $x \in X$.
- **Convex Fermat Theorem**: Let $f:\mathbb{R}^n \rightarrow \mathbb{R}$ be a continuously differentiable, convex function. Then, $x^* \in \mathbb{R}^n$ is a global minimizer of $f$ if and only if $\nabla f(x^*) = 0$. If $f$ is strictly convex, then $x^*$ is the unique global minimizer of $f$ if and only if $\nabla f(x^*) = 0$.
- Let $f:\mathbb{R}^n \rightarrow \mathbb{R}$ be twice continuously differentiable in an open set $S$:
	- **Second-Order Necessary Condition**: Let $x^* \in S$ be a local minimizer of a function $f:\mathbb{R}^n \rightarrow \mathbb{R}$, then $\nabla^2 f(x^*) \succeq 0$.
	- **Second-Order Sufficient Condition:** Suppose there is an $x^* \in S$ with $\nabla f(x^*) = 0$ and $\nabla^2 f(x^*) \succ 0$, then, $x^*$ is a local minimizer of $f$.
- **Weierstrass' Theorem:** Let $X \subset \mathbb{R}^n$ be a compact (closed and bounded) non-empty set, and let $f:X \rightarrow \mathbb{R}$ be a continuous function. Then $f$ has a global minimizer (and, by the same argument, a global maximizer). This is the $\mathbb{R}^n$ generalization of the Extreme Value Theorem from [[1. Univariate Calculus]].

Roadmap for finding unconstrained global minimizers analytically:
1. Find $\mathbf{x}^*$ such that $\nabla f (\mathbf{x}^*)=\mathbf{0}$.
2. Is $f$ convex?
	1. Yes? Any stationary $\mathbf{x}^*$ is a global minimizer.
	2. No? continue
3. Determine the best local minimizer(s).
4. Is there any case-specific argument why this minimizer is the global minimizer?
	- Yes? Done.
	- No? Use Weierstrass'.

### Line Search

- **Line search** is an iterative method to approximate a stationary point of a continuously differentiable function. The general update rule is $x_{k+1} \leftarrow x_k + \alpha_k p_k$. This requires addressing two main questions: 
	- How do we choose a search direction $p_k$? 
	- How do we choose a step length $\alpha_k$?. 
- Let $x$ be a point where $\nabla f(x) \ne 0$. Any direction $p$ such that $\nabla f(x)^\top p < 0$ is called a **descent direction**. The direction of **steepest descent** is $p=-\nabla f(x)$. Proof:
	1. The function value after taking $\alpha$ steps in direction $p$ is $\phi(\alpha) = f(x + \alpha p)$
	2. The rate of change at $x$ along direction $p$ is equal to $\phi'(0) = \nabla f(x)^\top p$.
	3. We determine a lower bound using the Cauchy-Schwarz inequality. For any $p$, $\nabla f(x)^\top p \ge -||\nabla f(x)|| \cdot ||p||$.
	4. The choice $p = -\nabla f(x)$ attains this exact lower bound, making $-\nabla f(x)$ the steepest descent direction.
- **Gradient Descent** methods are line search algorithms that choose the direction of steepest descent at every iteration:
    $$
    x_{k+1} = x_k - \alpha_k \nabla f(x_k)
    $$
- Gradient descent tends to overshoot the minimizer in some directions, creating a zigzagging path. Polyak's **heavy-ball method** solves this by recycling information from earlier iterations by adding momentum. The formula is:
	$$
	\begin{aligned}
	y_k &= x_k + \beta_k(x_k - x_{k-1}) \\
	x_{k+1} &= y_k - \alpha_k \nabla f(x_k)
	\end{aligned}
	$$
	where $\alpha_{k}$ and $\beta_k$ are positive constants.
- Nesterov's **accelerated gradient descent** modifies the heavy-ball method by calculating the gradient at the forecasted point $y_k$ rather than the current point $x_k$. The formula is:
	$$
	\begin{aligned}
	y_k &= x_k + \beta_k(x_k - x_{k-1}) \\
	x_{k+1} &= y_k - \alpha_k \nabla f(y_k)
	\end{aligned}
	$$
	where $\alpha_{k}$ and $\beta_k$ are positive constants.

### Convergence Analysis

- The analysis of these numerical methods often depends heavily on Taylor's theorem.
- **Taylor's Theorem**: Let $f:\mathbb{R}^n \rightarrow \mathbb{R}$ be twice continuously differentiable, and let $x, p \in \mathbb{R}^n$. Then, there exists a $t \in (0,1)$ such that:
	$$
	f(x+p) = f(x) + \nabla f(x)^\top p + \frac{1}{2}p^\top \nabla^2 f(x+tp)p
	$$
- If the eigenvalues of the Hessian of $f$ are bounded between $\mu$ and $L$ everywhere, then we can establish the following bounds:
	$$
	\begin{aligned}
	f(x+p) &\ge f(x) + \nabla f(x)^\top p + \frac{1}{2}\mu||p||^2 \\
	f(x+p) &\le f(x) + \nabla f(x)^\top p + \frac{1}{2}L||p||^2
	\end{aligned}
	$$
- If $\mu > 0$, we can define the **condition number** as $\kappa = L/\mu$. Functions with a large $\kappa$ are considered ill-conditioned, meaning they are hard to minimize numerically.
- In every iteration, we want the gap $f(x_k) - f(x^*)$ to decrease. Using Taylor's theorem, and the condition number, we may deduce that in the worst case, the gap decreases by a factor of:
	- $1 - \frac{4}{\kappa(1+1/\kappa)^2} \approx 1 - 4/\kappa$ for standard gradient descent.
	- $1 - 1/\sqrt{\kappa}$ for accelerated gradient descent.

### Stochastic Gradient Descent

- We often maximize the log-likelihood or minimize the negative log-likelihood for some $m$ observations. The problem is that the gradient of this function consists of $m$ terms (representing all observations) added together, which may be computationally large and expensive to calculate.
- **Stochastic gradient methods** address this by computing the gradient over a random subset of the data rather than the full dataset. To minimize $f(x) = \frac{1}{m}\sum_{j=1}^m f_j(x)$, stochastic gradient methods compute the iterate:

	$$
	x_{k+1} = x_k - \alpha_k \frac{1}{|\mathcal{B}_k|} \sum_{j \in \mathcal{B}_k} \nabla f_j(x_k)
	$$

	for a random subset $\mathcal{B}_k \subseteq \{1,...,m\}$.
	- If $|\mathcal{B}_k|= 1$, it is strictly **stochastic gradient descent**.
	- If $|\mathcal{B}_k|< m$, it is **mini-batch gradient descent**.
	- If $|\mathcal{B}_k| = m$, it is standard (batch) **gradient descent**.
- In standard gradient descent, the gradient naturally approaches zero as you reach the minimum, causing the algorithm to smoothly stop. Because of the mini-batches this is not the case for stochastic gradient methods. Even at the exact minimum, the stochastic gradient will not be perfectly zero. For a fixed step size, the algorithm will reach the minimum but bounce around it endlessly. To ensure convergence, the step size $\alpha_{k}$ must decay over time.
- For convergence analysis, which mathematically guarantees that the distance to the true minimizer eventually shrinks to exactly zero, the diminishing step length $\alpha_k > 0$ must satisfy two strict conditions:
	1. $\sum_{k=1}^\infty \alpha_k = \infty$: The sum of all step sizes must diverge. This guarantees the algorithm can travel infinitely far, ensuring it wont stop before reaching the minimum.
	2. $\sum_{k=1}^\infty \alpha_k^2 < \infty$: The sum of the squared step sizes must converge to a finite number. Because SGD estimates the gradient using a random sub-sample, this introduces variance (estimation error) at every step. Requiring this sum to be finite forces the fluctuations to shrink to zero so the algorithm can perfectly settle on the exact minimum.
- These two conditions create a delicate tradeoff. The step length must decay slow enough to still allow for fast convergence to the minimizer, but it must decay fast enough to successfully damp the noise once the iterates get close to that minimizer.
	- A common step size schedule is the $p$-sequence: $\alpha_k = c/k^p$ for constant $c$. This adheres to both constraints if $0.5 <p \leq 1$.
	- A specific example is $\alpha_k = 10^{-4}/k^{0.51}$.
- Note: In applied machine learning practice, these strict conditions are often violated. There are specifically important for mathematical analysis.

### Adaptive Moment Estimation

Exponentially weighted moving average (EWMA):

- The standard recursive definition for any new data point $y_t$ at time $t > 0$, with smoothing factor $0 \lt \rho \lt 1$ is: $S_0 = 0$, $S_t = (\rho) S_{t-1} + (1-\rho)y_t$.
- The initialization with $S_0 = 0$ creates a bias that pulls the average toward zero. The sum of weights applied to the data points $y_1, y_2, \dots, y_t$ is $1-\rho^t$, making it an improper weighted average.
- Bias correction normalizes the weights by $1-\rho^t$, correcting the bias $\hat{S}_t = S_t / (1-\rho^t)$. Since $\rho^t \to 0$ for increasing $t$, the correction becomes less significant with iterations.
- Note: Alternatively, you can set $S_0 = y_1$, bypassing the bias but this gives $y_1$ a “special” weight that doesn't fit the same pattern as other $y_i$ values.

Adaptive Moment Estimation (Adam):

TODO: explain the following more formally
- (explain we update heavy ball (sometimes called momentum) to use EWMA, this reduces the issue of changing directions)
- (we still have the scale issue, a single step size would mean some dimensions change too quickly, whereas others barely change, so we need normalization, this is done by normalizing by the root of the square, also using EWMA )
- (these options combined form adam)
- (provide the intuition for the resulting behaviour, with the signal to noise normalization, with noisy directions being explored less)
- (Table to compare the resulting formulas between standard SGD and adam)


### Newtons Method

- (untuition for the model function)
- (newtons model function)
- (we want to pick p for which model is minimal, provide the system of linear eq to solve to find pk)
- (state issues: (1) requires the matrix to be pos def, (2) not doable for high dimensions )

### Quasi-Newton Methods

- (idea: instead of determining the hessian in full, instead we use some other matrix B that behaves similarly and can be constructed using only gradient evaluations)
- (restate the relevant taylor theorem)
- (derive the secant equation)
- (state that QN methods frequently pick a B that satisfies the secant equation, and is symmetric, then state infinitely many of such B's exist)
- (explain BFGS)

### Bisection Method

- (explain intuition)
- (explain algorithm)
- (add note that this is essentially binary search)

### Rates of Convergence

- (definition of linear convergence)
- (note that gradient descent methods generally converge linearly)
- (definition of superlinear convergence)
- (note that quasi-newton methods generally converge superlinearly)
- (definition of quadratic convergence)
- (note that newtons method generally converges quadratically)

### Derivative Free Optimization

For some functions, it is not (always) possible to compute the derivative. Reasons include:
- The function is non-differentiable.
- The function is the result of an external program, experiment or simulation, and thus no derivative exist.
- The derivatives are too expensive to compute

Subdifferentials

- (define subgradient)
- (define subdifferential)
- (given some point for which zero in the subdifferential then if f is convex, point is global minimizer, if f is strictly convex, then the point is the unique global minimizer)
- (state: you can compute subdifferentials of more complex convex functions using the subdifferentials for simpler convex functions, then provide the rules for combining functions one by one)

Coordinate Descent

- (idea: we want to perform line search, but the search direction cannot be determined using the gradient, instead we use the basis vectors)
- (strategy: in what order do we determine the search directions? examples: cyclic, back and forth, others. Add note that some strategies converge to local minimizer, some can iterate endlessly)

Golden Section Method

- (explain golden section method)

Nelder-Mead Simplex Method

- (explain the full algorithm, ensure intuition is clear)

### KKT Conditions

Suppose we have a constrained optimization problem formulated as follows:
$$
\begin{align}
\inf f(\mathbf{x}) & \\
\text{subject to } c_{i}(\mathbf{x})&=0 \quad \forall i \in \mathcal{E} \\
c_{i}(\mathbf{x})&\geq 0\quad \forall i  \in \mathcal{I}
\end{align}
$$
where:
- $f$ is the objective function
- $c_{i}$ are the constraints
- $f$ and $c_{i}$ are assumed to be (twice) continuously differentiable
- $\mathcal{E}$ is the index set of the equality constraints
- $\mathcal{I}$ is the index set of the inequality constraints 

In unconstrained optimization, a point $x$ is a local minimizer if there is no direction $s$ that decreases the objective function. With constraints, this condition must be updated to: a point $x$ is a local minimizer if there is no **feasible** descent direction $s$.

1. Suppose we are at a feasible point $x$, we want to find a small step $s$ such that the objective function decreases, while ensuring all constraints remain satisfied. If $x$ is a local minimizer, then no such step $s$ exists.
2. Using a first-order Taylor approximation, we know $g(x+s) \approx g(x) + \nabla g(x)^\top s$ for any function $g$.
3. Decreasing objective function means $f(x+s) < f(x)$, therefore $\nabla f(x)^\top s<0$.
4. For all equality constraints ($i \in \mathcal{E}$), we must remain on the boundary, that is $c_{i}(x+s)=0$. Since $c_{i}(x)=0$, we must walk tangent to the constraint, that is $\nabla c_{i}(x)^\top s=0$.
5. For all inactive inequality constraints ($i \in \mathcal{I}$ where $c_{i}(x)>0$), we are strictly inside the boundary. Therefore any sufficiently small step $s$ in any direction will not violate the constraint. This $\nabla c_{i}(x)^\top s$ can be anything.
6. For all active inequality constraints ($i \in \mathcal{I}$ where $c_{i} = 0$), we are on the edge of the inequality boundary. To stay inside the feasible region $c_{i}(x+s)\geq 0$ we must walk either tangent to the boundary or point inward, that is $\nabla c_{i}(x)^\top s \geq 0$.
7. For $x$ to be a local minimizer, there must be no $s$ such that all of the above conditions 3-6 hold simultaneously. Notice that the constraints on $s$ are all linear. We want to show this region is empty.
8. One such way it to rewrite the search for the steepest descent direction $s$ that satisfies all constraints as a linear programming (LP) problem. 
	$$
	\begin{align} \min_{s} \quad & \nabla f(x)^\top s \\ \text{subject to} \quad & \nabla c_{i}(x)^\top s = 0 \quad \forall i \in \mathcal{E} \\ & \nabla c_{j}(x)^\top s \geq 0 \quad \forall j \in \mathcal{I}_{active} \end{align}
	$$
9. Trivially, $s=0$ is a feasible solution ($x$ was feasible, thus $x + s =x$ is also feasible). However, $\nabla f(x)^\top s=0$, thus $s$ is not a valid descent direction. To show no feasible descent condition exists for $x$, we must show $s=0$ is an optimal solution of the LP problem. 
10. We know from [[Linear Optimisation]] that a solution $s$ is optimal if it is both primal feasible and dual feasible, we already know $s=0$ is primal feasibly, so we only need to show it is also dual feasible. Rewriting the conditions for dual feasibility (not shown here), we get the **stationarity condition**: 
	$$
	\nabla f(x) = \sum_{i \in \mathcal{E}} \lambda_i \nabla c_i(x) + \sum_{i \in \mathcal{I}_{active}} \lambda_i \nabla c_i(x)
	$$
	Where the constants (called **Lagrange multipliers**) $\lambda_{i}$ capture how each constraint restricts movement:
	- For equality constraints $\lambda_{i} \in \mathbb{R}$ because equality constraints restrict movement in both directions.
	- For active inequality constraints $\lambda_{i} \geq 0$ because they only restrict movement in one direction.
11. To write this linear combination elegantly without needing to manually separate active and inactive linear inequalities, we introduce the **complementary slackness condition**: $\lambda_{i}c_{i}(x)=0$ for all $i \in \mathcal{I}$. This rule guarantees that if an inequality is inactive ($c_{i}(x) > 0$), then its multiplier must be zero ($\lambda_{i}=0$), effectively removing its contribution from the sum.
12. Combing all of this, we get the full Karush-Kuhn-Tucker (KKT) conditions. Assuming some constraint qualifications hold, if $x^*$ is a local minimizer, there exists some Lagrange multipliers $\lambda^*$ such that each of the following conditions hold:
	1. **Stationarity**: $\nabla f(x^*)=\sum_{i \in \mathcal{E \cup \mathcal{I}}}\lambda_{i}^* \nabla c_{i}(x^*)$
	2. **Primal Feasibility**: 
		- $c_{i}(x^*)=0\quad \forall i \in \mathcal{E}$
		- $c_{i}(x^*) \geq 0 \quad \forall i \in \mathcal{I}$
	- **Dual Feasibility**: $\lambda_{i}^*\geq 0\quad \forall i \in \mathcal{I}$
	- **Complementary Slackness**: $\lambda_{i}^*c_{i}(x^*)=0 \quad \forall i \in \mathcal{I}$.

(todo: add note that this relies on some assumptions that are not guaranteed to be true (explain exactly which steps dont always work), then provide a brief example where it does not hold)

### Constraint Qualification

(todo: explain slaters condition, and explain how it guarantees that the KKT )

(todo: explain the linear independence constraint qualification, and explain how it guarantees )

### Second Order Conditions

(todo: write the second order conditions here)

### Perturbing Constraints

(todo: explain perturbing a constraint formally, then explain we want to answer how this impacts the optimal objective value. Then show how this relates to the Lagrange multipliers  )