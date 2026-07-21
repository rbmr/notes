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
- $f$ and $c_{i}$ are assumed to be (twice) continuously differentiable for the gradient and hessian to be fully defined and continuous everywhere.
- $\mathcal{E}$ is the index set of the equality constraints
- $\mathcal{I}$ is the index set of the inequality constraints 

Additional remarks:
- A point $\mathbf{x}$ is said to be **feasible** if it satisfies all constraints.
- A feasible point $\mathbf{x}$ is often called a **solution**, in which case a global minimizer is called an **optimal solution**, and a local minimizer a **locally optimal solution**.
- The problem is stated with $\inf$ rather than $\min$ because a minimizer is not guaranteed to exist, when one does exist, the infimum is attained and equals the minimum.

### Lagrangian Function

The **Lagrangian function** of a constrained optimization problem puts the constraints into the objective, attaching to each constraint a variable price $\lambda_i$, called its **Lagrange multiplier**:
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

This reformulation is the core idea behind duality and for the augmented Lagrangian method, both covered below.

### Intuition for KKT

Comparison against unconstrained Local Minima

- A **descent direction** is a direction $s$ for a point $x$, such that the directional derivative is strictly negative, $\nabla f(x)^\top s< 0$. 
- In unconstrained optimization, if a point $x$ is a local minimizer, there must be no such descent direction, or equivalently, by Fermat's theorem, $\nabla f(x) = 0$. 
	- The converse is not true in general: a point $x$ where $\nabla f(x)=0$ is not guaranteed to be a local minimizer.
- A **feasible descent direction** is a descent direction $s$ for a point $x$ for which all constraints remain satisfied. 
- In constrained optimization, if a point $x$ is a local minimizer, there must be no such *feasible* descent direction. 
- We are looking for the constrained analogue of Fermat's theorem. That is some simple rule to determine whether no such feasible descent direction $s$ exists.

Suppose we are at a feasible point $x$. Using a first-order Taylor approximation, we know $g(x+s) \approx g(x) + \nabla g(x)^\top s$ for any differentiable function $g$. This gives us the following four conditions on $s$:

1. Decreasing objective function means $f(x+s) < f(x)$, therefore $\nabla f(x)^\top s<0$.
2. For all equality constraints ($i \in \mathcal{E}$), we must remain on the boundary, that is $c_{i}(x+s)=0$. By feasibility of $x$ we have $c_{i}(x)=0$, we must walk tangent to the constraint, that is $\nabla c_{i}(x)^\top s=0$.
3. For all inactive inequality constraints ($i \in \mathcal{I}$ where $c_{i}(x)>0$), we are strictly inside the boundary. Therefore any sufficiently small step $s$ in any direction will not violate the constraint. This $\nabla c_{i}(x)^\top s$ can be anything.
4. For all active inequality constraints ($i \in \mathcal{I}$ where $c_{i} = 0$), we are on the edge of the inequality boundary. To stay inside the feasible region $c_{i}(x+s)\geq 0$ we must walk either tangent to the boundary or point inward, that is $\nabla c_{i}(x)^\top s \geq 0$.

For $x$ to be a local minimizer, there must be no $s$ that satisfies condition 1 together with conditions 2 to 4. We derive the resulting condition on $\nabla f(x)$ in four cases of increasing generality.

**Single equality constraint.**
1. We have one equality constraint $c_1$, with $x$ feasible so $c_1(x) = 0$. 
2. We assume $\nabla c_1(x) \neq 0$.
3. Any feasible descent direction $s$ must have $\nabla f(x)^\top s < 0$, and $\nabla c_1(x)^\top s = 0$.
4. Decompose $\nabla f(x)= p + r$ into its component $p$ along $\nabla c_1(x)$ ($p=\lambda_{1}\nabla c_{1}(x)$ for some $\lambda_{1}\in \mathbb{R}$) and an orthogonal remainder $r$ (so $\nabla c_1(x)^\top r = 0$).
5. We can determine $\lambda_{1}$ by left multiplying $\nabla f(x)= p + r$ with $\nabla c_1(x)^\top$, and then simplifying and rewriting gives:
	$$
	\lambda_1 = \frac{\nabla f(x)^\top \nabla c_1(x)}{\|\nabla c_1(x)\|^2} \in \mathbb{R},
	$$
	which is well-defined since $\nabla c_1(x) \neq 0$.
