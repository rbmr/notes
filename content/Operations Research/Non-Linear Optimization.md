The following are my notes for the course FEB22006X Non-linear Optimization 2025/2026 at Erasmus School of Economics. 

### Basic Optimization

This document builds on:

- The topology of $\mathbb{R}^n$ (open balls; open, closed, bounded, and compact sets) and the theory of extreme values, both from [[4. Multivariate Calculus]]. In particular, we freely use the notions of **(global and local) minimizer** and **maximizer**, **infimum** and **supremum**, the **gradient** $\nabla f$ and the **Hessian** $\nabla^2 f$, **stationary points** ($\nabla f(x^*) = 0$), **Fermat's Theorem**, the **Second-Order Necessary and Sufficient Conditions**, **Taylor's Theorem**, and the **Extreme Value Theorem** — which this course calls **Weierstrass' Theorem**: a continuous function on a non-empty compact set has a global minimizer (and maximizer).
- Basic linear algebra, in particular positive (semi)definiteness ($\succeq$, $\succ$) and eigenvalues. For a full list of relevant calculation rules and definitions see [[5. Matrix Calculation Rules Cheatsheet]].
- Duality theory from [[Linear Optimisation]], which is used to derive the KKT conditions.

We phrase everything below in terms of minimization; the maximization case follows by negating $f$.

### Convexity

Convexity is the property that makes optimization problems globally tractable: it removes the gap between local and global minimizers.

- A set $X \subseteq \mathbb{R}^n$ is **convex** if for every $x, y \in X$ and $t \in [0,1]$, we have $tx + (1-t)y \in X$. Intuitively: the line segment between any two points of the set lies entirely within the set.
- Let $X \subseteq \mathbb{R}^n$ be a convex set. A function $f:X \rightarrow \mathbb{R}$ is:
	- **convex** if for every $x, y \in X$ and $t \in [0,1]$, we have $f(tx + (1-t)y) \le tf(x) + (1-t)f(y)$. 
	- **strictly convex** if for every $x, y \in X$ such that $x \ne y$ and $t \in (0,1)$, we have $f(tx + (1-t)y) < tf(x) + (1-t)f(y)$. 
	- **(strictly) concave** if $-f$ is (strictly) convex.
	- Intuitively: a function is convex if the chord between any two points on its graph lies on or above the graph.
- Convexity can be verified with the Hessian. Let $X \subseteq \mathbb{R}^n$ be an open convex set, and let $f:X \rightarrow \mathbb{R}$ be twice continuously differentiable on $X$. Then,
	- $f$ is convex **if and only if** its Hessian $\nabla^2 f(x) \succeq 0$ for all $x \in X$. 
	- $f$ is strictly convex **if** its Hessian $\nabla^2 f(x) \succ 0$ for all $x \in X$. (Only "if": e.g. $f(x)=x^4$ is strictly convex, yet $f''(0) = 0$.)
	- This generalizes the univariate characterization: a function in one variable is convex if and only if its second derivative is non-negative everywhere.
- **Convex Fermat Theorem**: Let $f:\mathbb{R}^n \rightarrow \mathbb{R}$ be a continuously differentiable, convex function. Then, $x^* \in \mathbb{R}^n$ is a global minimizer of $f$ if and only if $\nabla f(x^*) = 0$. If $f$ is strictly convex, then $x^*$ is the unique global minimizer of $f$ if and only if $\nabla f(x^*) = 0$.
	- Contrast this with the plain Fermat's theorem: stationarity is normally only *necessary* for *local* minimizers; under convexity it becomes an exact characterization of *global* minimizers.

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

Often, stationary points cannot be determined in closed form. Then we resort to numerical methods.

- **Line search** is an iterative method to approximate a stationary point of a continuously differentiable function. The general update rule is $x_{k+1} \leftarrow x_k + \alpha_k p_k$. This requires addressing two main questions: 
	- How do we choose a search direction $p_k$? Options covered below: (stochastic) gradient descent, the heavy-ball method, accelerated gradient descent, Adam, Newton's method, and BFGS.
	- How do we choose a step length $\alpha_k$? Options covered below: fixed, decaying, and the bisection method.
- The algorithm can be terminated when, for instance, $\|\nabla f(x_k)\|$ is small, the iterates stop changing much, or an iteration limit is reached.
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
	where $\alpha_{k}$ and $\beta_k$ are positive constants. For convex functions, its theoretical convergence rate is the best among all methods using only gradient information (up to a constant).

### Convergence Analysis

- The analysis of these numerical methods often depends heavily on **Taylor's Theorem** (see [[4. Multivariate Calculus#Taylor's Theorem]]): for a twice continuously differentiable $f: \mathbb{R}^n \rightarrow \mathbb{R}$ and any $x, p \in \mathbb{R}^n$, there exists a $t \in (0,1)$ such that:
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
	These follow because a symmetric matrix $A$ with all eigenvalues in $[\mu, L]$ satisfies $\mu\|p\|^2 \le p^\top A p \le L\|p\|^2$; apply this to the Hessian in Taylor's theorem.
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
	1. $\sum_{k=1}^\infty \alpha_k = \infty$: The sum of all step sizes must diverge. This guarantees the algorithm can travel infinitely far, ensuring it won't stop before reaching the minimum.
	2. $\sum_{k=1}^\infty \alpha_k^2 < \infty$: The sum of the squared step sizes must converge to a finite number. Because SGD estimates the gradient using a random sub-sample, this introduces variance (estimation error) at every step. Requiring this sum to be finite forces the fluctuations to shrink to zero so the algorithm can perfectly settle on the exact minimum.
