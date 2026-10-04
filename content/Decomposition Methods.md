---
tags:
  - mathematics/optimization
---
These notes are based on the 2026-2027 course FEM21040 Mathematical Programming at Erasmus School of Economics.

Notation may differ from [[Linear Optimisation]]. I aim to explain the differences whenever they occur.

### Column Generation

**Column generation** is a method for solving an LP with an extremely large amount of variables. We start with a smaller LP where only a few variables are included, and then repeatedly genera a new variable (column) with a positive reduced cost by solving an entirely separate optimization problem (called the **pricing problem**).

- Note: The [[Linear Optimisation#Revised Simplex Method|revised simplex method]] already improves upon the standard simplex method by not computing the entire dictionary, but just computing each reduced cost one by one until a positive reduced cost is found. Column generation goes even further by never even storing a list of all the variables and/or their constraint weights, and instead uses an entirely seperate optimization problem to directly determine the variable that has the maximal reduced cost, only then adding it to the LP.

Very many variables occur when:
- The problem is simply large.
- The Dantzig-Wolfe decomposition is used, which has exponentially many variables.
- A formulation with many variables is chosen because it is stronger, i.e. its LP relaxation gives a better bound.

The large LP to be solved is called the **master problem** (**MP**), with variables $N = \{1, \dots, n\}$, constraints $M = \{1, \dots, m\}$, and optimal value $z_{MP}$:
$$
z_{MP} = \max \Big\{ \sum_{i \in N} c_i x_i \mid \sum_{i \in N} a_{ij} x_i = b_j \ \forall j \in M,\ x_i \geq 0 \ \forall i \in N \Big\}
$$
- Notation: $i$ indexes variables and $j$ constraints, so $a_{ij}$ is the coefficient of $x_i$ in constraint $j$, which is $a_{ji}$ in [[Linear Optimisation]]. Furthermore, $N$ is the set of all variables, not the non-basis $\mathcal{N}$.

The **restricted master problem** (**RMP**) is the master problem with only a subset $N' \subset N$ of the variables:
$$
z_{RMP} = \max \Big\{ \sum_{i \in N'} c_i x_i \mid \sum_{i \in N'} a_{ij} x_i = b_j \ \forall j \in M,\ x_i \geq 0 \ \forall i \in N' \Big\}
$$
- $z_{RMP} \leq z_{MP}$, since an RMP solution is an MP solution with the missing variables set to $0$.
- Adding variables to $N'$ never decreases $z_{RMP}$. The algorithm stops when $z_{RMP} = z_{MP}$.

First we solve the RMP to optimality, and let $\lambda_j$, $j \in M$, be its optimal duals. The reduced cost of a variable $x_i$ in this case is:
$$
RC(x_i) = c_i - \sum_{j \in M} \lambda_j a_{ij}
$$
- Notation: $\lambda$ is $\mathbf{y}$ and $RC(x_i)$ is $r_i$ in [[Linear Optimisation#Revised Simplex Method|the revised simplex method]], so this is $r_j = c_j - \mathbf{y}^\top \hat{\mathbf{a}}_j$ there.

Every variable $x_i$, $i \in N$, now falls in one of three categories:
- **A**: in the basis of the optimal RMP solution.
- **B**: in the non-basis of the optimal RMP solution.
- **C**: not yet in the RMP ($i \in N \setminus N'$), thus non-basic.

The **pricing problem** is to find the non-basic variable (B or C) with maximum reduced cost, $\max_{\text{non-basic } x_i} RC(x_i)$.
- If the maximum is positive, this variable is added to the RMP.
- Otherwise no such variable exists, thus the current RMP solution is also optimal for the MP, so $z_{RMP} = z_{MP}$.

We can simplify the pricing problem using the following theorem.

Theorem: $\max_{\text{non-basic } x_i} RC(x_i) \leq 0$ if and only if $\max_{i \in N} RC(x_i) \leq 0$. So the pricing problem may optimize over all variables, without distinguishing basic and non-basic ones.
- _Proof_: variables in A have $RC(x_i) = 0$, as the reduced costs of the basic variables are $\mathbf{c}_{\mathcal{B}}^\top - \mathbf{c}_{\mathcal{B}}^\top B^{-1} B = \mathbf{0}^\top$. So $\max_{i \in N} RC(x_i) = \max\{0, \max_{\text{non-basic } x_i} RC(x_i)\} \leq 0$, if and only if $\max_{\text{non-basic } x_i} RC(x_i) \leq 0$.
- Variables in B have $RC(x_i) \leq 0$, since the RMP solution is optimal. So if the maximum is positive, the maximizer is always in C, i.e. a new variable.

A **pricing algorithm** is an algorithm that solves the pricing problem.
- The generic pricing algorithm lists all variables, computes all reduced costs, and picks the highest. This is exactly the simplex method, so nothing is gained.
- In many special cases the pricing problem has structure that a special purpose pricing algorithm can exploit. Modeling the pricing problem and developing a pricing algorithm are the crucial steps of a column generation algorithm.

Algorithm:
1. Initialize the RMP.
2. Solve the RMP, and obtain its optimal duals $\lambda$.
3. Solve the pricing problem.
4. If a variable with positive reduced cost is found, add the variable with the highest reduced cost to the RMP and return to step 2. Otherwise, stop.

### Example: Bin Packing

(TODO: add later)

### Computational Considerations

Initialization: the initial variables must give a feasible RMP.
- An **artificial variable** always works: choose its coefficients such that all constraints are satisfied, and give it a very unfavorable objective coefficient such that it is never part of an optimal solution.
- But it gives a poor initial solution, so column generation can take long and can become numerically unstable. In practice, initial variables are found using expert knowledge or a heuristic.

the pricing problem might be hard, and the pricing algorithm slow. A **pricing heuristic** is a pricing algorithm that does not guarantee optimality.
- If it finds a positive reduced cost variable, add it. If it fails, such a variable might still exist.
- Use it to accelerate pricing: first run the pricing heuristic (possibly several in sequence), and only if no positive reduced cost column is found, run an exact pricing algorithm. Ideally the exact algorithm runs only once, to verify that no positive reduced cost variable exists.
- A **column generation heuristic** uses only a pricing heuristic and terminates when it fails. It might stop too soon, so it only finds a lower bound $z_{RMP} \leq z_{MP}$.
	- If the MP is the LP relaxation of a MILP, this lower bound is not a valid relaxation bound, since $z_{RMP}$ may be below the optimal MILP value.

**Column management**: the number of columns in the RMP can grow too large. Examples of removing columns:
- Remove every column that was not part of an RMP solution for a given number of iterations.
- Remove every column whose reduced cost is far from zero, i.e. $RC(x_i) < -\alpha$ for some $\alpha \geq 0$.
- Removed columns can be stored in a **column pool**. Checking the column pool for positive reduced cost columns is itself a pricing heuristic.

### Row Generation

- **Row generation** applies when an LP has very many constraints, instead of very many variables.
- The [[Linear Optimisation#Duality|dual problem]] of such an LP has very many variables, so we can apply column generation to the dual problem.
- This is effectively row generation on the primal problem: solve the primal with only a subset of the constraints, and repeatedly add a constraint that the current solution violates.
	- Explanation: For the primal $\max \{ \sum_{i \in N} c_i x_i \mid \sum_{i \in N} a_{ij} x_i \leq b_j \ \forall j \in M,\ x \geq 0 \}$, the dual variable $\lambda_j$ has reduced cost $b_j - \sum_{i \in N} a_{ij} x_i$, where the duals of the restricted dual are the optimal primal solution $x$ of the restricted primal. The dual is a minimization, so we look for a negative reduced cost, which is exactly a primal constraint $j$ violated by $x$.

### Branch-and-Price

**Branch-and-price** is a [[Mathematical Optimization#Branch and Bound|branch-and-bound]] algorithm in which the LP relaxations are solved using column generation. It solves MILPs with very many variables.
- A branching rule for branch-and-price requires extra care, since branching affects both the LP relaxation and the pricing problem, and a different pricing algorithm might be needed.
- It is usually a bad idea to branch on the variables directly. Instead, avoid changes to the pricing problem when branching, so the same pricing algorithm can be used in all nodes of the branching tree.
