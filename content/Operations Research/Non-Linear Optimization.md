The following are my notes for the course FEB22006X Non-linear Optimization 2025/2026 at Erasmus School of Economics. 

### Introduction

This document builds on:

- The topology of $\mathbb{R}^n$ (open balls; open, closed, bounded, and compact sets) and the theory of extreme values, both from [[4. Multivariate Calculus]].
- Basic linear algebra, in particular positive (semi)definiteness ($\succeq$, $\succ$) and eigenvalues. For a full list of relevant calculation rules and definitions see [[5. Matrix Calculation Rules Cheatsheet]].
- Duality theory from [[Linear Optimisation]], which is used to derive the KKT conditions.

We phrase everything below in terms of minimization, the maximization case follows by negating $f$.

### Convexity

Convexity is the property that makes optimization problems globally tractable: it removes the gap between local and global minimizers.

- A set $X \subseteq \mathbb{R}^n$ is **convex** if for every $x, y \in X$ and $t \in [0,1]$, we have $tx + (1-t)y \in X$. Intuitively: the line segment between any two points of the set lies entirely within the set.
- Let $X \subseteq \mathbb{R}^n$ be a convex set. A function $f:X \rightarrow \mathbb{R}$ is:
	- **convex** if for every $x, y \in X$ and $t \in [0,1]$, we have $f(tx + (1-t)y) \le tf(x) + (1-t)f(y)$. 
	- **strictly convex** if for every $x, y \in X$ such that $x \ne y$ and $t \in (0,1)$, we have $f(tx + (1-t)y) < tf(x) + (1-t)f(y)$. 
	- **(strictly) concave** if $-f$ is (strictly) convex.
	- Intuitively: a function is convex if the line between any two points on its graph lies on or above the graph.
- Convexity can be verified with the Hessian. Let $X \subseteq \mathbb{R}^n$ be an open convex set, and let $f:X \rightarrow \mathbb{R}$ be twice continuously differentiable on $X$. Then,
	- $f$ is convex **if and only if** its Hessian $\nabla^2 f(x) \succeq 0$ for all $x \in X$. 
	- $f$ is strictly convex **if** its Hessian $\nabla^2 f(x) \succ 0$ for all $x \in X$. 
	- Note a positive definite hessian is sufficient but not necessary for strict convexity, for example: $f(x)=x^4$ is strictly convex, yet $f''(0) = 0$.
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
- The algorithm can be terminated when, for instance, $\|\nabla f(x_k)\|$ is small, the iterates $x_{k}$ stop changing much, or a limit is reached on the number of iterations.
- Let $x$ be a point where $\nabla f(x) \ne 0$. Any direction $p$ such that $\nabla f(x)^\top p < 0$ is called a **descent direction**. The direction of **steepest descent** is $p=-\nabla f(x)$. Proof:
	1. The function value after taking $\alpha$ steps in direction $p$ is $\phi(\alpha) = f(x + \alpha p)$
	2. The rate of change at $x$ along direction $p$ is equal to $\phi'(0) = \nabla f(x)^\top p$.
	3. We determine a lower bound using the Cauchy-Schwarz inequality. For any $p$, $\nabla f(x)^\top p \ge -||\nabla f(x)|| \cdot ||p||$.
	4. The choice $p = -\nabla f(x)$ attains this exact lower bound, making $-\nabla f(x)$ the steepest descent direction.

### Deterministic Gradient Descent

- **Gradient Descent** methods are line search algorithms that choose the direction of steepest descent at every iteration:
    $$
    x_{k+1} = x_k - \alpha_k \nabla f(x_k)
    $$
- Gradient descent tends to overshoot the minimizer in some directions, creating a zigzagging path. Polyak's **heavy-ball method** solves this by reusing information from earlier iterations by adding momentum. The formula is:
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

We often maximize the log-likelihood or minimize the negative log-likelihood for some $m$ observations. The problem is that the gradient of this function consists of $m$ terms (representing all observations) added together, which may be computationally expensive to calculate.

- **Stochastic gradient methods** address this by computing the gradient over a random subset of the data rather than the full dataset. To minimize $f(x) = \frac{1}{m}\sum_{j=1}^m f_j(x)$, stochastic gradient methods compute the iterate:

	$$
	x_{k+1} = x_k - \alpha_k \frac{1}{|\mathcal{B}_k|} \sum_{j \in \mathcal{B}_k} \nabla f_j(x_k)
	$$

	for a random subset $\mathcal{B}_k \subseteq \{1,...,m\}$.
	- If $|\mathcal{B}_k|= 1$, it is strictly **stochastic gradient descent**.
	- If $|\mathcal{B}_k|< m$, it is **mini-batch gradient descent**.
	- If $|\mathcal{B}_k| = m$, it is standard (batch) **gradient descent**.
