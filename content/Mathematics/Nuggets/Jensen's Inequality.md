### Preliminary Knowledge

This note assumes familiarity with the definition of a convex function ([[Non-Linear Optimization#Convexity]]), the tangent-line/subgradient characterization of convexity ([[Non-Linear Optimization#Sub-differentials]]), and the expectation of a random variable ([[2. Univariate Random Variables#Expectation]]).

### Statement

**Jensen's inequality**: let $\phi: \mathbb{R} \to \mathbb{R}$ be convex, and let $X$ be a random variable such that both $E[X]$ and $E[\phi(X)]$ are finite. Then
$$
\phi(E[X]) \le E[\phi(X)]
$$
If $\phi$ is concave, the inequality reverses: $\phi(E[X]) \ge E[\phi(X)]$ (apply the convex case to $-\phi$).

Equality holds if and only if $\phi$ is affine on the support of $X$, or $X$ is almost surely constant.

Intuition: convexity means the graph of $\phi$ always curves upward relative to any of its tangent lines. Averaging the *inputs* first and then applying $\phi$ therefore lands you below (or on) what you get from applying the already-curved-upward $\phi$ to each input and then averaging.

### Proof

The proof is a direct consequence of the fact that a convex function lies entirely above any of its tangent (or supporting) lines.

1. Let $\mu = E[X]$. Since $\phi$ is convex, it has a subgradient $r \in \partial\phi(\mu)$ at $\mu$ (a single value $r=\phi'(\mu)$ if $\phi$ is differentiable there). By definition of a subgradient, the affine function $\ell(x) = \phi(\mu) + r(x-\mu)$ satisfies $\phi(x) \ge \ell(x)$ for every $x$.
2. Substitute the random variable $X$ for $x$: $\phi(X) \ge \phi(\mu) + r(X-\mu)$, an inequality between random variables that holds for every outcome.
3. Take expectations of both sides (expectation preserves $\ge$): $E[\phi(X)] \ge \phi(\mu) + r\big(E[X]-\mu\big)$.
4. Since $\mu = E[X]$, the last term vanishes: $E[\phi(X)] \ge \phi(\mu) = \phi(E[X])$.

### Two Standard Corollaries

- **Non-negativity of variance**: $x \mapsto x^2$ is convex, so $E[X^2] \ge (E[X])^2$, i.e. $\text{Var}(X) = E[X^2]-(E[X])^2 \ge 0$.
- **Log is concave**: since $\log$ is concave ($\frac{d^2}{dx^2}\log x = -\frac1{x^2} < 0$), Jensen's inequality gives $E[\log X] \le \log E[X]$ for any positive random variable $X$. This single inequality drives essentially every non-negativity result in information theory (relative entropy, mutual information) — see [[1. Entropy and Information Measures]].