6. Suppose, that $r \neq 0$. In this case, we can take $s = -r$. Then $\nabla c_1(x)^\top s = -\nabla c_1(x)^\top r = 0$, and $\nabla f(x)^\top s = -(\lambda_1 \nabla c_1(x) + r)^\top r = -\|r\|^2 < 0$, so this $s$ is a feasible descent direction, thus $x$ is not a local minimizer. 
7. Consequently, for $x$ to be a local minimizer, we must have $r = 0$, giving
	$$
	\nabla f(x) = \lambda_1 \nabla c_1(x), \qquad \lambda_1 \in \mathbb{R}.
	$$

**Single inactive inequality constraint.**
1. We have one inequality constraint $c_1$, inactive at feasible $x$, so $c_1(x) > 0$.
2. Since $c_1$ is continuous and $c_1(x) > 0$, every sufficiently small step $s$ keeps $c_1(x+s) > 0$. So no direction is forbidden and the problem is locally unconstrained: any feasible descent direction $s$ only needs $\nabla f(x)^\top s < 0$.
3. Suppose $\nabla f(x) \neq 0$, and take $s = -\nabla f(x)$. Then $\nabla f(x)^\top s = -\|\nabla f(x)\|^2 < 0$, so this $s$ is a feasible descent direction, thus $x$ is not a local minimizer.
4. Consequently, for $x$ to be a local minimizer, we must have
	$$
	\nabla f(x) = 0
	$$
	which is just the ordinary unconstrained stationarity condition.

**Single active inequality constraint.**
1. We have one inequality constraint $c_1$, active at feasible $x$, so $c_1(x) = 0$.
2. We assume $\nabla c_1(x) \neq 0$.
3. To stay inside the feasible region $c_1 \geq 0$, a step $s$ may only walk tangent to the boundary or point inward, that is $\nabla c_1(x)^\top s \geq 0$. So any feasible descent direction $s$ must have $\nabla f(x)^\top s < 0$ and $\nabla c_1(x)^\top s \geq 0$.
4. Decompose $\nabla f(x) = p + r$ exactly as in the single-equality case. That is we have $p = \lambda_1 \nabla c_1(x)$ (for some $\lambda_1 \in \mathbb{R}$) along $\nabla c_1(x)$ and an orthogonal remainder $r$ (so $\nabla c_1(x)^\top r = 0$). Unlike in the single equality case, we now also need to determine the *sign* of $\lambda_1$, so there are two things to rule out.
5. First suppose $r \neq 0$. In this case we can take $s = -r$. Then $\nabla c_1(x)^\top s = -\nabla c_1(x)^\top r = 0 \geq 0$, and $\nabla f(x)^\top s = -(\lambda_1 \nabla c_1(x) + r)^\top r = -\|r\|^2 < 0$, so this $s$ is a feasible descent direction, thus $x$ is not a local minimizer. So for $x$ to be a local minimizer we must have $r = 0$, i.e. $\nabla f(x) = \lambda_1 \nabla c_1(x)$ (just like with the equality constraint).
6. Now suppose $\lambda_1 < 0$, and take $s = \nabla c_1(x)$. Then $\nabla c_1(x)^\top s = \|\nabla c_1(x)\|^2 \geq 0$, and $\nabla f(x)^\top s = \lambda_1 \|\nabla c_1(x)\|^2 < 0$, so this $s$ is again a feasible descent direction, thus $x$ is not a local minimizer. So for $x$ to be a local minimizer we must *also* have $\lambda_1 \geq 0$.
7. Combining both, for $x$ to be a local minimizer, we must have
	$$
	\nabla f(x) = \lambda_1 \nabla c_1(x), \qquad \lambda_1 \geq 0.
	$$

This proof is just the proof for the single equality extended with the added constraint on $\lambda_{1}\geq 0$ in the final formula. This makes sense, the active inequality constraint is *less* strict than the equality constraint on which $s$ are feasible, so the condition specifying when no feasible descent directions $s$ exists must be *more* strict than the corresponding condition for the equality constraint.