- In standard gradient descent, the gradient naturally approaches zero as you reach the (local) minimum, causing the algorithm to smoothly stop. Because of the mini-batches this is not the case for stochastic gradient methods. Even at the exact minimum, the stochastic gradient will not be perfectly zero. For a fixed step size, the algorithm will reach the minimum but bounce around it endlessly. To ensure convergence, the step size $\alpha_{k}$ must decay over time.
- For convergence analysis, which mathematically guarantees that the distance to the true minimizer eventually shrinks to exactly zero, the diminishing step length $\alpha_k > 0$ must satisfy two strict conditions:
	1. $\sum_{k=1}^\infty \alpha_k = \infty$: The sum of all step sizes must diverge. This guarantees the algorithm can travel infinitely far, ensuring it won't stop before reaching the minimum.
	2. $\sum_{k=1}^\infty \alpha_k^2 < \infty$: The sum of the squared step sizes must converge to a finite number. Because SGD estimates the gradient using a random sub-sample, this introduces variance (estimation error) at every step. Requiring this sum to be finite forces the fluctuations to shrink to zero so the algorithm can perfectly settle on the exact minimum.
- These two conditions create a delicate tradeoff. The step length must decay slow enough to still allow for fast convergence to the minimizer, but it must decay fast enough to successfully damp the noise once the iterates get close to that minimizer.
	- A common step size schedule is the $p$-sequence (see [[3. Series#p-series]]): $\alpha_k = c/k^p$ for constant $c$. This adheres to both constraints if $0.5 <p \leq 1$.
	- A specific example is $\alpha_k = 10^{-4}/k^{0.51}$.
- Note: In applied machine learning practice, these strict conditions are often violated. They are specifically important for mathematical analysis.

### Adaptive Moment Estimation

Exponentially weighted moving average (EWMA)

- An **exponentially weighted moving average** (**EWMA**) of some sequence $\{ y_{t} \}$ with integer time $t > 0$ and smoothing factor $0 \lt \rho \lt 1$ is defined recursively as: 
	- $S_0 = 0$
	- $S_t = (\rho) S_{t-1} + (1-\rho)y_t$
- The initialization with $S_0 = 0$ creates a bias that pulls the average toward zero. Specifically, when determining $S_{t}$ the sum of weights applied to the sequence $y_1, y_2, \dots, y_t$ is $1-\rho^t$, making it an improper weighted average. We can correct for this bias by dividing by $1-\rho^t$, which gives $\hat{S}_t = S_t / (1-\rho^t)$. Since $\rho^t \to 0$ for increasing $t$, this correction becomes less significant with each iteration.
- Note: Alternatively, you can set $S_0 = y_1$, bypassing the bias but this gives $y_1$ a "special" weight that doesn't fit the same pattern as other $y_i$ values.

**Adaptive Moment Estimation** (**Adam**) addresses two separate weaknesses of stochastic gradient descent.

- Weakness 1 (noisy directions, first moment): the mini-batch gradient $g_k = \frac{1}{|\mathcal{B}_k|}\sum_{j \in \mathcal{B}_k}\nabla f_j(x_k)$ is a noisy estimate of the true gradient, every mini-batch pulls in a somewhat different direction. Instead of stepping along $g_k$ directly, we maintain an EWMA of all stochastic gradients seen so far, called the **first moment estimate**:
	$$
	m_k = \beta_1 m_{k-1} + (1-\beta_1)\,g_k
	$$
	This plays a similar role as the momentum term of the heavy-ball method: gradient components that are consistent across iterations accumulate, while components that keep flipping sign (mini-batch noise, zigzagging) average out.
- Weakness 2 (mismatched scales, second moment): a single step size $\alpha$ applies to every coordinate. If the function is much steeper in some coordinates than in others (an ill-conditioned problem), any single $\alpha$ is simultaneously too large for the steep coordinates (overshooting) and too small for the flat ones (barely moving). The solution is to normalize each coordinate by the typical magnitude of its gradient. This magnitude is estimated with an EWMA of the element-wise squared gradients ($g_{k} \circ g_{k}$), the **second moment estimate**:
	$$
	v_k = \beta_2 v_{k-1} + (1-\beta_2)\, g_k \circ g_k
	$$
	Each step in coordinate direction $i$ is then divided by $\sqrt{(v_k)_i}$.
- Both EWMAs are initialized at $m_0 = v_0 = 0$ and are therefore biased toward zero. We therefore apply bias corrections $\hat{m}_k = m_k / (1-\beta_1^k)$ and $\hat{v}_k = v_k / (1-\beta_2^k)$.

The final algorithm then becomes as follows:

| Component     | Adam                                                                                                                                        | Standard SGD                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Gradient      | $g_{k}=\frac{1}{\|\mathcal{B}_k\|} \sum_{j \in \mathcal{B}_k} \nabla f_j(x_k)$                                                              | $g_{k}=\frac{1}{\|\mathcal{B}_k\|} \sum_{j \in \mathcal{B}_k} \nabla f_j(x_k)$ |
| First Moment  | $m_{0}=0$<br>$m_k = \beta_1 m_{k-1} + (1-\beta_1)\,g_k$<br>$\hat{m}_k = m_k / (1-\beta_1^k)$                                                | The estimate of first moment is simply $g_{k}$.                                |
| Second Moment | $v_{k}=0$<br>$v_k = \beta_2 v_{k-1} + (1-\beta_2)\, g_k \circ g_k$<br>$\hat{v}_k = v_k / (1-\beta_2^k)$                                     | No normalization by the second moment.                                         |
| Update rule   | $(x_{k+1})_i = (x_k)_i - \alpha\, \frac{(\hat{m}_k)_i}{\sqrt{(\hat{v}_k)_i} + \epsilon}$                                                    | $x_{k+1} = x_k - \alpha_k g_k$                                                 |
| Step size     | Fixed step size parameter $\alpha$, but distinct net step size $\frac{\alpha}{\sqrt{(\hat{v}_k)_i} + \epsilon}$ across all coordinates $i$. | Decaying step size $\alpha_{k}$ shared across all coordinates.                 |
Good default values are $\alpha = 0.001$, $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$, and $|\mathcal{B}_k| = 128$.

Intuition for the resulting behaviour:

- The update ratio $\frac{(\hat{m}_k)_i}{\sqrt{(\hat{v}_k)_i} + \epsilon}$ approximates a signal-to-noise ratio. The numerator $(\hat{m}_k)_i \approx \mathbb{E}[g_i]$ estimates the true gradient (the signal) by averaging out the noise, while the denominator $\sqrt{(\hat{v}_k)_i} \approx \sqrt{\mathbb{E}[g_i^2]}$ measures the overall magnitude (signal plus noise). Since $\mathbb{E}[g_i^2] = \mathbb{E}[g_i]^2 + \text{Var}(g_i)$, the ratio is close to $\pm 1$ for coordinates where $Var(g_{i})$ is small, and close to $0$ for coordinates where $Var(g_{i})$ is large. Consequently, Adam takes large steps in reliable directions, and smaller steps in less reliable directions.
- Consequently, in most cases the net step sizes across each coordinate direction lies between $-\alpha$ and $\alpha$. The global step size $\alpha$ acts as a cap on the maximum movement per coordinate, rather than as a multiplier on an unbounded gradient.
- As established in the SGD section, stochastic noise does not vanish at the minimum, meaning standard SGD requires a strictly decaying step size to stop bouncing and actually settle. Adam naturally has this decaying behaviour: as the iterates approach a minimum, the gradients frequently flip signs (positive on one batch, negative on the next). This causes the first moment estimate $\hat{m}_k$ to go to zero, and the second moment $\hat{v}_k$ to remain positive. Consequently, the effective step size for that parameter automatically scales down to zero.

### Newton's Method

- All line search methods so far choose their direction using only first-order (gradient) information. Newton's method also uses second-order (Hessian) information, which lets it choose a direction and step length simultaneously.
- The idea: at the current iterate $x_k$, replace $f$ by a **model function** $m_k(p) \approx f(x_k + p)$ that is simple enough to minimize exactly over all steps $p$. Then step to the minimizer of the model, and repeat. 
- One such model is the second-order Taylor approximation:
	$$
	m_k(p) = f(x_k) + \nabla f(x_k)^\top p + \frac{1}{2}p^\top \nabla^2 f(x_k)\, p
	$$
  Suppose $\nabla^2 f(x_k) \succ 0$. Then $m_k$ is a strictly convex quadratic function of $p$, so by the Convex Fermat theorem its unique global minimizer is its stationary point: $\nabla m_k(p_k) = \nabla f(x_k) + \nabla^2 f(x_k)p_k = 0$. The step $p_k$ is therefore found by solving the system of linear equations:
	$$
	\nabla^2 f(x_k)\, p_k = -\nabla f(x_k)
	$$
- **Newton's method** solves the system above for $p_k$, updates $x_{k+1} = x_k + p_k$, increment $k$, and repeats. Note that no separate step length $\alpha_{k}$ is needed since by construction $p_{k}$ already includes the step size aswell.
- When $\nabla^2 f(x_k) \succ 0$, the direction $p_{k}$ is a descent direction: $\nabla f(x_k)^\top p_k = -\nabla f(x_k)^\top [\nabla^2 f(x_k)]^{-1}\nabla f(x_k) < 0$, because the inverse of a positive definite matrix is itself positive definite.
- Newton's method has two important issues:
	1. If $\nabla^2 f(x_k)$ is not positive definite, the linear system may not have a (unique) solution, and even when it does, the solution need not be a descent direction (the stationary point of a non-convex model can be a maximizer or saddle point of that model).
	2. In high dimensions, computing the Hessian ($n^2$ second-order derivatives) and solving an $n \times n$ linear system in every iteration may be computationally infeasible.

### Quasi-Newton Methods

Idea: instead of determining the Hessian in full, mimic Newton's method with some other matrix $B_k$ that behaves similarly to the Hessian but can be constructed using only gradient evaluations. The search direction then solves $B_k p_k = -\nabla f(x_k)$.

What should "behaves similarly to the Hessian" mean? 

- Taylor's theorem in gradient form states:
	$$
	\nabla f(x+p) = \nabla f(x) + \int_0^1 \nabla^2 f(x+tp)\,p \; dt
	$$
- Take $x = x_{k-1}$ (previous position) and $p = x_k - x_{k-1}$ (previous step), and approximate the Hessian inside the integral $\nabla^2 f(x+tp)$ by the fixed matrix $\nabla^2 f(x_k)$, then rearranging gives:
	$$
	\nabla f(x_k) - \nabla f(x_{k-1}) \approx \nabla^2 f(x_k)\,[x_k - x_{k-1}]
	$$
	In words: the Hessian (approximately) maps the most recent step to the observed change in the gradient, and both of those vectors are known from gradient evaluations alone. 
- Abbreviate this equation using $s_{k-1} = x_k - x_{k-1}$ and $y_{k-1} = \nabla f(x_k) - \nabla f(x_{k-1})$. We require $B_k$ to reproduce this relation exactly. This is the **secant equation**:
	$$
	B_k s_{k-1} = y_{k-1} \quad\text{or equivalently}\quad B_k^{-1} y_{k-1} = s_{k-1}
	$$
- **Quasi-Newton methods** frequently pick a $B_k$ that satisfies the secant equation and is symmetric (as the true Hessian is, by Clairaut's theorem). There is more than one $B_{k}$ that satisfies this equation, the secant equation imposes $n$ equations, while a symmetric matrix has $n(n+1)/2$ free entries, so for $n > 1$ infinitely many such matrices exist.

Broyden-Fletcher-Goldfarb-Shanno (BFGS):

- The **Broyden-Fletcher-Goldfarb-Shanno (BFGS)** method resolves this ambiguity with a natural principle: do not throw away what was already learned, choose the matrix closest to the previous approximation. Formally, $B_k^{-1}$ solves:
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

- So far the step length $\alpha_k$ was fixed or decayed on a schedule. Alternatively, we can *search* for a good step length. Recall that the function value along direction $p_{k}$ is $\phi(\alpha) = f(x_k + \alpha p_k)$, with derivative $\phi'(\alpha) = \nabla f(x_k + \alpha p_k)^\top p_k$. We view selecting the step length itself a one-dimensional minimization problem.
- Key idea: Since $p_k$ is a descent direction, $\phi'(0) < 0$. Suppose we also know some $U > 0$ with $\phi'(U) > 0$. Then $\phi$ decreases at $0$ and increases at $U$, so at least one local minimizer (a stationary point of $\phi$) must lie in $[0, U]$ (since $\phi'$ is continuous, by the intermediate value theorem).
- The **bisection method** maintains an interval $[L, U]$ with $\phi'(L) < 0$ and $\phi'(U) > 0$, and repeatedly halves it, keeping the half that still brackets a stationary point:
	1. Pick a tolerance $\delta > 0$ and initialize $[L, U]$ as above.
	2. While $U - L > \delta$, compute the midpoint $M = \frac{1}{2}(L + U)$:
		- If $\phi'(M) < 0$: a stationary point lies in $[M, U]$; set $L \leftarrow M$.
		- If $\phi'(M) > 0$: a stationary point lies in $[L, M]$; set $U \leftarrow M$.
		- If $\phi'(M) = 0$: $M$ is a stationary point; set $L \leftarrow M$ and $U \leftarrow M$.
	3. Return the midpoint $\frac{1}{2}(L+U)$.
- Note: this is essentially binary search on the sign of $\phi'$. The interval width halves every iteration (at the cost of one derivative evaluation), so the bracket width converges to zero with rate $\frac{1}{2}$.

### Rates of Convergence

We now have a whole family of iterative methods. One way to compare them is by how fast their iterates approach a minimizer $x^*$ once they get close.

Suppose we have a sequence $\{ x_{k} \}$ that converges to $x^*$, then

- the sequence converges **linearly** if there exists an $r \in (0,1)$ and an index $k_0$ such that, for all $k \ge k_0$:
	$$
	\frac{\|x_{k+1}-x^*\|}{\|x_k - x^*\|} \le r
	$$
	- Intuition: The error shrinks by at least a constant factor per iteration. You add a roughly constant number of correct decimal places per iteration.
	- Example: $1 + (\frac{1}{2})^k$ converges linearly to $1$.
	- Gradient descent methods generally converge linearly. This matches the Convergence Analysis section, where the gap shrinks by a factor of roughly $1 - 4/\kappa$ per iteration.
- the sequence converges **superlinearly** if:
	$$
	\lim_{k \to \infty}\frac{\|x_{k+1}-x^*\|}{\|x_k-x^*\|} = 0
	$$
	- Intuition: The per-iteration shrink factor itself keeps improving. 
	- Example: $1 + (\frac{1}{k})^k$ converges superlinearly to $1$.
	- Quasi-Newton methods generally converge superlinearly.
- the sequence converges **quadratically** if there exists an $M > 0$ and an index $k_0$ such that, for all $k \ge k_0$:
	$$
	\frac{\|x_{k+1}-x^*\|}{\|x_k-x^*\|^2} \le M
	$$
	- Intuition: The error is essentially squared every iteration. You double the number of correct decimal places per iteration.
	- Example: $(\frac{1}{2})^{2^k}$ converges quadratically to $0$.
	- Newton's method generally converges quadratically.
- Each rate implies the previous one: quadratic convergence implies superlinear convergence, which implies linear convergence. 
	- Intuition: If we rewrite the quadratic bound as $\Vert{}x_{k+1}-x^*\Vert{} \le (M \Vert{}x_k-x^*\Vert{}) \cdot \Vert{}x_k-x^*\Vert{}$, the effective shrink factor is $(M \Vert{}x_k-x^*\Vert{})$. Because the sequence $\{ x_{k} \}$ is known to converge to $x^*$, the error $\Vert{}x_k-x^*\Vert{}$ approaches $0$. This guarantees the shrink factor approaches $0$ as $k \to \infty$ (satisfying superlinear). Similarly, superlinear convergence trivially implies linear convergence.
	- Note: These convergence rates describe asymptotic behavior. It is entirely possible for one sequence to make faster progress than another during the earlier iterations, even if its eventual rate of convergence is worse.
- Note how the improved rates of convergence are frequently counterbalanced by the cost per iteration: gradient evaluations only (linear), gradient evaluations plus a matrix update (superlinear), Hessian evaluation plus a linear system solve (quadratic).

### Sub-differentials

Theorems for minimization/maximization frequently rely on a gradient. For convex functions that are not differentiable everywhere (e.g. $f(x) = |x|$), the gradient is generalizes to a *set* of admissible slopes.

- Let $X \subseteq \mathbb{R}^n$, and let $f: X \to \mathbb{R}$ be a convex function. A vector $r \in \mathbb{R}^n$ is a **subgradient** of $f$ at $x \in X$ if:
	$$
	f(y) \ge f(x) + r^\top (y - x) \quad \forall y \in X
	$$
	Geometrically: $r$ is the slope of an affine function that touches the graph of $f$ at $x$ and lies below the graph everywhere else. For a differentiable convex function, the tangent plane does exactly this.
- The set of all subgradients of $f$ at $x$ is called the **subdifferential**, denoted $\partial f(x)$.
- If a convex function $f$ is differentiable at $x$, then $\partial f(x) = \{\nabla f(x)\}$. That is, the tangent plane is the only affine lower bound touching the graph at $x$.
- Example: $f(y) = |y|$ at $x = 0$: $r$ is a subgradient if and only if $|y| \geq ry$ for all $y \in \mathbb{R}$, which holds exactly for $r \in [-1, 1]$. Hence $\partial f(0) = [-1,1]$: every line through the origin with slope between $-1$ and $1$ stays below the V-shape.
- **Convex Fermat Theorem (subgradient version)**: Let $f: \mathbb{R}^n \to \mathbb{R}$ be a convex function, and let $x^* \in \mathbb{R}^n$. Then $x^*$ is a global minimizer of $f$ if and only if $0 \in \partial f(x^*)$. If $f$ is strictly convex, then $x^*$ is the unique global minimizer of $f$.
	- Intuition: substituting $r = 0$ into the subgradient inequality gives $f(y) \geq f(x^*)$ for all $y$, which *is* the definition of a global minimizer, the converse makes intuitive sense aswell.
	- This extends the roadmap for finding global minimizers. For convex but non-differentiable $f$, replace "find a stationary point" by "find $x^*$ with $0 \in \partial f(x^*)$".
- Subdifferentials of complicated convex functions can be computed using the subdifferentials of simpler convex functions. Let $f: X \to \mathbb{R}$ and $g: X \to \mathbb{R}$ be convex functions and $x \in X$:
	- **Norm**: if $f(x) = \|x\|$, then $\partial f(0) = \{r \in \mathbb{R}^n : \|r\| \leq 1\}$ (the unit ball), at any $x \neq 0$ the norm is differentiable.
	- **Non-negative scaling**: $\partial(\alpha f)(x) = \alpha\,\partial f(x) := \{\alpha r : r \in \partial f(x)\}$ for all $\alpha \geq 0$.
	- **Sum**: $\partial(f+g)(x) = \partial f(x) + \partial g(x) := \{r + s : r \in \partial f(x), s \in \partial g(x)\}$. 
		- This "sum of sets" (every combination of one element from each set) is called the **Minkowski sum**.
	- **Maximum**: $\partial(\max\{f,g\})(x)$ equals $\partial f(x)$ where $f(x) > g(x)$, equals $\partial g(x)$ where $g(x) > f(x)$, and equals $\text{conv}(\partial f(x) \cup \partial g(x))$ at the kink where $f(x) = g(x)$.
		- The **convex hull** $\text{conv}(S)$ is the smallest convex set containing $S$, or equivalently, the set of all convex combinations of points in $S$.

### Coordinate Descent and Golden Section Method

Suppose we want to perform line search, but without relying on derivatives. We need to re-answer the two core questions for line search.

How do we determine the search direction?

- **Coordinate Descent** performs line search by selecting its search directions $p_k$ from the set of standard basis vectors $\{e_1,\dots,e_n\}$ and then searching for a good next iterate along the line $\{x_k + \alpha p_k : \alpha \in \mathbb{R}\}$. We basically optimize one coordinate at a time.
- In what order should the coordinate directions be searched? Example strategies:
	- **Cyclic**: $e_1, e_2, \dots, e_n, e_1, e_2, \dots$
	- **Back-and-forth**: $e_1, e_2, \dots, e_{n-1}, e_n, e_{n-1}, \dots, e_2, e_1, e_2, \dots$
	- More advanced strategies such as: at the end of $n$ step cycle, additionally search along the net progress direction of that cycle, $x_k - x_{k-n}$.
- Some strategies provably converge to a local minimizer, while others can iterate endlessly.

How do we determine the step size?

- The **golden section method** approximates a local minimizer of any continuous function $\phi: \mathbb{R} \to \mathbb{R}$ without relying on the derivative.
	- This is the derivative free alternative to the bisection method.
- The full algorithm: 
	1. pick a tolerance $\epsilon > 0$ and initialize $L < M < U$ such that $(M-L)/(U-M) \in \{\varphi, 1/\varphi\}$, where $\varphi$ is the positive solution to $\varphi^2-\varphi-1=0$.
	2. Place the test point in the longer subinterval: if $U - M > M - L$, set $T \leftarrow L + (U-L)/\varphi$, otherwise set $T \leftarrow L + (U-L)(1 - 1/\varphi)$.
	3. If $\phi(T) > \phi(M)$: shrink away from $T$'s side (set $U \leftarrow T$ if $T > M$, or $L \leftarrow T$ if $T < M$).
	4. If $\phi(T) \le \phi(M)$: $T$ becomes the new interior point; discard the segment on the far side of $M$ (if $T > M$: set $L \leftarrow M$, $M \leftarrow T$; if $T < M$: set $U \leftarrow M$, $M \leftarrow T$).
	5. If $U - L \le \epsilon$, return $M$, otherwise repeat from 2.
- In every iteration the interval width shrinks by the factor $1/\varphi \approx 0.618$, so the bracket width converges linearly to zero, slightly slower than bisection's factor $0.5$, which is the price of not using derivatives.

Derivation of the Golden Section Method

- Suppose we know three points $L < M < U$ such that $\phi(M) < \phi(L)$ and $\phi(M) < \phi(U)$. Then there must be some local minimizer $x^*$ of $\phi$ in $(L,U)$. We say the points $L$, $M$, and $U$ bracket a minimizer.
- To shrink the interval $(L,U)$, we evaluate $\phi$ at a new test point $T$ somewhere inside the interval. We then compare $\phi(T)$ with $\phi(M)$, and discard either $L$ or $U$ while ensuring the remaining three points still validly bracket the minimizer. We repeat this process until the width of the interval falls below a desired threshold.
- This raises a core design question: 
	- How should we initialize the interior point $M$?
	- How do we pick the test point $T$?
- As a first guess, suppose we initialize symmetrically by placing $M$ exactly in the middle of $L$ and $U$, and then test a point $T$ exactly halfway between $L$ and $M$.
	- If $\phi(T) < \phi(M)$, the new bracketing triple is $(L, T, M)$, which has a width equal to $0.5$ times the original interval.
	- If $\phi(T) \ge \phi(M)$, the new bracketing triple is $(T, M, U)$, which has a width equal to $0.75$ times the original interval.
	- While this successfully brackets the minimum, the reduction factor fluctuates wildly depending on the function's shape.
	- To ensure a good worst case performance, it is preferable to reduce the bracket by a predictable, constant factor in every single iteration.
- To achieve a predictable reduction, we abandon symmetric initialization. Instead, $M$ divides the interval asymmetrically, and $T$ is always placed inside the larger of the two subintervals. This placement divides the entire search space $[L, U]$ into three structural segments:
	- $a$: the width of the smaller original subinterval (the side not containing $T$).
	- $b$: the distance between the old interior point $M$ and the test point $T$.
	- $c$: the distance from $T$ to the nearest outer boundary ($L$ or $U$).
- Two natural requirements uniquely determine the optimal layout of these segments:
	- **Symmetric reduction**: The width of the next interval should not depend on the outcome of the function comparison. The two possible new interval widths are $a + b$ (if we drop $c$) and $b + c$ (if we drop $a$). Equating them gives $a + b = b + c$, which simplifies exactly to $a = c$.
	- **Scale invariance:** The relative ratio between the subintervals must be preserved so the same logic applies forever. The ratio of the larger subinterval to the smaller one in the current step is $\frac{b+c}{a}$. Because $a=c$, the sub intervals in the next iteration will have widths $a$ and $b$ (or equivalently $c$ and $b$). The segment $a$ must be the larger one (if $b$ were larger, equating the ratios $\frac{b+a}{a} = \frac{b}{a}$ would imply the contradiction $1=0$), making the new ratio $\frac{a}{b}$. Preservation of the ratio gives: $\frac{b+c}{a} = \frac{a}{b}$.
- Substituting $c = a$ into the scale invariance requirement yields $\frac{b+a}{a} = \frac{a}{b}$. Defining the target ratio as $\rho = a/b$, this simplifies to $\frac{1}{\rho} + 1 = \rho$, or $\rho^2 = \rho + 1$. The positive solution is the golden section:$$\varphi = \frac{1}{2} + \frac{1}{2}\sqrt{5} \approx 1.618$$
- Using this ratio for initializing $M$, and selecting $T$ inside the larger interval ensures the size of the interval shrinks at a constant rate.

### Nelder-Mead Simplex Method

- All line search methods move a single point along a single direction per iteration. The **Nelder-Mead simplex method** instead maintains a cloud of $n+1$ points and moves the entire cloud downhill. It often works reasonably in practice, though its convergence theory is rather limited.
- A **simplex** is the convex hull of $n+1$ points $x_1, \dots, x_{n+1} \in \mathbb{R}^n$ such that the differences $x_2 - x_1, \dots, x_{n+1} - x_1$ are linearly independent (the points genuinely span all $n$ dimensions): a triangle in $\mathbb{R}^2$, a tetrahedron in $\mathbb{R}^3$. 
	- The **standard simplex** is formed by the origin $\mathbf{0}$ and the standard basis vectors $\mathbf{e}_{1}, \mathbf{e_{2}}, \dots, \mathbf{e}_{n}$.
	- The **regular simplex** is a simplex where all edges between its points are the exact same length.
- At the start of every iteration, relabel the points from best to worst: $f(x_1) \le f(x_2) \le \dots \le f(x_{n+1})$. The iteration then tries to replace the worst point $x_{n+1}$ with a better one. All candidate replacements lie on the line through $x_{n+1}$ and the **centroid** of the $n$ best points:
	$$
	\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
	$$
	Moving away from the worst point, through the middle of the better ones, is the simplex's replacement for a descent direction. The candidates are:
	- The **reflection** $r = \bar{x} + (\bar{x} - x_{n+1})$: the worst point mirrored through the centroid.
	- The **expansion** $e = \bar{x} + 2(\bar{x} - x_{n+1})$: extends the reflection twice as far out from the centroid.
	- The **outside contraction** $c_1 = \bar{x} + \frac{1}{2}(\bar{x} - x_{n+1})$: halfway between the centroid and reflection.
	- The **inside contraction** $c_2 = \bar{x} + \frac{1}{2}(x_{n+1} - \bar{x})$: halfway between the centroid and the worst point.
- The iteration logic is driven by how good the reflection turns out to be:
	1. Compute $r$. If $f(x_1) \le f(r) < f(x_n)$, the reflection is neither the best nor among the worst of the new simplex: accept it (replace $x_{n+1}$ by $r$) and start the next iteration.
	2. If $f(r) < f(x_1)$, the reflection beats every current point, so the direction is promising, so we explore further: compute the expansion $e$, and replace $x_{n+1}$ by the better of $r$ and $e$.
	3. If $f(r) \ge f(x_n)$, the reflection is still worse than the $n$ best points, so the simplex likely stepped over the valley, we try a more conservative candidate:
		- If $f(r) < f(x_{n+1})$ (the reflection is better than the point it was meant to replace): compute the outside contraction $c_1$: if $f(c_1) < f(r)$, replace $x_{n+1}$ by $c_1$.
		- If $f(r) \ge f(x_{n+1})$ (the reflection is even worse than the point it was meant to replace): compute the inside contraction $c_2$: if $f(c_2) < f(x_{n+1})$, replace $x_{n+1}$ by $c_2$.
	4. **Shrinking**: if no replacement was made, the simplex is apparently too large to capture the local landscape in any probed direction, shrink it towards the best point by replacing every $x_i$ by $\frac{1}{2}(x_i + x_1)$.
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

### Lagrangian Function

(todo: also explain the Lagrangian and its properties)

### Duality

(todo: explain the dual, and explain strong and weak duality)

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
	Where the constants $\lambda_{i}$ (called **Lagrange multipliers**) capture how each constraint restricts movement:
	- For equality constraints $\lambda_{i} \in \mathbb{R}$ because equality constraints restrict movement in both directions.
	- For active inequality constraints $\lambda_{i} \geq 0$ because they only restrict movement in one direction.
4. To write this linear combination elegantly without needing to manually separate active and inactive linear inequalities, we introduce the **complementary slackness condition**: $\lambda_{i}c_{i}(x)=0$ for all $i \in \mathcal{I}$. This rule guarantees that if an inequality is inactive ($c_{i}(x) > 0$), then its multiplier must be zero ($\lambda_{i}=0$), effectively removing its contribution from the sum.
5. Combing all of this, we get the full Karush-Kuhn-Tucker (KKT) conditions. Assuming some constraint qualifications hold, if $x^*$ is a local minimizer, there exists some Lagrange multipliers $\lambda^*$ such that each of the following conditions hold:
	1. **Stationarity**: $\nabla f(x^*)=\sum_{i \in \mathcal{E \cup \mathcal{I}}}\lambda_{i}^* \nabla c_{i}(x^*)$
	2. **Primal Feasibility**: 
		- $c_{i}(x^*)=0\quad \forall i \in \mathcal{E}$
		- $c_{i}(x^*) \geq 0 \quad \forall i \in \mathcal{I}$
	- **Dual Feasibility**: $\lambda_{i}^*\geq 0\quad \forall i \in \mathcal{I}$
	- **Complementary Slackness**: $\lambda_{i}^*c_{i}(x^*)=0 \quad \forall i \in \mathcal{I}$.

(todo: add note that the KKT relies on some assumptions that are not guaranteed to be true (explain exactly which steps dont always work), then provide a brief example where it does not hold)

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

(todo: explain slaters condition, and explain how it guarantees that the KKT )

(todo: explain the linear independence constraint qualification, and explain how it guarantees )

### Second Order Conditions

(todo: write the second order conditions here)

### Perturbing Constraints

(todo: explain perturbing a constraint formally, then explain we want to answer how this impacts the optimal objective value. Then show how this relates to the Lagrange multipliers  )

### Quadratic Penalty

(todo: define quadratic penalty)
(todo: define quadratic penalty method)
(todo: state problem with the method)

### Augmented Lagrangian Method

Consider the constrained optimization problem:
$$
\begin{align}
\inf f(\mathbf{x}) & \\
\text{subject to } c_{i}(\mathbf{x})&=0 \quad \forall i \in \mathcal{E} \\
c_{i}(\mathbf{x})&\geq 0\quad \forall i  \in \mathcal{I}
\end{align}
$$
where $f : \mathbb{R}^n \to \mathbb{R}$ and $c_{i}:\mathbb{R}^n \to \mathbb{R}$ are continuously differentiable for all $i \in \mathcal{E}\cup \mathcal{I}$. 

Then the **Lagrangian function** is defined as:
$$
\mathcal{L}(\mathbf{x}, \mathbf{\lambda})=f(\mathbf{x})-\sum_{i\in\mathcal{E}\cup \mathcal{I}}\lambda_{i}c_{i}(\mathbf{x})
$$

The Lagrangian of $\inf_{\mathbf{x}} \{ f(\mathbf{x}) :c_{i}(\mathbf{x})=0\quad\forall i \in \mathcal{E} \}$ has the property:
$$
\sup_{\mathbf{\lambda}}\mathcal{L}(\mathbf{x},\mathbf{\lambda})=\begin{cases}
f(\mathbf{x})&\text{if } \forall i \in \mathcal{E}: c_{i}(\mathbf{x})=0 \\ 
\infty&\text{otherwise}
\end{cases}
$$
Consequently, $\inf \{ f(\mathbf{x}) :c_{i}(\mathbf{x})=0\quad\forall i \in \mathcal{E} \}=\inf_{\mathbf{x}}\sup_{\lambda}\mathcal{L}(\mathbf{x}, \mathbf{\lambda})$. 

Problem: $\sup_{\mathbf{\lambda}}\mathcal{L}(\mathbf{x}, \mathbf{\lambda})$ is not continuous with respect to $\mathbf{x}$.

Solution: Fix some some $\bar{\mathbf{\lambda}}\in \mathbb{R}^{|\mathcal{E}|}$ and $\mu>0$. (todo: explain the derivation of the augmented Lagrangian, also add better intuition to this section)

### Interior Point Methods

(todo, explain interior point methods)