- These two conditions create a delicate tradeoff. The step length must decay slow enough to still allow for fast convergence to the minimizer, but it must decay fast enough to successfully damp the noise once the iterates get close to that minimizer.
	- A common step size schedule is the $p$-sequence (see [[3. Series#p-series]]): $\alpha_k = c/k^p$ for constant $c$. This adheres to both constraints if $0.5 <p \leq 1$.
	- A specific example is $\alpha_k = 10^{-4}/k^{0.51}$.
- Note: In applied machine learning practice, these strict conditions are often violated. They are specifically important for mathematical analysis.

### Adaptive Moment Estimation

Exponentially weighted moving average (EWMA):

- The standard recursive definition for any new data point $y_t$ at time $t > 0$, with smoothing factor $0 \lt \rho \lt 1$ is: $S_0 = 0$, $S_t = (\rho) S_{t-1} + (1-\rho)y_t$.
- The initialization with $S_0 = 0$ creates a bias that pulls the average toward zero. The sum of weights applied to the data points $y_1, y_2, \dots, y_t$ is $1-\rho^t$, making it an improper weighted average.
- Bias correction normalizes the weights by $1-\rho^t$, correcting the bias $\hat{S}_t = S_t / (1-\rho^t)$. Since $\rho^t \to 0$ for increasing $t$, the correction becomes less significant with iterations.
- Note: Alternatively, you can set $S_0 = y_1$, bypassing the bias but this gives $y_1$ a "special" weight that doesn't fit the same pattern as other $y_i$ values.

Adam addresses two separate weaknesses of stochastic gradient descent, one per "moment":

- **Noisy directions (first moment)**: the mini-batch gradient $g_k = \frac{1}{|\mathcal{B}_k|}\sum_{j \in \mathcal{B}_k}\nabla f_j(x_k)$ is a noisy estimate of the true gradient: every mini-batch pulls in a somewhat different direction. Instead of stepping along $g_k$ directly, we maintain an EWMA of all stochastic gradients seen so far, called the **first moment estimate**:
	$$
	m_k = \beta_1 m_{k-1} + (1-\beta_1)\,g_k
	$$
	This plays the same role as the momentum term of the heavy-ball method: gradient components that are consistent across iterations accumulate, while components that keep flipping sign (mini-batch noise, zigzagging) average out.
- **Mismatched scales (second moment)**: a single step size $\alpha$ applies to every coordinate. If the function is much steeper in some coordinates than in others (an ill-conditioned problem), any single $\alpha$ is simultaneously too large for the steep coordinates (overshooting) and too small for the flat ones (barely moving). The solution is to normalize each coordinate by the typical magnitude of its gradient. This magnitude is estimated with an EWMA of the element-wise squared gradients, the **second moment estimate**:
	$$
	v_k = \beta_2 v_{k-1} + (1-\beta_2)\, g_k \circ g_k
	$$
	(where $\circ$ denotes the element-wise product), and the step in coordinate $i$ is divided by $\sqrt{(v_k)_i}$.
- Both EWMAs are initialized at $m_0 = v_0 = 0$ and are therefore biased toward zero; as described above, this is repaired with the bias corrections $\hat{m}_k = m_k / (1-\beta_1^k)$ and $\hat{v}_k = v_k / (1-\beta_2^k)$.

**Adaptive moment estimation (Adam)** combines both ideas. Every iteration $k = 1, 2, \dots$:
1. Select a mini-batch $\mathcal{B}_k$ and compute the mini-batch gradient $g_k$.
2. Update the moment estimates $m_k$ and $v_k$, and bias-correct them into $\hat{m}_k$ and $\hat{v}_k$.
3. Update every coordinate $i$:
	$$
	(x_{k+1})_i = (x_k)_i - \alpha\, \frac{(\hat{m}_k)_i}{\sqrt{(\hat{v}_k)_i} + \epsilon}
	$$
	where the small constant $\epsilon > 0$ prevents division by zero.

Good default values are $\alpha = 0.001$, $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$, and $|\mathcal{B}_k| = 128$.

Intuition for the resulting behaviour:

- The update ratio approximates a **signal-to-noise ratio**: $(\hat{m}_k)_i \approx \mathbb{E}[g_i]$ estimates the signal, while $\sqrt{(\hat{v}_k)_i} \approx \sqrt{\mathbb{E}[g_i^2]}$ measures the overall magnitude. Since $\mathbb{E}[g_i^2] = \mathbb{E}[g_i]^2 + \text{Var}(g_i)$, the ratio is close to $\pm 1$ for coordinates whose gradient is consistent (informative directions), and close to $0$ for coordinates dominated by variance (noisy directions). Adam therefore automatically takes (near-)full steps in reliable directions, and explores noisy directions less.
- Consequently, in most cases every element of the Adam step lies between $-\alpha$ and $\alpha$: the step size acts as a hard cap on the movement per coordinate, rather than as a multiplier on an unbounded gradient.

|                  | Stochastic gradient descent                          | Adam                                                                                 |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Search direction | current mini-batch gradient $g_k$                    | bias-corrected EWMA $\hat{m}_k$ of all mini-batch gradients                          |
| Step size        | single decaying $\alpha_k$, shared by all coordinates | per-coordinate $\frac{\alpha}{\sqrt{(\hat{v}_k)_i} + \epsilon}$, adapts to noise     |
| Update           | $x_{k+1} = x_k - \alpha_k g_k$                       | $(x_{k+1})_i = (x_k)_i - \alpha \frac{(\hat{m}_k)_i}{\sqrt{(\hat{v}_k)_i}+\epsilon}$ |

### Newton's Method

- All line search methods so far choose their direction using only first-order (gradient) information. Newton's method also uses second-order (Hessian) information, which lets it choose a direction and step length simultaneously.
- The idea: at the current iterate $x_k$, replace $f$ by a **model function** $m_k(p) \approx f(x_k + p)$ that is simple enough to minimize exactly over all steps $p$. Then step to the minimizer of the model, and repeat. The second-order Taylor approximation (see [[4. Multivariate Calculus#Taylor's Theorem]]) provides exactly such a model:
	$$
	m_k(p) = f(x_k) + \nabla f(x_k)^\top p + \frac{1}{2}p^\top \nabla^2 f(x_k)\, p
	$$
- Suppose $\nabla^2 f(x_k) \succ 0$. Then $m_k$ is a strictly convex quadratic function of $p$, so by the Convex Fermat theorem its unique global minimizer is its stationary point: $\nabla m_k(p_k) = \nabla f(x_k) + \nabla^2 f(x_k)p_k = 0$. The step $p_k$ is therefore found by solving the system of linear equations:
	$$
	\nabla^2 f(x_k)\, p_k = -\nabla f(x_k)
	$$
- **Newton's method** repeats this: solve the system above for $p_k$, update $x_{k+1} = x_k + p_k$, increment $k$. Note that no separate step length is needed ($\alpha_k = 1$): the model's minimizer already encodes how far to go.
- When $\nabla^2 f(x_k) \succ 0$, the Newton direction is a descent direction: $\nabla f(x_k)^\top p_k = -\nabla f(x_k)^\top [\nabla^2 f(x_k)]^{-1}\nabla f(x_k) < 0$, because the inverse of a positive definite matrix is itself positive definite.
- Newton's method has two important issues:
	1. If $\nabla^2 f(x_k)$ is not positive definite, the linear system may not have a (unique) solution, and even when it does, the solution need not be a descent direction (the stationary point of a non-convex model can be a maximizer or saddle point of that model).
	2. In high dimensions, computing the Hessian ($n^2$ second-order derivatives) and solving an $n \times n$ linear system in every iteration may be computationally infeasible.

### Quasi-Newton Methods

- Idea: instead of determining the Hessian in full, mimic Newton's method with some other matrix $B_k$ that behaves similarly to the Hessian but can be constructed using only gradient evaluations. The search direction then solves $B_k p_k = -\nabla f(x_k)$.
- What should "behaves similarly to the Hessian" mean? Taylor's theorem in gradient form (see [[4. Multivariate Calculus#Taylor's Theorem]]) states:
	$$
	\nabla f(x+p) = \nabla f(x) + \int_0^1 \nabla^2 f(x+tp)\,p \; dt
	$$
- Take $x = x_{k-1}$ and $p = x_k - x_{k-1}$ (the step we just took), and approximate the Hessian inside the integral by the fixed matrix $\nabla^2 f(x_k)$:
	$$
	\nabla f(x_k) - \nabla f(x_{k-1}) \approx \nabla^2 f(x_k)\,[x_k - x_{k-1}]
	$$
	In words: the Hessian (approximately) maps the most recent step to the observed change in the gradient — and both of those vectors are known from gradient evaluations alone. Abbreviate them as $s_{k-1} = x_k - x_{k-1}$ and $y_{k-1} = \nabla f(x_k) - \nabla f(x_{k-1})$.
- We require $B_k$ to reproduce this relation exactly. This is the **secant equation**:
	$$
	B_k s_{k-1} = y_{k-1}, \quad\text{or equivalently}\quad B_k^{-1} y_{k-1} = s_{k-1}
	$$
- Quasi-Newton methods frequently pick a $B_k$ that satisfies the secant equation and is symmetric (as the true Hessian is, by Clairaut's theorem). This does not pin $B_k$ down: the secant equation imposes $n$ equations, while a symmetric matrix has $n(n+1)/2$ free entries, so for $n > 1$ infinitely many such matrices exist.
- The **Broyden-Fletcher-Goldfarb-Shanno (BFGS)** method resolves this ambiguity with a natural principle: do not throw away what was already learned — choose the matrix closest to the previous approximation. Formally, $B_k^{-1}$ solves:
	$$
	\begin{align}
	\inf_{B^{-1}} \quad & \|B^{-1} - B_{k-1}^{-1}\|_W \\
	\text{subject to} \quad & B^{-1} = (B^{-1})^\top \\
	& B^{-1}y_{k-1} = s_{k-1}
	\end{align}
	$$
	where $\|A\|_W^2 = \text{tr}(WA^\top WA)$ for some weighting matrix $W \succ 0$ satisfying $Ws_{k-1} = y_{k-1}$. This problem has the closed-form solution:
	$$
	B_k^{-1} = \left(I - \frac{s_{k-1}y_{k-1}^\top}{y_{k-1}^\top s_{k-1}}\right)B_{k-1}^{-1}\left(I - \frac{y_{k-1}s_{k-1}^\top}{y_{k-1}^\top s_{k-1}}\right) + \frac{s_{k-1}s_{k-1}^\top}{y_{k-1}^\top s_{k-1}}
	$$
- Note that BFGS tracks the *inverse* $B_k^{-1}$ directly, so computing the search direction $p_k = -B_k^{-1}\nabla f(x_k)$ is a cheap matrix-vector product. No Hessian is ever formed and no linear system is ever solved, addressing both issues of Newton's method.

### Bisection Method

- So far the step length $\alpha_k$ was fixed or decayed on a schedule. Alternatively, we can *search* for a good step length. Recall that the function value along the search ray is $\phi(\alpha) = f(x_k + \alpha p_k)$, with derivative $\phi'(\alpha) = \nabla f(x_k + \alpha p_k)^\top p_k$: choosing the step length is itself a one-dimensional minimization problem.
- Since $p_k$ is a descent direction, $\phi'(0) < 0$. Suppose we also know some $U > 0$ with $\phi'(U) > 0$. Then $\phi$ decreases at $0$ and increases at $U$, so a local minimizer (a stationary point of $\phi$) must lie in $[0, U]$: since $\phi'$ is continuous, this follows from the Intermediate Value Theorem (see [[1. Univariate Calculus]]).
- The **bisection method** maintains an interval $[L, U]$ with $\phi'(L) < 0$ and $\phi'(U) > 0$, and repeatedly halves it, keeping the half that still brackets a stationary point:
	1. Pick a tolerance $\delta > 0$ and initialize $[L, U]$ as above.
	2. While $U - L > \delta$, compute the midpoint $M = \frac{1}{2}(L + U)$:
		- If $\phi'(M) < 0$: a stationary point lies in $[M, U]$; set $L \leftarrow M$.
		- If $\phi'(M) > 0$: a stationary point lies in $[L, M]$; set $U \leftarrow M$.
		- If $\phi'(M) = 0$: $M$ is a stationary point; set $L \leftarrow M$ and $U \leftarrow M$.
	3. Return the midpoint $\frac{1}{2}(L+U)$.
- Note: this is essentially binary search on the sign of $\phi'$. The interval width halves every iteration (at the cost of one derivative evaluation), so the bracket width converges to zero with rate $\frac{1}{2}$.

### Rates of Convergence

We now have a whole family of methods. One way to compare them is by how fast their iterates approach a minimizer $x^*$ once they get close.

- A sequence $\{x_k\}$ that converges to $x^*$ converges **linearly** if there exists an $r \in (0,1)$ such that, for all sufficiently large $k$:
	$$
	\frac{\|x_{k+1}-x^*\|}{\|x_k - x^*\|} \le r
	$$
	The error shrinks by at least a constant factor per iteration; roughly a constant number of correct digits is gained per iteration. Example: $1 + (\frac{1}{2})^k$ converges linearly to $1$.
	- Gradient descent methods generally converge linearly. This matches the Convergence Analysis section, where the gap shrinks by a factor of roughly $1 - 4/\kappa$ per iteration.
- A sequence converges **superlinearly** if:
	$$
	\lim_{k \to \infty}\frac{\|x_{k+1}-x^*\|}{\|x_k-x^*\|} = 0
	$$
	The per-iteration shrink factor itself keeps improving. Example: $1 + (\frac{1}{k})^k$ converges superlinearly to $1$.
	- Quasi-Newton methods generally converge superlinearly.
- A sequence converges **quadratically** if there exists an $M > 0$ such that, for all sufficiently large $k$:
	$$
	\frac{\|x_{k+1}-x^*\|}{\|x_k-x^*\|^2} \le M
	$$
	The error is essentially squared every iteration; the number of correct digits roughly doubles per iteration. Example: $(\frac{1}{2})^{2^k}$ converges quadratically to $0$.
	- Newton's method generally converges quadratically.
- Each rate implies the previous one: quadratic convergence implies superlinear convergence, which implies linear convergence. Note how the rates line up with the cost per iteration: gradient evaluations only (linear), gradient evaluations plus a matrix update (superlinear), Hessian evaluation plus a linear system solve (quadratic).

### Derivative Free Optimization

For some functions, it is not (always) possible to compute the derivative. Reasons include:
- The function is non-differentiable.
- The function is the result of an external program, experiment or simulation, and thus no derivative exist.
- The derivatives are too expensive to compute

This section covers an analytical tool (subdifferentials), derivative-free line search (coordinate descent for the search direction, the golden section method for the step length), and a direct search method (Nelder-Mead).

Subdifferentials

- Fermat-type theorems need a gradient. For convex functions that are not differentiable everywhere (e.g. $f(x) = |x|$), the gradient generalizes to a *set* of admissible slopes.
- Let $X \subseteq \mathbb{R}^n$, and let $f: X \to \mathbb{R}$ be a convex function. A vector $r \in \mathbb{R}^n$ is a **subgradient** of $f$ at $x \in X$ if:
	$$
	f(y) \ge f(x) + r^\top (y - x) \quad \forall y \in X
	$$
	Geometrically: $r$ is the slope of an affine function that touches the graph of $f$ at $x$ and lies below the graph everywhere else — for a differentiable convex function, the tangent plane does exactly this.
- The set of all subgradients of $f$ at $x$ is called the **subdifferential**, denoted $\partial f(x)$.
- If $f$ is differentiable at $x$, then $\partial f(x) = \{\nabla f(x)\}$: the tangent plane is the only affine lower bound touching the graph at $x$.
- Example: $f(y) = |y|$ at $x = 0$: $r$ is a subgradient if and only if $|y| \geq ry$ for all $y \in \mathbb{R}$, which holds exactly for $r \in [-1, 1]$. Hence $\partial f(0) = [-1,1]$: every line through the origin with slope between $-1$ and $1$ stays below the V-shape.
- **Convex Fermat Theorem (subgradient version)**: Let $f: \mathbb{R}^n \to \mathbb{R}$ be a convex function, and let $x^* \in \mathbb{R}^n$. Then $x^*$ is a global minimizer of $f$ if and only if $0 \in \partial f(x^*)$. If moreover $f$ is strictly convex, then $x^*$ is the unique global minimizer of $f$ if and only if $0 \in \partial f(x^*)$.
	- One direction is immediate: plugging $r = 0$ into the subgradient inequality gives $f(y) \geq f(x^*)$ for all $y$, which *is* the definition of a global minimizer.
	- This extends the roadmap for finding global minimizers analytically: for convex but non-differentiable $f$, replace "find a stationary point" by "find $x^*$ with $0 \in \partial f(x^*)$".
- Subdifferentials of complicated convex functions can be computed using the subdifferentials of simpler convex functions. Let $f: X \to \mathbb{R}$ and $g: X \to \mathbb{R}$ be convex functions and $x \in X$:
	- **Norm**: if $f(x) = \|x\|$, then $\partial f(0) = \{r \in \mathbb{R}^n : \|r\| \leq 1\}$ (the unit ball); at any $x \neq 0$ the norm is differentiable.
	- **Non-negative scaling**: $\partial(\alpha f)(x) = \alpha\,\partial f(x) := \{\alpha r : r \in \partial f(x)\}$ for all $\alpha \geq 0$.
	- **Sum**: $\partial(f+g)(x) = \partial f(x) + \partial g(x) := \{r + s : r \in \partial f(x), s \in \partial g(x)\}$. This "sum of sets" (every combination of one element from each set) is called the **Minkowski sum**.
	- **Maximum**: $\partial(\max\{f,g\})(x)$ equals $\partial f(x)$ where $f(x) > g(x)$, equals $\partial g(x)$ where $g(x) > f(x)$, and equals $\text{conv}(\partial f(x) \cup \partial g(x))$ at the kink where $f(x) = g(x)$.
		- The **convex hull** $\text{conv}(S)$ is the smallest convex set containing $S$; equivalently, the set of all convex combinations (see [[Linear Optimisation#Vertices]]) of points in $S$.

Coordinate Descent

- We would like to perform line search, but without derivatives the search direction cannot be determined from the gradient. Instead, use directions that are known in advance: the standard basis vectors $e_1, \dots, e_n$. Every iteration picks a direction $p_k$ from $\{e_1,\dots,e_n\}$ and searches for a good next iterate along the line $\{x_k + \alpha p_k : \alpha \in \mathbb{R}\}$ — i.e. it optimizes one coordinate at a time, freezing all others.
- In what order should the coordinate directions be searched? Example strategies:
	- **Cyclic**: $e_1, e_2, \dots, e_n, e_1, e_2, \dots$
	- **Back-and-forth**: $e_1, e_2, \dots, e_{n-1}, e_n, e_{n-1}, \dots, e_2, e_1, e_2, \dots$
	- Enriched strategies, such as: at the end of each cycle, additionally search along the net progress direction of that cycle, $x_k - x_{k-n}$.
- Some strategies provably converge to a local minimizer, while others can iterate endlessly.

Golden Section Method

- The bisection method selects a step length using the derivative $\phi'$; the **golden section method** achieves the same using only function values. It approximates a local minimizer of any continuous function $\phi: \mathbb{R} \to \mathbb{R}$.
- Bracketing without derivatives: suppose we know three points $L < M < U$ with $\phi(M) < \phi(L)$ and $\phi(M) < \phi(U)$. Then $[L, U]$ contains a local minimizer of $\phi$: by Weierstrass' theorem, $\phi$ has a global minimizer over the compact interval $[L,U]$; that minimizer beats $\phi(M)$, so it cannot sit at the endpoints $L$ or $U$; and a minimizer over $[L,U]$ in the interior is a local minimizer of $\phi$.
- Shrinking the bracket: evaluate $\phi$ at a test point $T$ inside the larger of the two subintervals — say $M < T < U$ (the case $L < T < M$ is its mirror image). Whichever way the comparison goes, a smaller bracketing triple remains:
	- If $\phi(T) > \phi(M)$: the triple $(L, M, T)$ brackets a local minimizer; set $U \leftarrow T$.
	- If $\phi(T) \le \phi(M)$: the triple $(M, T, U)$ brackets a local minimizer; set $L \leftarrow M$, then $M \leftarrow T$.
	- Note that each iteration needs only *one* new function evaluation: the old interior point is reused, either as the new interior point or as a new endpoint.
- Where should $T$ be placed? Label the three segment widths $a = M - L$, $b = T - M$, $c = U - T$. Two natural requirements determine the placement uniquely:
	1. The width of the next interval should not depend on the outcome of the comparison: $a + b = b + c$, hence $a = c$.
	2. The relative spacing should look identical in the next iteration (so the same rule applies forever): the ratio of the longer to the shorter segment around the interior point must be preserved, $\frac{a}{b} = \frac{b+c}{a}$.
	
	Substituting $c = a$ into the second requirement and writing $\rho = a/b$ gives $\rho = \frac{1}{\rho} + 1$, i.e. $\rho^2 = \rho + 1$. The positive solution is the **golden section**:
	$$
	\varphi = \frac{1}{2} + \frac{1}{2}\sqrt{5} \approx 1.618
	$$
- The full algorithm: pick a tolerance $\epsilon > 0$ and initialize $L < M < U$ such that $(M-L)/(U-M) \in \{\varphi, 1/\varphi\}$. While $U - L > \epsilon$:
	1. Place the test point in the longer subinterval: if $U - M > M - L$, set $T \leftarrow L + (U-L)/\varphi$; otherwise set $T \leftarrow L + (U-L)(1 - 1/\varphi)$.
	2. If $\phi(T) > \phi(M)$: shrink away from $T$'s side (set $U \leftarrow T$ if $T > M$, or $L \leftarrow T$ if $T < M$).
	3. If $\phi(T) \le \phi(M)$: $T$ becomes the new interior point; discard the segment on the far side of $M$ (if $T > M$: set $L \leftarrow M$, $M \leftarrow T$; if $T < M$: set $U \leftarrow M$, $M \leftarrow T$).
	
	Once $U - L \le \epsilon$, return $M$.
- In every iteration the interval width shrinks by the factor $1/\varphi \approx 0.618$, so the bracket width converges linearly to zero — slightly slower than bisection's factor $0.5$, which is the price of not using derivatives.

Nelder-Mead Simplex Method

- All line search methods move a single point along a single direction per iteration. The **Nelder-Mead simplex method** instead maintains a cloud of $n+1$ points and moves the entire cloud downhill. It often works reasonably in practice, though its convergence theory is rather limited.
- A **simplex** is the convex hull of $n+1$ points $x_1, \dots, x_{n+1} \in \mathbb{R}^n$ such that the differences $x_2 - x_1, \dots, x_{n+1} - x_1$ are linearly independent (the points genuinely span all $n$ dimensions): a triangle in $\mathbb{R}^2$, a tetrahedron in $\mathbb{R}^3$.
- At the start of every iteration, relabel the points from best to worst: $f(x_1) \le f(x_2) \le \dots \le f(x_{n+1})$. The iteration then tries to replace the worst point $x_{n+1}$ with a better one. All candidate replacements lie on the line through $x_{n+1}$ and the **centroid** of the $n$ best points:
	$$
	\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
	$$
	Moving away from the worst point, through the middle of the better ones, is the simplex's stand-in for a descent direction. The candidates:
	- The **reflection** $r = \bar{x} + (\bar{x} - x_{n+1})$: the worst point mirrored through the centroid.
	- The **expansion** $e = \bar{x} + 2(\bar{x} - x_{n+1})$: twice as far out.
	- The **outside contraction** $c_1 = \bar{x} + \frac{1}{2}(\bar{x} - x_{n+1})$ and **inside contraction** $c_2 = \bar{x} + \frac{1}{2}(x_{n+1} - \bar{x})$: halfway towards the reflection, and halfway back towards the worst point, respectively.
- The iteration logic, driven by how good the reflection turns out to be:
	1. Compute $r$. If $f(x_1) \le f(r) < f(x_n)$, the reflection is neither the best nor among the worst of the new simplex: accept it (replace $x_{n+1}$ by $r$) and start the next iteration.
	2. If $f(r) < f(x_1)$, the reflection beats every current point, so the direction is promising — probe further: compute the expansion $e$, and replace $x_{n+1}$ by the better of $r$ and $e$.
	3. If $f(r) \ge f(x_n)$, the reflection is still worse than the $n$ best points, so the simplex likely stepped over the valley — try a more conservative candidate:
		- If $f(r) < f(x_{n+1})$: compute the outside contraction $c_1$; if $f(c_1) < f(r)$, replace $x_{n+1}$ by $c_1$.
		- If $f(r) \ge f(x_{n+1})$ (the reflection is even worse than the point it was meant to replace): compute the inside contraction $c_2$; if $f(c_2) < f(x_{n+1})$, replace $x_{n+1}$ by $c_2$.
	4. **Shrinking**: if no replacement was made, the simplex is apparently too large to capture the local landscape in any probed direction; shrink it towards the best point by replacing every $x_i$ by $\frac{1}{2}(x_i + x_1)$.
- Intuition for the resulting behaviour: the simplex crawls downhill, stretching out (expansions) while a direction keeps paying off, and contracting/shrinking once it surrounds a minimizer, so that the cloud collapses onto it.

### Constrained Optimization

We formally define a **constrained optimization problem** as follows:
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

Additional remarks:
- Consistent with [[Linear Optimisation]], a feasible point $\mathbf{x}$ is often called a **solution**, a global minimizer an **optimal solution**, and a local minimizer a **locally optimal solution**.
- The problem is stated with $\inf$ rather than $\min$ because a minimizer need not exist; when one does exist, the infimum is attained and equals the minimum.

### Lagrangian Function

The **Lagrangian function** of a constrained optimization problem folds the constraints into the objective, attaching to each constraint a variable price $\lambda_i$, called its **Lagrange multiplier**:
$$
\mathcal{L}(\mathbf{x}, \boldsymbol{\lambda})=f(\mathbf{x})-\sum_{i\in\mathcal{E}\cup \mathcal{I}}\lambda_{i}c_{i}(\mathbf{x})
$$

The central property of the Lagrangian: maximizing it over the multipliers (with $\lambda_i \geq 0$ for the inequality constraints) recovers the original constrained problem. For any $\mathbf{x} \in \mathbb{R}^n$:
$$
\sup_{\substack{\lambda_{i} \in \mathbb{R},\ i \in \mathcal{E} \\ \lambda_{i} \geq 0,\ i \in \mathcal{I}}}\mathcal{L}(\mathbf{x},\boldsymbol{\lambda})=\begin{cases}
f(\mathbf{x})&\text{if } \mathbf{x} \text{ is feasible} \\ 
\infty&\text{otherwise}
\end{cases}
$$
- If $\mathbf{x}$ is feasible: every equality term contributes $\lambda_i \cdot 0 = 0$, and every inequality term satisfies $c_i(\mathbf{x}) \geq 0$ and $\lambda_i \geq 0$, so $-\lambda_i c_i(\mathbf{x}) \le 0$ is maximized by choosing $\lambda_i = 0$. The supremum is $f(\mathbf{x})$.
- If $\mathbf{x}$ is infeasible: some constraint is violated, and scaling up its multiplier (with the appropriate sign for a violated equality; towards $+\infty$ for a violated inequality, where $c_i(\mathbf{x}) < 0$) drives $\mathcal{L} \to \infty$.

Consequently, the constrained problem can be rewritten as an unconstrained min-max problem:
$$
\inf_{\mathbf{x}}\, \{f(\mathbf{x}) : \mathbf{x} \text{ feasible}\} \;=\; \inf_{\mathbf{x}}\ \sup_{\substack{\lambda_{i} \in \mathbb{R},\ i \in \mathcal{E} \\ \lambda_{i} \geq 0,\ i \in \mathcal{I}}} \mathcal{L}(\mathbf{x},\boldsymbol{\lambda})
$$
The inner supremum acts as an infinitely harsh penalty: infeasible points are ruled out by their infinite objective value rather than by explicit constraints. This reformulation is the seed for duality and for the augmented Lagrangian method, both covered below.

### KKT Conditions

We define a **descent direction** as a direction $s$ for a point $x$, such that the directional derivative is strictly negative $\nabla f(x)^\top s< 0$. In unconstrained optimization, a point $x$ is a local minimizer if there is no such descent direction. In constrained optimization, a point is a local minimizer if there is no **feasible** descent direction $s$.

Suppose we are at a feasible point $x$, a feasible descent direction is a direction $s$ such that the objective function decreases, while ensuring all constraints remain satisfied. Using a first-order Taylor approximation, we know $g(x+s) \approx g(x) + \nabla g(x)^\top s$ for any function $g$. This gives us the following four conditions on $s$:

1. Decreasing objective function means $f(x+s) < f(x)$, therefore $\nabla f(x)^\top s<0$.
2. For all equality constraints ($i \in \mathcal{E}$), we must remain on the boundary, that is $c_{i}(x+s)=0$. Since $c_{i}(x)=0$, we must walk tangent to the constraint, that is $\nabla c_{i}(x)^\top s=0$.
3. For all inactive inequality constraints ($i \in \mathcal{I}$ where $c_{i}(x)>0$), we are strictly inside the boundary. Therefore any sufficiently small step $s$ in any direction will not violate the constraint. This $\nabla c_{i}(x)^\top s$ can be anything.
4. For all active inequality constraints ($i \in \mathcal{I}$ where $c_{i} = 0$), we are on the edge of the inequality boundary. To stay inside the feasible region $c_{i}(x+s)\geq 0$ we must walk either tangent to the boundary or point inward, that is $\nabla c_{i}(x)^\top s \geq 0$.

For $x$ to be a local minimizer, there must be no $s$ such that each of the aforementioned conditions hold simultaneously. 
1. We can write the search for the steepest descent direction $s$ that satisfies all constraints as a linear programming (LP) problem. 
	$$
	\begin{align} \min_{s} \quad & \nabla f(x)^\top s \\ \text{subject to} \quad & \nabla c_{i}(x)^\top s = 0 \quad \forall i \in \mathcal{E} \\ & \nabla c_{j}(x)^\top s \geq 0 \quad \forall j \in \mathcal{I}_{active} \end{align}
	$$
2. Trivially, $s=0$ is a feasible solution ($x$ was feasible, thus $x + s =x$ is also feasible). However, $\nabla f(x)^\top s=0$, thus $s$ is not a valid descent direction. To show no feasible descent condition exists for $x$, we must show $s=0$ is an optimal solution of the LP problem. 
3. We know from [[Linear Optimisation]] that a solution $s$ is optimal if it is both primal feasible and dual feasible, we already know $s=0$ is primal feasibly, so we only need to show it is also dual feasible. Rewriting the conditions for dual feasibility (not shown here), we get the **stationarity conditions**: 
	$$
	\nabla f(x) = \sum_{i \in \mathcal{E}} \lambda_i \nabla c_i(x) + \sum_{i \in \mathcal{I}_{active}} \lambda_i \nabla c_i(x)
	$$
	Where the Lagrange multipliers $\lambda_{i}$ capture how each constraint restricts movement:
	- For equality constraints $\lambda_{i} \in \mathbb{R}$ because equality constraints restrict movement in both directions.
	- For active inequality constraints $\lambda_{i} \geq 0$ because they only restrict movement in one direction.
4. To write this linear combination elegantly without needing to manually separate active and inactive linear inequalities, we introduce the **complementary slackness condition**: $\lambda_{i}c_{i}(x)=0$ for all $i \in \mathcal{I}$. This rule guarantees that if an inequality is inactive ($c_{i}(x) > 0$), then its multiplier must be zero ($\lambda_{i}=0$), effectively removing its contribution from the sum.
5. Combining all of this, we get the full **Karush-Kuhn-Tucker (KKT) conditions**. Assuming some constraint qualification holds (see the Constraint Qualification section), if $x^*$ is a local minimizer, there exist some Lagrange multipliers $\lambda^*$ such that each of the following conditions hold:
	1. **Stationarity**: $\nabla f(x^*)=\sum_{i \in \mathcal{E \cup \mathcal{I}}}\lambda_{i}^* \nabla c_{i}(x^*)$
	2. **Primal Feasibility**: 
		- $c_{i}(x^*)=0\quad \forall i \in \mathcal{E}$
		- $c_{i}(x^*) \geq 0 \quad \forall i \in \mathcal{I}$
	3. **Dual Feasibility**: $\lambda_{i}^*\geq 0\quad \forall i \in \mathcal{I}$
	4. **Complementary Slackness**: $\lambda_{i}^*c_{i}(x^*)=0 \quad \forall i \in \mathcal{I}$.

A pair $(x^*, \lambda^*)$ satisfying all four conditions is called a **KKT point**. The stationarity condition states exactly that $x^*$ is a stationary point of the Lagrangian in $x$: $\nabla_x \mathcal{L}(x^*, \lambda^*) = \nabla f(x^*) - \sum_i \lambda_i^* \nabla c_i(x^*) = 0$. For this reason it is also called **Lagrangian stationarity**. Note how it generalizes Fermat's theorem: without constraints it reduces to $\nabla f(x^*) = 0$.

The KKT conditions are not automatically necessary — the derivation contains a leap of faith:

- We used first-order Taylor approximations to decide which steps $s$ preserve feasibility. This implicitly assumes that the linearized constraints faithfully describe the feasible region near $x$: that we can actually move (approximately) along any direction the linearization allows.
- Counterexample: consider $\inf\{x : c_1(x) = x^2 = 0\}$, i.e. $f(x) = x$. The only feasible point is $x^* = 0$, which is therefore the optimal solution. But stationarity would demand $1 = f'(x^*) = \lambda_1 c_1'(x^*) = \lambda_1 \cdot 2x^* = 0$, which no multiplier $\lambda_1$ can satisfy: the minimizer is not a KKT point.
	- What broke: the linearization $c_1(x^* + s) \approx c_1(x^*) + c_1'(x^*)\,s = 0$ claims *every* direction $s$ preserves feasibility to first order, while in reality *no* direction does (the feasible region is the single point $\{0\}$).
- Assumptions that rule out such degenerate constraint geometry are called **constraint qualifications**, covered after the next section.

### Alternative Intuition for Stationarity

The stationarity condition may be alternatively derived as follows:

1. First we simplify by interpreting each equality constraint as two inequality constraints ($c_{i}(x) \geq 0$ and $-c_{i}(x) \geq 0$), such that only inequalities remain.
2. Suppose we are at a feasible point $x$. Any step $s$ we take can be evaluated by its dot product with the gradient vectors of the constraints $\nabla c_{i}(x)$ or objective $\nabla f(x)$. 
	- Feasibility requires $\nabla c_{i}(x)^\top s\geq 0$ for all active inequality constraints.
	- Non-descent requires $\nabla f(x)^\top s \geq 0$.
3. For $x$ to be a local minimizer, every feasible step $s$, must also be a non-descent step. Geometrically, this means the entire feasible cone (the intersection of all the half spaces defined by the active constraints), must fit completely inside the non-descent half space.
4. This containment holds **if and only if** $\nabla f(x)$ is a non-negative combination of the active constraint gradients: $\nabla f(x) = \sum_{i} \lambda_i \nabla c_i(x)$ with all $\lambda_i \geq 0$ — which is exactly the stationarity condition (with dual feasibility).
	- ($\Leftarrow$) If $\nabla f(x) = \sum_i \lambda_i \nabla c_i(x)$ with $\lambda_i \geq 0$, then any feasible step $s$ satisfies $\nabla f(x)^\top s = \sum_i \lambda_i\, \nabla c_i(x)^\top s \geq 0$, as a sum of products of non-negative numbers. So every feasible step is a non-descent step.
	- ($\Rightarrow$) This direction is **Farkas' Lemma**: for any vectors $g, a_1, \dots, a_m \in \mathbb{R}^n$, exactly one of the following holds: either $g = \sum_i \lambda_i a_i$ for some $\lambda \geq 0$, or there exists an $s$ with $a_i^\top s \geq 0$ for all $i$ and $g^\top s < 0$. Geometrically: the non-negative combinations of the $a_i$ form a convex cone; any vector outside this cone can be separated from it by a hyperplane, and the normal vector $s$ of that separating hyperplane is precisely a step that is feasible (to first order) yet descending. Applied with $g = \nabla f(x)$ and the $a_i$ the active constraint gradients: if $\nabla f(x)$ lies outside the cone, a feasible descent direction exists, so $x$ is not a local minimizer.
5. Finally, we recover the equality-constrained case: an equality constraint $c_{i}(x) = 0$ was split into the two always-active inequalities $c_{i}(x) \geq 0$ and $-c_{i}(x) \geq 0$, with multipliers $\lambda_{i}^+, \lambda_{i}^- \geq 0$. Their joint contribution to the combination is $\lambda_{i}^+\nabla c_{i}(x) - \lambda_{i}^-\nabla c_{i}(x) = (\lambda_{i}^+ - \lambda_{i}^-)\nabla c_{i}(x)$, and since $\lambda_{i}^+ - \lambda_{i}^-$ can take any real value, this is equivalent to a single free multiplier $\lambda_{i} \in \mathbb{R}$ — exactly how the stationarity condition treats equality constraints.

### Constraint Qualification

A **constraint qualification** (CQ) is an assumption on the constraints guaranteeing that their linearization faithfully describes the feasible region near a point. It repairs the KKT theorem: if $x^*$ is a local minimizer *and* a constraint qualification holds, then $x^*$ satisfies the KKT conditions. This course uses two constraint qualifications: Slater's condition (one global check, but only for convex problems) and the LICQ (a check per point, for general problems).

Slater's condition:

- A constrained optimization problem is called **convex** if:
	- the objective $f$ is convex,
	- every equality constraint is affine: $c_{i}(x) = a_{i}^\top x + b_{i}$ for all $i \in \mathcal{E}$, and
	- every inequality constraint function $c_{i}$ for $i \in \mathcal{I}$ is concave.
	- Note the direction: a *concave* $c_i$ makes the region $\{x : c_{i}(x) \geq 0\}$ convex. The feasible region is then an intersection of convex sets (hyperplanes and super-level sets), and is therefore itself convex.
- **Slater's condition** holds if there exists a strictly feasible point: an $\bar{x}$ with $c_{i}(\bar{x}) = 0$ for all $i \in \mathcal{E}$ and $c_{i}(\bar{x}) > 0$ for all $i \in \mathcal{I}$ (every inequality constraint is inactive at $\bar{x}$).
- **Theorem**: for a convex problem satisfying Slater's condition, the KKT conditions are necessary *and sufficient* for global optimality: $x^*$ is an optimal solution if and only if there exist multipliers $\lambda^*$ such that $(x^*, \lambda^*)$ is a KKT point.
	- This is remarkably strong: convexity upgrades the KKT conditions from a necessary condition for local minimizers to an exact characterization of global minimizers.

Linear independence constraint qualification:

- The **linear independence constraint qualification (LICQ)** holds at a feasible point $x^*$ if the set of active constraint gradients
	$$
	\{\nabla c_{i}(x^*) : c_{i}(x^*) = 0,\ i \in \mathcal{E}\cup\mathcal{I}\}
	$$
	is linearly independent.
- **Theorem (Karush-Kuhn-Tucker)**: if $x^*$ is a local minimizer of the constrained problem at which the LICQ holds, then there exist Lagrange multipliers $\lambda^*$ such that the KKT conditions hold at $(x^*, \lambda^*)$.
- Unlike Slater's condition, the LICQ does not require convexity — but it must be verified point by point, and it only yields necessity (a KKT point still need not be a minimizer).
- Revisiting the counterexample $\inf\{x : x^2 = 0\}$: at $x^* = 0$ the constraint is active with gradient $\nabla c_{1}(x^*) = 2x^* = 0$, and a set containing the zero vector is never linearly independent. The LICQ indeed fails, consistent with the absence of multipliers there.

Roadmap for finding constrained global minimizers analytically:
1. Find all KKT points.
2. Is the problem convex, and does Slater's condition hold?
	1. Yes? Any KKT point is an optimal solution. Done.
	2. No? Continue.
3. Additionally find all feasible points at which the LICQ does not hold. These are extra candidates: they may be local minimizers that the KKT conditions miss.
4. Take the best candidate (KKT or non-LICQ point). Argue it is an optimal solution, either via Weierstrass' theorem (if the feasible region is non-empty and compact, a global minimizer exists, and it must be among the candidates), or via a case-specific argument.

### Second Order Conditions

In unconstrained optimization, the second-order conditions distinguish minimizers among stationary points using the Hessian of $f$ (see [[4. Multivariate Calculus#Extreme values]]). The constrained versions differ in two ways: the relevant curvature is that of the *Lagrangian*, and it only needs to be checked along directions that stay on the active constraints.

- Setting: $f$ and all $c_{i}$ twice continuously differentiable, and $(x^*, \lambda^*)$ a KKT point. The Hessian (in $x$) of the Lagrangian is:
	$$
	\nabla^2_{xx}\mathcal{L}(x^*, \lambda^*) = \nabla^2 f(x^*) - \sum_{i \in \mathcal{E}\cup\mathcal{I}}\lambda_{i}^*\nabla^2 c_{i}(x^*)
	$$
- The relevant test directions are the $w \in \mathbb{R}^n$ tangent to all binding constraints:
	$$
	\nabla c_{i}(x^*)^\top w = 0 \quad \text{for all } i \in \mathcal{E}, \text{ and all } i \in \mathcal{I} \text{ with } \lambda_{i}^* > 0
	$$
	Why exactly these: along such $w$, the objective is flat to first order — by stationarity, $\nabla f(x^*)^\top w = \sum_{i}\lambda_{i}^* \nabla c_{i}(x^*)^\top w = 0$ — so the first-order conditions say nothing about them and second-order information must decide. In all other feasible directions, the first-order conditions already force the objective upward.
- **Second-Order Necessary Condition**: if $x^*$ is a local minimizer at which a constraint qualification (Slater or LICQ) holds, and $\lambda^*$ are Lagrange multipliers for which the KKT conditions hold, then:
	$$
	w^\top \left(\nabla^2 f(x^*) - \sum_{i \in \mathcal{E}\cup\mathcal{I}}\lambda_{i}^*\nabla^2 c_{i}(x^*)\right) w \geq 0 \quad \text{for all test directions } w
	$$
- **Second-Order Sufficient Condition**: if $x^*$ is feasible, the KKT conditions hold at $(x^*, \lambda^*)$, and the inequality above is *strict* for all test directions $w \neq 0$, then $x^*$ is a local minimizer. (No constraint qualification is needed for this direction.)
- The unconstrained conditions are the special case without constraints: the Lagrangian reduces to $f$ and every direction is a test direction, recovering $\nabla^2 f(x^*) \succeq 0$ (necessary) and $\succ 0$ (sufficient).
- Why the Hessian of the Lagrangian rather than of $f$? Walking along a *curved* active constraint is not the same as walking along its tangent: the constraint's curvature bends the path in a second-order way, which changes the objective value at second order. The correction term $-\sum_{i}\lambda_{i}^*\nabla^2 c_{i}(x^*)$ accounts exactly for this, weighting each constraint's curvature by how strongly it binds ($\lambda_{i}^*$).

### Perturbing Constraints

The Lagrange multipliers are not just certificates of optimality; they measure how much each constraint costs.

- Formally, we perturb constraint $j$ by $\epsilon \neq 0$: replace $c_{j}(x) = 0$ by $c_{j}(x) = \epsilon$ (or $c_{j}(x) \geq 0$ by $c_{j}(x) \geq \epsilon$). We want to know how the optimal objective value responds. Let $x^*$ be a local minimizer of the original problem with KKT multipliers $\lambda^*$, and let $x^*(\epsilon)$ be the local minimizer after the perturbation. For sufficiently small $\epsilon$, the set of active constraints does not change.
- First-order derivation (each $\approx$ is a first-order Taylor approximation):
	1. Constraint $j$ moves from being active at $0$ to being active at $\epsilon$:
	$$\epsilon = c_{j}(x^*(\epsilon)) - c_{j}(x^*) \approx \nabla c_{j}(x^*)^\top[x^*(\epsilon) - x^*]$$
	2. Every other active constraint $i \neq j$ stays put:
	$$0 = c_{i}(x^*(\epsilon)) - c_{i}(x^*) \approx \nabla c_{i}(x^*)^\top[x^*(\epsilon) - x^*]$$
	3. Combine with stationarity (inactive constraints drop out since $\lambda_{i}^* = 0$ by complementary slackness):
	$$
	f(x^*(\epsilon)) - f(x^*) \approx \nabla f(x^*)^\top[x^*(\epsilon) - x^*] = \sum_{i \in \mathcal{E}\cup\mathcal{I}}\lambda_{i}^*\,\nabla c_{i}(x^*)^\top[x^*(\epsilon) - x^*] = \lambda_{j}^*\,\epsilon
	$$
- Conclusion: $\lambda_{j}^*$ measures the sensitivity of the optimal objective value to changes in the right-hand side of constraint $j$: loosening constraint $j$ by $\epsilon$ changes the optimal value by approximately $\lambda_{j}^*\epsilon$.
- This gives complementary slackness an economic meaning: an inactive inequality constraint has room to spare, so perturbing it slightly changes nothing — its price must be zero.
- This is the non-linear generalization of the shadow price interpretation of the dual variables in [[Linear Optimisation#Shadow Prices]].

### Duality

For linear problems, the dual problem was constructed by combining constraints into bounds on the objective value ([[Linear Optimisation#Duality]]). The Lagrangian generalizes this construction to non-linear problems.

- Fix any multipliers $\lambda$ with $\lambda_{i} \geq 0$ for $i \in \mathcal{I}$ (and $\lambda_{i} \in \mathbb{R}$ free for $i \in \mathcal{E}$). Then for every *feasible* $x$:
	$$
	\mathcal{L}(x,\lambda) = f(x) - \sum_{i}\lambda_{i}c_{i}(x) \leq f(x)
	$$
	since equality terms vanish and inequality terms satisfy $\lambda_{i}c_{i}(x) \geq 0$. Minimizing over *all* $x$ (not just feasible ones) can only go lower, so:
	$$
	q(\lambda) := \inf_{x}\, \mathcal{L}(x,\lambda) \;\leq\; v(P)
	$$
	Every valid $\lambda$ yields a lower bound $q(\lambda)$ on the optimal value $v(P)$ of the primal problem $(P)$.
- The **dual problem** $(D)$ asks for the best (largest) such lower bound:
	$$
	\begin{align}
	\sup_{\lambda}\quad & q(\lambda) = \inf_{x}\,\mathcal{L}(x,\lambda) \\
	\text{subject to}\quad & \lambda_{i} \geq 0 \quad \forall i \in \mathcal{I}
	\end{align}
	$$
	The function $q$ is called the **dual (objective) function**. "Finding the dual" of a problem means working out $q(\lambda)$ in closed form.
- Min-max view: by the sup-property of the Lagrangian, the primal problem is $\inf_{x}\sup_{\lambda}\mathcal{L}(x,\lambda)$; the dual problem is $\sup_{\lambda}\inf_{x}\mathcal{L}(x,\lambda)$ — the same expression with the order of optimization swapped.
- Example: for the primal problem $\inf_{x_1,x_2}\{x_1^2 + x_2^2 : x_1 - 1 \geq 0\}$:
	$$
	q(\lambda_1) = \inf_{x_1, x_2}\left\{x_1^2 + x_2^2 - \lambda_1(x_1 - 1)\right\}
	$$
	The inner problem is convex in $x$; stationarity gives $x_1 = \lambda_1/2$ and $x_2 = 0$, so $q(\lambda_1) = -\frac{1}{4}\lambda_1^2 + \lambda_1$. The dual problem $\sup\{-\frac{1}{4}\lambda_1^2 + \lambda_1 : \lambda_1 \geq 0\}$ has optimal solution $\lambda_1^* = 2$ with value $1$ — which indeed equals the primal optimum $f(1,0) = 1$.

Properties:

- **Weak Duality**: if $x$ is feasible for $(P)$ and $\lambda$ is feasible for $(D)$, then $f(x) \geq q(\lambda)$. (This is the lower-bound argument above; it holds for any problem, convex or not.)
- If $(P)$ is convex, then the dual objective $q$ is concave and its domain $\{\lambda : q(\lambda) > -\infty\}$ is convex. The dual is therefore itself a convex problem (maximizing a concave function over a convex set) — even if the primal is hard, the dual is well-behaved.
	- In fact, $q$ is concave for *any* primal problem: for fixed $x$, $\mathcal{L}(x,\lambda)$ is affine in $\lambda$, and a pointwise infimum of affine functions is concave.
- If $(P)$ is convex with optimal solution $x^*$, and $f$ and the $c_{i}$ are differentiable at $x^*$, then any $\lambda^*$ for which $(x^*, \lambda^*)$ is a KKT point is an optimal solution of $(D)$. Conversely, solving the (often easier) dual problem produces multipliers with which KKT points can be constructed and optimality can be proven.
- **Strong Duality**: suppose $(P)$ is convex. If Slater's condition holds for $(P)$, then $(D)$ has an optimal solution and $v(P) = v(D)$. Symmetrically, if Slater's condition holds for $(D)$, then $(P)$ has an optimal solution and $v(P) = v(D)$.
	- For linear problems this recovers the strong duality theorem of [[Linear Optimisation]].
- Slater's condition matters, even for convex problems. Example: $\inf\{x : -x^2 \geq 0\}$ is convex ($-x^2$ is concave), with feasible region $\{0\}$ and optimal value $0$ — but no strictly feasible point exists. The dual function is:
	$$
	q(\lambda) = \inf_{x}\{x + \lambda x^2\} = \begin{cases}-\infty & \text{if } \lambda = 0 \\ -\frac{1}{4\lambda} & \text{if } \lambda > 0\end{cases}
	$$
	so $v(D) = \sup_{\lambda > 0} -\frac{1}{4\lambda} = 0 = v(P)$: the optimal values coincide, yet the supremum is not attained — the dual problem has no optimal solution.

### Quadratic Penalty

Finding minimizers analytically via the KKT conditions can be a lot of work. The remaining sections cover numerical methods for constrained problems. The common idea: convert the constrained problem into (a sequence of) unconstrained problems, and reuse the unconstrained machinery from the first half of this document.

- Consider an equality-constrained problem $\inf\{f(x) : c_{i}(x) = 0 \ \forall i \in \mathcal{E}\}$. For a penalty parameter $\mu > 0$, define the **quadratic penalty function**:
	$$
	Q(x, \mu) = f(x) + \frac{\mu}{2}\sum_{i \in \mathcal{E}}[c_{i}(x)]^2
	$$
	Constraint violations now cost objective value, at a price controlled by $\mu$, and $Q(\cdot,\mu)$ is a smooth unconstrained function.
- The **quadratic penalty method**:
	1. Initialize $k \leftarrow 1$, $\mu_1 > 0$, and a starting point $x_0 \in \mathbb{R}^n$.
	2. While $x_{k-1}$ is too infeasible:
		1. Find an approximate minimizer $x_k$ of $Q(\cdot, \mu_k)$ using an unconstrained method, warm-starting from $x_{k-1}$.
		2. Select $\mu_{k+1} > \mu_k$, and set $k \leftarrow k+1$.
- For any finite $\mu$, the minimizer of $Q(\cdot,\mu)$ is generally *infeasible*: it profitably trades a small constraint violation for a lower objective value. Feasibility is only approached as $\mu \to \infty$.
- Problem: as $\mu$ grows, $Q(\cdot,\mu)$ becomes increasingly **ill-conditioned** (recall the condition number $\kappa$ from the Convergence Analysis section): the penalty creates enormous curvature across the constraint surface but not along it. The inner unconstrained minimizations therefore become numerically hard exactly when high accuracy is needed most.

### Augmented Lagrangian Method

The augmented Lagrangian method repairs the quadratic penalty method: by additionally maintaining an estimate of the Lagrange multipliers, it can converge to the constrained minimizer *without* sending $\mu \to \infty$.

Derivation. Consider again the equality-constrained problem $\inf\{f(x) : c_{i}(x) = 0 \ \forall i \in \mathcal{E}\}$. By the sup-property of the Lagrangian (restricted to the equality constraints), this problem equals $\inf_{x}\sup_{\lambda}\mathcal{L}(x,\lambda)$. We could try to numerically minimize $g(x) = \sup_{\lambda}\mathcal{L}(x,\lambda)$ directly — but $g$ equals $f$ on the feasible region and $\infty$ everywhere else, so it is not continuous in $x$ and useless for numerical minimization.

The fix: keep a current multiplier estimate $\bar{\lambda} \in \mathbb{R}^{|\mathcal{E}|}$ and a parameter $\mu > 0$, and dampen the inner maximization by penalizing deviations of $\lambda$ from $\bar{\lambda}$:
$$
\mathcal{L}_A(x, \bar{\lambda}, \mu) = \sup_{\lambda}\left\{\mathcal{L}(x,\lambda) - \frac{1}{2\mu}\|\lambda - \bar{\lambda}\|^2\right\}
$$
The inner problem is now a concave quadratic in $\lambda$, solved per coordinate by setting the derivative to zero: $-c_{i}(x) - (\lambda_{i} - \bar{\lambda}_{i})/\mu = 0$, giving the maximizer:
$$
\lambda_{i} = \bar{\lambda}_{i} - \mu\, c_{i}(x)
$$
Substituting the maximizer back in yields a closed form, the **augmented Lagrangian**:
$$
\mathcal{L}_A(x, \bar{\lambda}, \mu) = f(x) - \sum_{i \in \mathcal{E}}\bar{\lambda}_{i}c_{i}(x) + \frac{\mu}{2}\sum_{i \in \mathcal{E}}[c_{i}(x)]^2
$$
This is exactly the Lagrangian (at the fixed estimate $\bar{\lambda}$) *augmented* with the quadratic penalty — equivalently, the quadratic penalty function $Q(x,\mu)$ tilted by the multiplier term. Unlike $\sup_{\lambda}\mathcal{L}$, it is smooth in $x$ and can be minimized numerically.

The **augmented Lagrangian method**:
1. Initialize $k \leftarrow 1$, $\mu_1 > 0$, $x_0 \in \mathbb{R}^n$, and $\lambda_1 \in \mathbb{R}^{|\mathcal{E}|}$.
2. While $x_{k-1}$ is too infeasible:
	1. Find an approximate minimizer $x_k$ of $\mathcal{L}_A(\cdot, \lambda_k, \mu_k)$, warm-starting from $x_{k-1}$.
	2. Update the multiplier estimate using the inner maximizer formula: $(\lambda_{k+1})_{i} = (\lambda_k)_{i} - \mu_k c_{i}(x_k)$ for all $i \in \mathcal{E}$.
	3. Select $\mu_{k+1} \geq \mu_k$ (commonly only increased while the violation $\sum_{i \in \mathcal{E}}[c_{i}(x_k)]^2$ remains large), and set $k \leftarrow k+1$.

Why this fixes the quadratic penalty's problem:

- Intuition: if the multiplier estimate is exactly right ($\bar{\lambda} = \lambda^*$), then the constrained minimizer $x^*$ is already a stationary point of $\mathcal{L}_A(\cdot, \lambda^*, \mu)$ for *any* $\mu$:
	$$
	\nabla_x \mathcal{L}_A(x^*, \lambda^*, \mu) = \underbrace{\nabla f(x^*) - \sum_{i}\lambda^*_{i}\nabla c_{i}(x^*)}_{=\,0 \text{ by KKT stationarity}} + \mu\sum_{i}\underbrace{c_{i}(x^*)}_{=\,0 \text{ by feasibility}}\nabla c_{i}(x^*) = 0
	$$
	The multiplier term corrects exactly the bias that made the pure quadratic penalty settle at infeasible points.
- Theorem: suppose $x^*$ is a local minimizer of the equality-constrained problem at which the LICQ holds, with multipliers $\lambda^*$ satisfying the KKT conditions and the second-order sufficient conditions. Then there exist $\epsilon, M > 0$ such that, whenever $\mu_k$ is sufficiently large and $\|\lambda_k - \lambda^*\|$ is sufficiently small, the problem $\inf_{x}\{\mathcal{L}_A(x,\lambda_k,\mu_k) : \|x - x^*\| \leq \epsilon\}$ has a unique solution $x_k$, and:
	$$
	\|x_k - x^*\| \leq \frac{M\|\lambda_k - \lambda^*\|}{\mu_k} \qquad\text{and}\qquad \|\lambda_{k+1} - \lambda^*\| \leq \frac{M\|\lambda_k - \lambda^*\|}{\mu_k}
	$$
- Reading the theorem: there are two knobs for improving the approximation of $x^*$ — increasing $\mu_k$ (which risks ill-conditioning, as before) or improving the multiplier estimate $\lambda_k$. The second bound shows the multiplier update is a contraction once $\mu_k > M$: the estimates $\lambda_k$ converge to $\lambda^*$ on their own, dragging $x_k \to x^*$ along, all at a fixed and moderate $\mu$. The ill-conditioning problem is avoided.

Worked example: $\inf\{x^2 : x - 1 = 0\}$ has augmented Lagrangian $\mathcal{L}_A(x,\lambda,\mu) = x^2 - \lambda(x-1) + \frac{\mu}{2}(x-1)^2$, whose exact minimizer is $x = (\lambda + \mu)/(2 + \mu)$. Taking $\mu_k = 1$ for all $k$ and $\lambda_1 = 0$: $x_1 = \frac{1}{3}$, $\lambda_2 = \frac{2}{3}$, $x_2 = \frac{5}{9}$, $\lambda_3 = \frac{10}{9}$, $x_3 = \frac{19}{27}$, … — the iterates converge to the optimal solution $x^* = 1$ with multiplier $\lambda^* = 2$, without ever increasing $\mu$.

### Interior Point Methods

The quadratic penalty and augmented Lagrangian methods approach the feasible region from the *outside*: their iterates are generally infeasible until convergence. **Interior point methods** (in their most basic form) do the opposite: all iterates stay strictly inside the feasible region, and a barrier prevents them from ever reaching its boundary.

- Setting: $\inf\{f(x) : x \in X\}$, where $f$ is convex and $X \subset \mathbb{R}^n$ is a convex set.
- A **barrier function** $\Phi$ for $X$ is a function such that:
	- the domain of $\Phi$ is the interior of $X$;
	- $\nabla^2\Phi(x) \succ 0$ for all $x \in \text{int}(X)$ (strictly convex); and
	- $\Phi(x) \to \infty$ as $x$ approaches the boundary of $X$.
- Common barriers:
	- For a ball-like set $\{x : t - \|x\|^2 \geq 0\}$ (with $t > 0$): $\Phi(x) = -\log(t - \|x\|^2)$.
	- For a polyhedron $\{x : a_{i}^\top x \leq b_{i},\ i = 1,\dots,m\}$: the logarithmic barrier $\Phi(x) = -\sum_{i=1}^m \log(b_{i} - a_{i}^\top x)$. Each term blows up as the slack $b_{i} - a_{i}^\top x$ of its constraint shrinks to zero.
	- For the positive semidefinite matrices $\{X : X \succeq 0\}$: $\Phi(X) = -\log(\det X)$, defined on the positive definite matrices (the interior of the set). Since $\det X$ is the product of the (positive) eigenvalues, $\det X \downarrow 0$ and hence $\Phi(X) \to \infty$ whenever an eigenvalue approaches zero.
- The method: pick a barrier parameter $\mu > 0$ and minimize the unconstrained function
	$$
	f(x) + \mu\,\Phi(x)
	$$
	with an unconstrained method (typically Newton's method — the barrier is built to have a positive definite Hessian). Then decrease $\mu$ towards $0$ and repeat, warm-starting from the previous minimizer.
	- For large $\mu$ the barrier dominates and the minimizer sits safely in the interior; as $\mu \downarrow 0$ the objective takes over and the minimizers approach the constrained optimum — while every individual iterate remains strictly feasible.
- The curve of minimizers $\{x(\mu) : \mu > 0\}$, where $x(\mu) = \arg\min_x f(x) + \mu\Phi(x)$, is called the **central path**; interior point methods effectively follow it towards $\mu \to 0$.
- Interior point methods efficiently solve several important classes of convex problems: linear programs (LP), convex quadratic programs (QP; e.g. portfolio optimization), second-order cone programs (SOCP; e.g. robust optimization), and semidefinite programs (SDP; e.g. approximation algorithms). Interior point methods are also one of the polynomial-time LP algorithms mentioned in [[Linear Optimisation#Klee-Minty Problem]].
- In practice, constrained problems are handed to off-the-shelf solvers, e.g. Gurobi or CBC for (mixed-integer) linear problems, Mosek or SDPT3/SeDuMi for convex conic problems, and BARON for non-convex problems. Such solvers typically guarantee global optimality.