**Multiple equality constraints.**
1. We have multiple equality constraints $c_i$ for $i \in \mathcal{E}$ and no inequality constraints, and we have some feasible  $x$ such that $c_i(x) = 0$ for all $i\in \mathcal{E}$.
2. We denote $V = \text{span}\{\nabla c_i(x) : i \in \mathcal{E}\}$ for the subspace spanned by the constraint gradients. A step $s$ walks tangent to *every* constraint, $\nabla c_i(x)^\top s = 0$ for all $i$, exactly when $s$ is orthogonal to all of them, i.e. $s \in V^\perp$. So any feasible descent direction $s$ must have $\nabla f(x)^\top s < 0$ and $s \in V^\perp$.
3. Decompose $\nabla f(x) = g + r$ into its component $g \in V$ and an orthogonal remainder $r \in V^\perp$ (so $g^\top r = 0$). Since $g \in V$, we may write $g = \sum_{i \in \mathcal{E}} \lambda_i \nabla c_i(x)$ for some $\lambda_i \in \mathbb{R}$.
4. Suppose $r \neq 0$, and take $s = -r \in V^\perp$. Then $\nabla c_i(x)^\top s = 0$ for every $i$ (as $s \in V^\perp$), and $\nabla f(x)^\top s = -(g + r)^\top r = -\|r\|^2 < 0$ (using $g \perp r$), so this $s$ is a feasible descent direction, thus $x$ is not a local minimizer.
5. Consequently, for $x$ to be a local minimizer, we must have $r = 0$, giving
	$$
	\nabla f(x) = \sum_{i \in \mathcal{E}} \lambda_i \nabla c_i(x), \qquad \lambda_i \in \mathbb{R}.
	$$

This proof is just the single-equality argument with the line $\text{span}\{\nabla c_1(x)\}$ replaced by the more general subspace $V$.

These proofs show the differences between the constraint types:
- An equality forces $s$ onto a *hyperplane*.
- An active inequality only forces $s$ into a *half-space*.
- An inactive inequality imposes nothing at all. 

Note also that the single-constraint proofs assumed $\nabla c_1(x) \neq 0$, this is what constraint qualifications will guarantee.

### KKT Conditions

Consider some point $x$ at that satisfies some equality $\mathcal{E}$ and inequality $\mathcal{I}$ constraints.  We use $\mathcal{I}_{\text{active}} = \{i \in \mathcal{I} : c_i(x) = 0\}$ to denote the active inequality constraints at $x$.

For a direction $s$ from $x$ to be feasible-to-first-order, it must lie in the following cone:
$$
\{s : \nabla c_i(x)^\top s = 0 \ \forall i \in \mathcal{E},\ \nabla c_i(x)^\top s \geq 0 \ \forall i \in \mathcal{I}_{\text{active}}\}
$$
or equivalently
(todo: state that any s in the cone can be written as a linear combination (with the right signs) of the constraint gradients)

Crucially, $x$ can only be a minimizer if it has no feasible descent direction, i.e. no $s$ such that $\nabla f(x)^\top s < 0$ and $s$ lies in the cone. 

**Farkas' lemma**, a *theorem of the alternative*, states that exactly one of the following holds: either such a feasible descent direction $s$ exists, or $\nabla f(x)$ lies in the cone generated by the active constraint gradients,
$$
\nabla f(x) = \sum_{i \in \mathcal{E} \cup \mathcal{I}_{\text{active}}} \lambda_i \nabla c_i(x)
$$
where $\lambda_i \geq 0$ for all $i \in \mathcal{I}_{\text{active}}$ and $\lambda_i \in \mathbb{R}$ for all $i \in \mathcal{E}$. 

So "no feasible descent direction exists" is *equivalent* to $\nabla f(x)$ lying in that cone. 

Geometrically: once the objective gradient is spanned by the active constraint gradients (with the right signs), every feasible direction is an ascent or neutral direction, and $x$ is a candidate minimizer. This is the **stationarity condition**, and it is the constrained analogue of Fermat's $\nabla f = 0$.

