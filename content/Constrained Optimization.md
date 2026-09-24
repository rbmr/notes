---
tags:
  - mathematics/optimization
---

### Introduction

This document builds on:

- The topology of $\mathbb{R}^n$ (open balls; open, closed, bounded, and compact sets) and the theory of extreme values, both from [[Multivariate Calculus]].
- Basic linear algebra, in particular positive (semi)definiteness ($\succeq$, $\succ$) and eigenvalues. For a full list of relevant calculation rules and definitions see [[Matrix Calculation Rules Cheatsheet]].
- The general [[Mathematical Optimization|mathematical optimization problem]], and [[Convexity and Polyhedra#Convex Sets|Convex Sets]] and [[Convexity and Polyhedra#Convex Functions|Convex Functions]].
- [[Lagrangian Duality]], which is used to derive the KKT conditions.
- [[Unconstrained Optimization]], whose methods are reused as the inner solver by the numerical methods at the end of this document.

We phrase everything below in terms of minimization, the maximization case follows by negating $f$. From here on, $f$ and the $c_i$ are additionally assumed to be twice continuously differentiable, so that gradients and Hessians are fully defined and continuous everywhere.

### Constrained Optimization

A **constrained optimization problem** denotes the feasible set $X$ of a [[Mathematical Optimization|mathematical optimization problem]] formally using constraint functions:
$$
\begin{align}
\inf\ f(\mathbf{x}) & \\
\text{subject to } c_{i}(\mathbf{x})&=0 \quad \forall i \in \mathcal{E} \\
c_{i}(\mathbf{x})&\geq 0\quad \forall i  \in \mathcal{I}
\end{align}
$$
where $c_i$ are the constraint functions, and $\mathcal{E}$, $\mathcal{I}$ index the equality and inequality constraints respectively, giving $X=\{ \mathbf{x} \mid c_i(\mathbf{x})=0\ \forall i \in \mathcal{E},\ c_i(\mathbf{x})\geq 0\ \forall i \in \mathcal{I} \}$.

- A point $\mathbf{x}$ is **feasible** if it satisfies all constraints (i.e. $\mathbf{x} \in X$). The set of all feasible points is the **feasible region**.
- A feasible point is sometimes called a **solution**. A global minimizer is then called the **optimal solution**, and a local minimizer a **locally optimal solution**.

### Convex Optimization Problem

- A **convex optimization problem** is the special case of a constrained optimization problem above where global optimization becomes tractable: every local minimizer is automatically a global minimizer, and (under Slater's condition, see [[#Constraint Qualification]]) the KKT conditions become *sufficient*, not just necessary. Achieving this requires two things: a convex objective and a convex feasible region.
- Convexity of the objective is checked with the function rules from [[Convexity and Polyhedra#Convex Functions|Convex Functions]]. Convexity of the feasible region is built up from the constraints:
	- An **affine equality** $c_i(x) = a_i^\top x + b_i = 0$ defines a hyperplane, which is convex: it is the intersection of the two sublevel sets $\{c_i(x) \le 0\}$ and $\{-c_i(x) \le 0\}$ of the affine (hence convex) functions $\pm c_i$. A nonlinear equality generally does *not* define a convex set (e.g. $\|x\|^2 = 1$ is a sphere), which is why equalities must be affine.
	- A **concave inequality** $c_i(x) \ge 0$ defines a convex set: $c_i$ concave means $-c_i$ is convex, so $\{x : c_i(x) \ge 0\} = \{x : -c_i(x) \le 0\}$ is a sublevel set of a convex function.
	- The full feasible region is the [[Convexity and Polyhedra#Convex Sets|intersection]] of all these individual constraint sets, hence convex.
- Collecting the requirements, a constrained optimization problem is a convex optimization problem in this sense if:
	- the objective $f$ is convex,
	- the equality constraints are affine: $c_i(x) = a_i^\top x + b_i$ for some $a_i \in \mathbb{R}^n$, $b_i \in \mathbb{R}$, for all $i \in \mathcal{E}$,
	- the inequality constraints are concave: $-c_i$ is convex for all $i \in \mathcal{I}$ (so each $\{c_i(x) \ge 0\}$ is convex).
- **Abstract vs. practical definition**: the requirements above define the **practical** (or **standard form**) convex optimization problem, requiring the *functions* defining each constraint to individually be convex/concave/affine. A weaker **abstract** definition only requires the feasible region itself to be a convex set, however it is described. The practical definition is strictly stronger: a non-convex function can still define a convex feasible region, as long as all of its non-convexity happens outside the region cut out by the $\leq$ bound. The practical definition is what actually lets constrained-optimization algorithms work: they can exploit convexity of each constraint function directly, rather than relying on the (generally undecidable) fact that the resulting set happens to be convex.

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

A **constraint qualification** is a condition on the constraints that guarantees every local minimizer is a KKT point.

The weakest, exactly-necessary constraint qualifications are awkward to verify in practice. Instead we use two easy-to-check *sufficient* qualifications: Slater's condition and the linear independence constraint qualification (LICQ). Each, when it holds, guarantees KKT is necessary, neither is required in general.

Recall the **convex optimization problem** (see [[#Convex Optimization Problem]]): the objective $f$ is convex, the equality constraints are affine, and the inequality constraints are concave, which together make both the objective and the feasible region convex.

**Slater's condition** holds if there exists some *strictly feasible* point $\hat{x}$: $c_i(\hat{x}) = 0$ for all $i \in \mathcal{E}$ and $c_i(\hat{x}) > 0$ (strict) for all $i \in \mathcal{I}$. Slater's is a property of the whole problem (it needs one strictly feasible point), not of a particular candidate $x^*$.

Slater's condition, combined with the convexity of the constraints and objective function determine the guarantees the KKT conditions provide.
(todo: maybe add a proof here)

|                          | Non-Convex Constraints                    | Convex Constraints                                                                                       |
| ------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Non-Convex Objective** | Slater's condition provides no guarantees | Slater's  condition makes the KKT conditions **necessary** for every **local** minimizer.                |
| **Convex Objective**     | Slater's condition provides no guarantees | Slater's condition makes the KKT conditions **necessary AND sufficient** for every **global** minimizer. |

**Linear independence constraint qualification (LICQ)** (general). LICQ holds at a feasible $x^*$ if the active constraint gradients
$$
\{\nabla c_i(x^*) : c_i(x^*) = 0,\ i \in \mathcal{E} \cup \mathcal{I}\}
$$
are linearly independent. If LICQ holds at a local minimizer $x^*$, then $x^*$ satisfies the KKT conditions (and the multipliers $\lambda^*$ are unique). 

Differences: Unlike Slater's, LICQ needs to be checked at each candidate $x^*$ and applies to non-convex problems, but it delivers only necessity, not sufficiency.

### Second Order conditions

The KKT conditions are first-order and only necessary for local minima. As in unconstrained optimization, second-order (curvature) information can provide more guarantees: it provides an extra necessary condition, and a genuine sufficient condition for local optimality.

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
		1. Does **Weierstrass' theorem** apply (continuous $f$ on a non-empty compact feasible set, see [[Multivariate Calculus#Extreme values]])?
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

See [[Lagrangian Duality#Duality|Duality]] and [[Lagrangian Duality#Duality Theorems|Duality Theorems]] for what the Lagrange multipliers represent beyond stationarity, and for weak/strong duality.

### From Constrained to Unconstrained

Finding minimizers analytically via the KKT conditions can be a lot of work. The remaining sections answer a common question instead: how do we convert this constrained problem into a sequence of unconstrained problems, so we can reuse the machinery from [[Unconstrained Optimization]]? Quadratic Penalty, the Augmented Lagrangian Method, and Interior Point Methods are three different answers.

### Quadratic Penalty

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
- Problem: as $\mu$ grows, $Q(\cdot,\mu)$ becomes increasingly **ill-conditioned** (recall the condition number $\kappa$ from [[Unconstrained Optimization#Convergence Analysis]]): the penalty creates enormous curvature across the constraint surface but not along it. The inner unconstrained minimizations therefore become numerically hard exactly when high accuracy is needed most.

### Augmented Lagrangian Method

The augmented Lagrangian method repairs the quadratic penalty method: by additionally maintaining an estimate of the Lagrange multipliers, it can converge to the constrained minimizer *without* sending $\mu \to \infty$.

Derivation. Consider again the equality-constrained problem $\inf\{f(x) : c_{i}(x) = 0 \ \forall i \in \mathcal{E}\}$. By the [[Lagrangian Duality#Lagrangian Function|sup-property of the Lagrangian]] (restricted to the equality constraints), this problem equals $\inf_{x}\sup_{\lambda}\mathcal{L}(x,\lambda)$. We could try to numerically minimize $g(x) = \sup_{\lambda}\mathcal{L}(x,\lambda)$ directly. But $g$ equals $f$ on the feasible region and $\infty$ everywhere else, so it is not continuous in $x$ and useless for numerical minimization.

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