To write the stationarity condition as a single sum over the full index set $\mathcal{E} \cup \mathcal{I}$, without separating active from inactive inequality constraints by hand, we use the **complementary slackness condition**, $\lambda_i c_i(x) = 0$ for all $i \in \mathcal{I}$. This condition is already met for any active $i$, since $c_i(x) = 0$, and if the constraint is inactive $c_{i}(x)>0$, the condition ensures $\lambda_i = 0$ such that its contribution is removed from the stationarity condition.

We arrive at the full **Karush-Kuhn-Tucker (KKT) conditions**. Assuming some constraint qualification holds (see below), if $x^*$ is a local minimizer, then there exist Lagrange multipliers $\lambda^*$ such that each of the following conditions hold:
1. **Stationarity**: 
	$$
	\nabla f(x^*)=\sum_{i \in \mathcal{E} \cup \mathcal{I}}\lambda_{i}^* \nabla c_{i}(x^*)
	$$
2. **Primal Feasibility**: 
	- $c_{i}(x^*)=0\quad \forall i \in \mathcal{E}$
	- $c_{i}(x^*) \geq 0 \quad \forall i \in \mathcal{I}$
3. **Dual Feasibility**: $\lambda_{i}^*\geq 0\quad \forall i \in \mathcal{I}$
4. **Complementary Slackness**: $\lambda_{i}^*c_{i}(x^*)=0 \quad \forall i \in \mathcal{I}$

A pair $(x^*, \lambda^*)$ satisfying all four conditions is called a **KKT point**.

The stationarity condition is equivalent to stating that $x^*$ is a stationary point of the Lagrangian *in $x$* at the multipliers $\lambda^*$. Specifically, $\nabla_x \mathcal{L}(x,\lambda) = \nabla f(x) - \sum_i \lambda_i \nabla c_i(x)$, so $\nabla_x \mathcal{L}(x^*, \lambda^*) = 0$ is precisely $\nabla f(x^*) = \sum_i \lambda_i^* \nabla c_i(x^*)$.

### Need for Constraint Qualification

The KKT stationarity condition was derived from a *first-order* (Taylor) picture of the feasible set. When that linearized picture misrepresents the true feasible set, KKT can fail even at a genuine minimizer.

Example where KKT fails at a minimizer. Consider:
$$
\inf\ f(x) = x \quad \text{subject to}\quad c_1(x) = x^2 = 0.
$$
The only feasible point is $x^* = 0$, so it is trivially the global minimizer. Yet the KKT stationarity condition $\nabla f(x^*) = \lambda_1 \nabla c_1(x^*)$ reads $1 = \lambda_1 \cdot 2x^* = 0$, which no $\lambda_1$ can satisfy. So the minimizer $x^*=0$ satisfies *no* choice of KKT multipliers. The culprit: $\nabla c_1(0) = 0$ vanishes, so the linearized feasible directions $\{s : \nabla c_1(0)^\top s = 0\} = \mathbb{R}$ suggest we may move freely, while the true feasible set is the single point $\{0\}$. The first-order picture is misleading precisely because we cannot move (approximately) orthogonal to the active constraint gradient.

### Constraint Qualification

A **constraint qualification** is a condition on the constraints at $x^*$ that guarantees each local minimizer is a KKT point. 

The weakest, exactly-necessary constraint qualifications are awkward to verify in practice. Instead we use two easy-to-check *sufficient* qualifications: Slater's condition and the linear independence constraint qualification (LICQ). Each, when it holds, guarantees KKT is necessary; neither is required in general.

 Recall a **convex optimization problem** requires the feasible region to be convex, and the objective function to also be convex. For the feasible region to be convex, it is sufficient to require each constraint on its own to define a convex set of feasible points, since the intersection of convex sets is also a convex set. Formalizing this, we get the following requirements for a convex optimization problem:
- the objective $f$ is convex;
- the equalities are affine: $c_i(x) = a_i^\top x + b_i$ for some $a_i \in \mathbb{R}^n$, $b_i \in \mathbb{R}$, for all $i \in \mathcal{E}$;
- the inequalities are concave: $-c_i$ is convex for all $i \in \mathcal{I}$ (so the feasible region $\{c_i(x) \geq 0\}$ is convex).

**Slater's condition** holds if there exists some *strictly feasible* point $\hat{x}$: $c_i(\hat{x}) = 0$ for all $i \in \mathcal{E}$ and $c_i(\hat{x}) > 0$ (strict) for all $i \in \mathcal{I}$. Slater's is a property of the whole problem (it needs one strictly feasible point), not of a particular candidate $x^*$.

For a *convex* optimization problem satisfying Slater's condition, the KKT conditions are **necessary and sufficient** for global optimality. Like any constraint qualification, Slater's guarantees necessity, but combined with convexity it also makes the KKT conditions sufficient, so any KKT point is automatically a global minimizer. 

**Linear independence constraint qualification (LICQ)** (general). LICQ holds at a feasible $x^*$ if the active constraint gradients
$$
\{\nabla c_i(x^*) : c_i(x^*) = 0,\ i \in \mathcal{E} \cup \mathcal{I}\}
$$
are linearly independent. If LICQ holds at a local minimizer $x^*$, then $x^*$ satisfies the KKT conditions (and the multipliers $\lambda^*$ are unique). Unlike Slater's, LICQ is checked pointwise at a candidate $x^*$ and applies to nonconvex problems, but it delivers only necessity, not sufficiency. Revisiting the failure example: at $x^* = 0$ constraint $c_1$ is active with $\nabla c_1(0) = 0$, and the singleton $\{0\}$ is linearly dependent, so LICQ fails, consistent with KKT failing there.

### Second Order conditions

The KKT conditions are first-order and only necessary. As in unconstrained optimization, second-order (curvature) information sharpens them: it provides an extra necessary condition, and a genuine *sufficient* condition for local optimality.

Two ingredients recur:
- The relevant curvature is that of the **Lagrangian in $x$**, not $f$ alone: the **Hessian of the Lagrangian** $\nabla_{xx}^2 \mathcal{L}(x^*, \lambda^*) = \nabla^2 f(x^*) - \sum_{i \in \mathcal{E} \cup \mathcal{I}} \lambda_i^* \nabla^2 c_i(x^*)$. The multiplier terms correct for the way the constraints curve the feasible surface.
- We only measure curvature along **critical directions**: the directions $w$ that stay, to first order, on the constraints that actively pin $x^*$ down, namely $w^\top \nabla c_i(x^*) = 0$ for all $i \in \mathcal{E}$ and for all $i \in \mathcal{I}$ with $\lambda_i^* > 0$ (the *strongly active* inequalities). A weakly active inequality ($c_i(x^*) = 0$ but $\lambda_i^* = 0$) imposes no first-order restriction, so its direction is excluded from this set.

Second-order *necessary* condition.
- Intuition: at an unconstrained local minimizer the Hessian must be positive semidefinite, no direction may curve downward. The constrained version asks the same, but only of the Lagrangian and only along critical directions: moving along a critical direction stays feasible to first order, so if the Lagrangian curved downward there, we could decrease the objective while (nearly) respecting the constraints.
- Formally (NW Theorem 12.5): suppose $x^*$ is a local minimizer of $\inf\{f(x) : c_i(x) = 0\ \forall i \in \mathcal{E},\ c_i(x) \geq 0\ \forall i \in \mathcal{I}\}$ with $f$ and the $c_i$ twice continuously differentiable, and suppose Slater's condition holds or the LICQ holds at $x^*$. Let $\lambda^*$ be KKT multipliers. Then
	$$
	w^\top \left(\nabla^2 f(x^*) - \sum_{i \in \mathcal{E} \cup \mathcal{I}} \lambda_i^* \nabla^2 c_i(x^*)\right) w \geq 0
	$$
	for all $w \in \mathbb{R}^n$ with $w^\top \nabla c_i(x^*) = 0$ for all $i \in \mathcal{E}$ and all $i \in \mathcal{I}$ with $\lambda_i^* > 0$.

Second-order *sufficient* condition.
- Intuition: mirroring the unconstrained case (where $\nabla f = 0$ together with $\nabla^2 f \succ 0$ guarantees a strict local minimizer), we strengthen the semidefinite inequality to a strictly positive one over nonzero critical directions. This rules out flat and downhill directions, so the KKT point must sit at the bottom of a bowl along every feasible direction. We no longer need to assume $x^*$ is a minimizer, nor a constraint qualification: being a KKT point plus strict positive curvature is enough to *conclude* local minimality.
- Formally (NW Theorem 12.6): suppose $x^*$ is a feasible point with $f$ and the $c_i$ twice continuously differentiable, and let $\lambda^*$ be KKT multipliers for which the KKT conditions hold at $x^*$. Assume
	$$
	w^\top \left(\nabla^2 f(x^*) - \sum_{i \in \mathcal{E} \cup \mathcal{I}} \lambda_i^* \nabla^2 c_i(x^*)\right) w > 0
	$$
	for all $w \in \mathbb{R}^n \setminus \{0\}$ with $w^\top \nabla c_i(x^*) = 0$ for all $i \in \mathcal{E}$ and all $i \in \mathcal{I}$ with $\lambda_i^* > 0$. Then $x^*$ is a local minimizer.
- How it deviates from the necessary condition: the inequality is strict ($> 0$ instead of $\geq 0$) over the nonzero critical directions ($w \neq 0$), and the logic runs the other way, we assume a KKT point with the curvature condition and *derive* local minimality, rather than assuming a minimizer (with a constraint qualification) and deriving curvature.


### Roadmap for Constrained Minimizers

1. Find all **KKT points**.
2. Does **Slater's condition** hold (a convex problem with a strictly feasible point)?
	- **Yes**: every KKT point is a global optimal solution. Done.
	- **No**: the problem may be nonconvex, and minimizers can hide where a constraint qualification fails, so *also* collect every feasible point at which the LICQ does not hold (KKT may not flag these). The optimum lies among the KKT points and these non-LICQ points. Then:
		1. Does **Weierstrass' theorem** apply (continuous $f$ on a non-empty compact feasible set, see [[4. Multivariate Calculus#Extreme values]])?
			- **Yes**: a global minimizer exists and must be one of the collected candidates, so the candidate with the lowest $f$ is a global optimal solution.
			- **No**: try a case-specific argument for why the best candidate is optimal (e.g. coercivity of $f$, or behaviour of $f$ towards the boundary or infinity).

Example: finding the KKT points of
$$
\inf\ f(x) = x_1^2 + x_2^2 \quad \text{subject to}\quad c_1(x) = x_1 + x_2 - 2 \geq 0.
$$
1. **Write down the KKT system.** With $\nabla f(x) = (2x_1, 2x_2)$ and $\nabla c_1(x) = (1,1)$:
	- Stationarity: $2x_1 = \lambda_1$ and $2x_2 = \lambda_1$, so $x_1 = x_2 = \lambda_1/2$.
	- Primal feasibility: $x_1 + x_2 - 2 \geq 0$.
	- Dual feasibility: $\lambda_1 \geq 0$.
	- Complementary slackness: $\lambda_1 (x_1 + x_2 - 2) = 0$.
2. **Split on complementary slackness.** Either $\lambda_1 = 0$ or the constraint is active.
	- *Case $\lambda_1 = 0$*: stationarity gives $x = (0,0)$, but then $c_1(x) = -2 < 0$ violates primal feasibility. Rejected.
	- *Case $c_1(x) = 0$*: combine $x_1 = x_2 = \lambda_1/2$ with $x_1 + x_2 = 2$ to get $\lambda_1 = 2$ and $x = (1,1)$. This satisfies dual feasibility ($\lambda_1 = 2 \geq 0$) and primal feasibility ($c_1 = 0$). Accepted.
3. **Conclusion.** The unique KKT point is $x^* = (1,1)$ with $\lambda_1^* = 2$. The problem is convex ($f$ convex, $c_1$ affine) and Slater's condition holds (e.g. $x = (3,0)$ is strictly feasible), so by the next section this KKT point is the global optimal solution, with $f(x^*) = 2$.

### Perturbing Constraints

Beyond certifying optimality and pricing the dual problem, the Lagrange multipliers measure how much each constraint costs.

Formally, we perturb constraint $j$ by $\epsilon \neq 0$, that is, we replace $c_{j}(x) = 0$ by $c_{j}(x) = \epsilon$ (or $c_{j}(x) \geq 0$ by $c_{j}(x) \geq \epsilon$). We want to know how the optimal objective value changes as a consequence of this perturbation. Let $x^*$ be a local minimizer of the original problem with KKT multipliers $\lambda^*$, and let $x^*(\epsilon)$ be the local minimizer after the perturbation. 

1. For sufficiently small $\epsilon$, the set of active constraints does not change.
2. Constraint $j$ moves from being active at $0$ to being active at $\epsilon$, so $c_{j}(x^*)=-\epsilon$, which by first order Taylor approximation gives:
	$$
	\epsilon = c_{j}(x^*(\epsilon)) - c_{j}(x^*) \approx \nabla c_{j}(x^*)^\top[x^*(\epsilon) - x^*]
	$$
3. Every other active constraint $i \neq j$ is unmodified, thus $x^*(\epsilon)$ is not changed under the constraint either:
	$$
	0 = c_{i}(x^*(\epsilon)) - c_{i}(x^*) \approx \nabla c_{i}(x^*)^\top[x^*(\epsilon) - x^*]
	$$
4. First order Taylor approximation of the objective function gives:
	$$
	f(x^*(\epsilon)) - f(x^*) \approx \nabla f(x^*)^\top[x^*(\epsilon) - x^*]
	$$
5. Combine with stationarity (inactive constraints drop out since $\lambda_{i}^* = 0$ by complementary slackness):
	$$
	\nabla f(x^*)^\top[x^*(\epsilon) - x^*] = \sum_{i \in \mathcal{E}\cup\mathcal{I}}\lambda_{i}^*\,\nabla c_{i}(x^*)^\top[x^*(\epsilon) - x^*] = \lambda_{j}^*\,\epsilon
	$$

Conclusion: $\lambda_{j}^*$ measures the sensitivity of the optimal objective value to changes in the right-hand side of constraint $j$. Loosening constraint $j$ by $\epsilon$ changes the optimal value by approximately $\lambda_{j}^*\epsilon$. 

This also gives complementary slackness an economic meaning: an inactive inequality constraint has room to spare, so perturbing it slightly changes nothing. Its price must be zero.

### Duality

Having established when a KKT point is guaranteed to exist, and when one is guaranteed to be a minimizer, we turn to what the Lagrange multipliers themselves represent.

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
- If $(P)$ is convex, the dual objective $q$ is concave and its domain $\{\lambda : q(\lambda) > -\infty\}$ is convex, so the dual is itself a convex problem, maximizing a concave function over a convex set, even if the primal is hard. In fact $q$ is concave for any primal problem, convex or not: for fixed $x$, $\mathcal{L}(x,\lambda)$ is affine in $\lambda$, and a pointwise infimum of affine functions is concave.
- If $(P)$ is convex with optimal solution $x^*$, and $f$ and the $c_{i}$ are differentiable at $x^*$, then any $\lambda^*$ for which $(x^*, \lambda^*)$ is a KKT point is an optimal solution of $(D)$. Conversely, solving the often easier dual problem produces multipliers with which KKT points can be constructed and optimality can be proven.
- **Strong Duality**: suppose $(P)$ is convex. If Slater's condition holds for $(P)$, then $(D)$ has an optimal solution and $v(P) = v(D)$. Symmetrically, if Slater's condition holds for $(D)$, then $(P)$ has an optimal solution and $v(P) = v(D)$.
- Slater's condition matters, even for convex problems. Consider $\inf\{x : -x^2 \geq 0\}$, which is convex since $-x^2$ is concave, with feasible region $\{0\}$ and optimal value $0$, but no strictly feasible point exists. The dual function is:
	$$
	q(\lambda) = \inf_{x}\{x + \lambda x^2\} = \begin{cases}-\infty & \text{if } \lambda = 0 \\ -\frac{1}{4\lambda} & \text{if } \lambda > 0\end{cases}
	$$
	so $v(D) = \sup_{\lambda > 0} -\frac{1}{4\lambda} = 0 = v(P)$. The optimal values coincide, yet the supremum is not attained, so the dual problem has no optimal solution.


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

Derivation. Consider again the equality-constrained problem $\inf\{f(x) : c_{i}(x) = 0 \ \forall i \in \mathcal{E}\}$. By the sup-property of the Lagrangian (restricted to the equality constraints), this problem equals $\inf_{x}\sup_{\lambda}\mathcal{L}(x,\lambda)$. We could try to numerically minimize $g(x) = \sup_{\lambda}\mathcal{L}(x,\lambda)$ directly. But $g$ equals $f$ on the feasible region and $\infty$ everywhere else, so it is not continuous in $x$ and useless for numerical minimization.

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
This is exactly the Lagrangian, at the fixed estimate $\bar{\lambda}$, *augmented* with the quadratic penalty. Equivalently, it is the quadratic penalty function $Q(x,\mu)$ tilted by the multiplier term. Unlike $\sup_{\lambda}\mathcal{L}$, it is smooth in $x$ and can be minimized numerically.

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
- Reading the theorem: there are two knobs for improving the approximation of $x^*$: increasing $\mu_k$, which risks ill-conditioning as before, or improving the multiplier estimate $\lambda_k$. The second bound shows the multiplier update is a contraction once $\mu_k > M$: the estimates $\lambda_k$ converge to $\lambda^*$ on their own, dragging $x_k \to x^*$ along, all at a fixed and moderate $\mu$. The ill-conditioning problem is avoided.

### Interior Point Methods

The quadratic penalty and augmented Lagrangian methods approach the feasible region from the *outside*: their iterates are generally infeasible until convergence. **Interior point methods** (in their most basic form) do the opposite: all iterates stay strictly inside the feasible region, and a barrier prevents them from ever reaching its boundary.

- Setting: $\inf\{f(x) : x \in X\}$, where $f$ is convex and $X \subset \mathbb{R}^n$ is a convex set.
- A **barrier function** $\Phi$ for $X$ is a function such that:
	- the domain of $\Phi$ is the interior of $X$.
	- $\nabla^2\Phi(x) \succ 0$ for all $x \in \text{int}(X)$, that is $\Phi$ is strictly convex.
	- $\Phi(x) \to \infty$ as $x$ approaches the boundary of $X$.
- Common barriers:
	- For a ball-like set $\{x : t - \|x\|^2 \geq 0\}$ (with $t > 0$): $\Phi(x) = -\log(t - \|x\|^2)$.
	- For a polyhedron $\{x : a_{i}^\top x \leq b_{i},\ i = 1,\dots,m\}$: the logarithmic barrier $\Phi(x) = -\sum_{i=1}^m \log(b_{i} - a_{i}^\top x)$. Each term blows up as the slack $b_{i} - a_{i}^\top x$ of its constraint shrinks to zero.
	- For the positive semidefinite matrices $\{X : X \succeq 0\}$: $\Phi(X) = -\log(\det X)$, defined on the positive definite matrices (the interior of the set). Since $\det X$ is the product of the (positive) eigenvalues, $\det X \downarrow 0$ and hence $\Phi(X) \to \infty$ whenever an eigenvalue approaches zero.
- The method: pick a barrier parameter $\mu > 0$ and minimize the unconstrained function
	$$
	f(x) + \mu\,\Phi(x)
	$$
	with an unconstrained method, typically Newton's method, since the barrier is built to have a positive definite Hessian. Then decrease $\mu$ towards $0$ and repeat, warm-starting from the previous minimizer.
	- For large $\mu$, the barrier dominates and the minimizer sits safely in the interior. As $\mu \downarrow 0$, the objective takes over and the minimizers approach the constrained optimum, while every individual iterate remains strictly feasible.
- The curve of minimizers $\{x(\mu) : \mu > 0\}$, where $x(\mu) = \arg\min_x f(x) + \mu\Phi(x)$, is called the **central path**. Interior point methods effectively follow it towards $\mu \to 0$.
- Interior point methods efficiently solve several important classes of convex problems: linear programs (LP), convex quadratic programs (QP, for example portfolio optimization), second-order cone programs (SOCP, for example robust optimization), and semidefinite programs (SDP, for example approximation algorithms). Interior point methods are also one of the polynomial-time LP algorithms mentioned in [[Linear Optimisation#Klee-Minty Problem]].
- In practice, constrained problems are handed to off-the-shelf solvers, e.g. Gurobi or CBC for (mixed-integer) linear problems, Mosek or SDPT3/SeDuMi for convex conic problems, and BARON for non-convex problems. Such solvers typically guarantee global optimality.
