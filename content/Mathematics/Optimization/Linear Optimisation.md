These notes are based on the course FEB21009X Linear Optimisation at Erasmus School of Economics.

### Modeling

Components:
- **Decision Variables** are the variables used in the model.
- **Constraints** are the limits on the valid values for the decision variables. 
- An assignment of values to the decision variables is called a **solution**. If a solution satisfies the constraints it is called a **feasible solution**. The set of all feasible solutions is called the **feasible region**.
- **Objective function** assigns a real value to a solution meant to resemble the quality of the solution. The **optimal solution** is the feasible solution with the highest (or lowest) objective function value.

In **linear optimisation** (also called *linear programming*):
1. the objective function and all constraints are linear.
2. all decision variables are real.

A linear optimization problem can only have zero, exactly one, or infinitely many optimal solutions.

Any linear optimization problem falls in exactly one of the following three categories:
- At least one optimal solution exists.
- The feasible region is empty.
- The problem is **unbounded**. This means that the feasible region is nonempty, and the optimal objective value is not finite. Consequently, the optimal solution is undefined.
	- Specifically, a maximization problem is **unbounded** if for any number $M \in \mathbb{R}$, you can find a feasible solution whose objective value $z > M$. 
	- The equivalent definition for a minimization problem is trivial.

### Standard Form

There are many ways to model the exact same problem. 

The **standard form** is a specific way of writing the problem so that standardized algorithms can be applied. Specifically:
- The objective is a maximization problem.
- All constraints are less than or equal to inequalities ($\leq$).
- All variables are non-negative ($\geq 0$).

An LP problem with $n$ decision variables and $m$ constraints is written in standard form as follows:

|Notation | Entry-wise notation | Matrix Notation |
| ---|  --- | --- |
| Objective | $\max z = \sum_{j=1}^{n} c_j x_j$ | $z = \mathbf{c}^T \mathbf{x}$ |
| Constraints | $\sum_{j=1}^{n} a_{ij} x_j \le b_i \quad \text{for } i=1,...,m$ |  $A\mathbf{x} \le \mathbf{b}$ |
| Non-negativity | $x_j \ge 0 \quad \text{for } j=1,...,n$ | $\mathbf{x} \ge 0$ |

Any LP problem can be converted into standard form by applying a set of specific algebraic transformations:
- Minimization to Maximization: $\min z = \sum_{j=1}^{n} c_j x_j \rightarrow \max z' = \sum_{j=1}^{n} c_j' x_j$, where $c_j' = -c_j$, and $z' = -z$.
- Equality to Inequalities: Convert an equation like $\sum_{j=1}^{n} a_{ij} x_j = b_i$ into two separate inequality constraints $\sum_{j=1}^{n} a_{ij} x_j \le b_i$, $\sum_{j=1}^{n} a_{ij} x_j \ge b_i$.
- Geq ($\geq$) to Leq ($\leq$): $\sum_{j=1}^{n} a_{ij} x_j \ge b_i \rightarrow \sum_{j=1}^{n} (-a_{ij}) x_j \le -b_i$.
- Unconstrained / Free Variables: replace unbounded variables with the difference of two new, strictly non-negative variables: $x_j = x_j^+ - x_j^-$ where $x_j^+ \ge 0$ and $x_j^- \ge 0$. Specifically, $x_j^+ =\max\{0, x_j\}$, and $x_j^-=-\min\{0, x_j\}$.

### Vertices

- A point $x$ is called a **vertex** of a feasible region $P$ if $x$ is in $P$ and there are no two distinct points $x_{1}, x_{2}$ in $P$ such that $x = \alpha x_1 + (1-\alpha) x_2$ for some $0 < \alpha < 1$.
- A point $x$ is a **convex combination** of points $y_{1}, \dots, y_{n}$ if it can be written as $x = \sum_{i=1}^{n} \lambda_i y_i$ for some $\lambda_1 \ge 0, \dots, \lambda_n \ge 0$, where $\sum_{i=1}^{n} \lambda_i = 1$.
	- Any point in the feasible region is a convex combination of its vertices. Vertices are the unique points in the feasible region that cannot be written as a convex combination of any *other* points from the feasible region.
- Fundamental Theorem: If the feasible region of a linear programming problem is non-empty and bounded, then there exists a vertex at which the optimal objective value is attained.

### Extended Form

Basic definitions

- Any linear *inequality* can be converted into a linear *equality* using **slack variables** $s_{i}$. Any constraint $i$, $\sum_{j=1}^{n} a_{ij} x_j \le b_i$ becomes $\sum_{j=1}^{n} a_{ij} x_j + s_i = b_i$ where $s_i \ge 0$.
- If a slack variable is exactly zero, the corresponding constraint is active, meaning the current point is located directly on that constraint boundary.
- The **extended form** is a formulation of an LP problem that uses the original decision variables aswell as a slack variable for every original constraint. Consequently, the entire LP problem is defined using solely linear equalities.

Instead of $A$ and $\mathbf{c}$ we might use $A_{0}$ and $\mathbf{c}_{0}$ to indicate that we are dealing with the problem in standard form. We then free up $A$ and $\mathbf{c}$ to be used when writing the extended form in matrix notation.

- Suppose we have $n$ variables and $m$ constraints. 
- $\mathbf{x}_{0}$ and $\mathbf{c}_{0}$ are $n \times 1$ vectors, $A_{0}$ is an $m \times n$ matrix, and $\mathbf{b}$ is an $m \times 1$ vector. These define the components for the problem in standard form.
- We add the slack variables to the matrix notation as follows: $A = [A_{0} \ I_{m}]$, $\mathbf{x} =[\mathbf{x}_{0}^T \ \mathbf{x}_{s}^T]^T$, and $\mathbf{c} = [\mathbf{c}_{0}^T\ \mathbf{c}_{s}^T]^T$, with $\mathbf{c}_{s}=0$. These define the components for the problem in extended form.

| Form        | Standard Form                                            | Extended Form                                    |
| ----------- | -------------------------------------------------------- | ------------------------------------------------ |
| Objective   | $z = \max_{\mathbf{x}_0} \mathbf{c}_0^\top \mathbf{x}_0$ | $z=\max_{\mathbf{x}} \mathbf{c}^\top \mathbf{x}$ |
| Constraints | $A_0 \mathbf{x}_0 \le \mathbf{b}$                        | $A\mathbf{x} = \mathbf{b}$                       |
| Objective   | $\mathbf{x}_0 \ge 0$                                     | $\mathbf{x} \ge 0$                               |

### Dictionaries

- A dictionary of a linear program is established with a **basis** $\mathcal{B}$ and a **non-basis** $\mathcal{N} = \{1, \dots, n+m\} \setminus \mathcal{B}$. Variables inside the basis are called **basic variables**, and variables in the non-basis are called **non-basic variables**.
- A **dictionary** writes both the basic variables and the objective function as a linear combination of its non-basic variables added to a constant.
	- The basic variables are written as $x_{i} = \bar{b}_{i} - \sum_{j \in \mathcal{N}} \bar{a}_{ij}x_{j}$ for $i \in \mathcal{B}$.
	- The objective function is written as $z = w + \sum_{j \in \mathcal{N}} \bar{c}_{j}x_{j}$. 
	    - Here $w$ is the objective value of the basic solution.
	    - Here $\bar{c}_{j}$ is sometimes called the "reduced cost".
- The **basic solution** (**BS**) of a dictionary is the candidate solution created by setting all non-basic variables to 0. 
- Intuition: setting the $n$ non-basic variables to zero corresponds to stating your point lies on the intersection of the corresponding $n$ hyperplanes.
	- For each decision variable set to zero, the basic solution must lie on the hyperplane defined by the corresponding non-negativity constraint.
	- For each slack variable set to zero, the basic solution must lie exactly on the hyperplane defined by the corresponding linear constraint.
	- Crucially, not every basis corresponds to a valid dictionary. However, if and only if the basis DOES correspond to a valid dictionary, then the normal vectors corresponding to the $n$ hyperplanes are guaranteed to be linearly independent, and the hyperplanes intersect at the basic solution.
- Any basic solution of a dictionary is guaranteed to adhere to the linear constraints, but are not guaranteed to adhere to the non-negativity constraint.
- A **basic feasible solution** (**BFS**) is a basic solution where all basic variables are $\geq 0$, and is therefore feasible. 
- A dictionary that has a basic feasible solution is called **primal feasible**.
- Every vertex of a linear programming problem is the BFS of at least one dictionary. Any BFS corresponds to exactly one vertex. 
- The **initial dictionary** (or start dictionary) of a problem is typically formed by considering the problem in extended form, and choosing the slack variables as the basis and the original decision variables as the non-basis. 
	- The basic solution of this initial dictionary is the origin. This basic solution is not guaranteed to be feasible.

### Matrix Notation for Dictionaries

Consider the linear optimization problem in extended form:
$$
\begin{aligned} \max_{\mathbf{x}} \quad & \mathbf{c}^T \mathbf{x} \\ \text{s.t.} \quad & A\mathbf{x} = \mathbf{b} \\ & \mathbf{x} \ge 0 \end{aligned}
$$

Given a basis $\mathcal{B}$ (consisting of $m$ elements) and a corresponding non-basis $\mathcal{N} = \{ 1, \dots, n+m \} \setminus \mathcal{B}$ you can construct the corresponding dictionary from the extended form as follows:

1. Partition $\mathbf{x}$ into $\mathbf{x}_{\mathcal{B}} = (x_{j})_{j \in \mathcal{B}}$, and $\mathbf{x}_{\mathcal{N}} = (x_{j})_{j \in \mathcal{N}}$.
2. Partition $A$ into the $m \times m$ matrix $B$ consisting of the columns of $A$ associated with basic variables $\mathbf{x}_{\mathcal{B}}$ and the $m \times n$ matrix $A_{\mathcal{N}}$ consisting of columns associated with the non basic variables $\mathbf{x}_{\mathcal{N}}$ such that $A\mathbf{x} = B\mathbf{x}_{\mathcal{B}} + A_{\mathcal{N}}\mathbf{x_{\mathcal{N}}}$.
3. Partition $\mathbf{c}$ into $\mathbf{c}_{\mathcal{B}}=(\mathbf{c}_{j})_{j \in \mathcal{B}}$ and $\mathbf{c}_{\mathcal{N}}=(\mathbf{c}_{j})_{j \in \mathcal{N}}$ such that $z = \mathbf{c}_{\mathcal{B}}^T\mathbf{x}_{\mathcal{B}} + \mathbf{c}_{\mathcal{N}}^T\mathbf{x}_{\mathcal{N}}$.
4. The matrix representation of the dictionary then becomes:
	- $\mathbf{x}_{\mathcal{B}} = B^{-1}\mathbf{b} - B^{-1}A_{\mathcal{N}}\mathbf{x}_{\mathcal{N}}=\bar{\mathbf{b}} - \bar{A}\mathbf{x}_{\mathcal{N}}$
		- where $\bar{\mathbf{b}} = B^{-1}\mathbf{b}$, and $\bar{A} = B^{-1}A_{\mathcal{N}}$
	- $z = \mathbf{c}_{\mathcal{B}}^{\top}B^{-1}\mathbf{b} + (\mathbf{c}_{\mathcal{N}}^{\top} - \mathbf{c}_{\mathcal{B}}^{\top}B^{-1}A_{\mathcal{N}})\mathbf{x}_{\mathcal{N}} = w + \mathbf{r}^T\mathbf{x}_{\mathcal{N}}$
		- where the objective value of the current basic feasible solution is $w = \mathbf{c}_{\mathcal{B}}^{\top}B^{-1}\mathbf{b}$, and the **reduced costs** are $\mathbf{r}^T = \mathbf{c}_{\mathcal{N}}^{\top} - \mathbf{c}_{\mathcal{B}}^{\top}B^{-1}A_{\mathcal{N}}$.
	- Note: this requires the matrix $B$ corresponding to basis $\mathcal{B}$ to be invertible.
- Be aware of the use of shorthand.
	- $B$ is denoted instead of $A_{\mathcal{B}}$. 
	- $\mathbf{r}$ is denoted instead of $\bar{\mathbf{c}}_{\mathcal{N}}$.

We have shown that if the $B$ matrix corresponding to some basis $\mathcal{B}$ is invertible, then we can construct a valid dictionary. Next we want to show that if we have a valid dictionary with basis $\mathcal{B}$, then $B$ must be invertible.

1. Consider the dictionary associated with $\mathcal{B}$: 
	- $\mathbf{x}_{\mathcal{B}} = \bar{\mathbf{b}} - \bar{A}\mathbf{x}_{\mathcal{N}}$
	- $z = w + \mathbf{r}^T \mathbf{x}_{\mathcal{N}}$
2. Let $\mathbf{x}^*$ be the corresponding basic feasible solution, meaning $\mathbf{x}_{\mathcal{B}}^* = \bar{b}$ and $\mathbf{x}_{\mathcal{N}}^* = 0$.
3. Then $B \mathbf{x}_{\mathcal{B}}^* = B \mathbf{x}_{\mathcal{B}}^* + A_{\mathcal{N}} \mathbf{x}_{\mathcal{N}}^* = A \mathbf{x}^* = \mathbf{b}$.
4. Thus, the system of linear equations $B \mathbf{x}' = \mathbf{b}$ has the solution $\mathbf{x}' = \mathbf{x}_{\mathcal{B}}^*$.
5. Now, consider any solution $\mathbf{x}'$ to the homogeneous equation $B\mathbf{x}' = 0$.
6. Define a new vector $\tilde{\mathbf{x}}$ such that $\tilde{\mathbf{x}}_{\mathcal{B}} = \mathbf{x}_{\mathcal{B}}^* + \mathbf{x}'$ and $\tilde{\mathbf{x}}_{\mathcal{N}} = 0$.
7. Multiplying this by our constraints matrix gives $A\tilde{\mathbf{x}} = B\tilde{\mathbf{x}}_{\mathcal{B}} + A_{\mathcal{N}}\tilde{\mathbf{x}}_{\mathcal{N}} = B(\mathbf{x}_{\mathcal{B}}^* + \mathbf{x}') = B\mathbf{x}_{\mathcal{B}}^* + B\mathbf{x}' = \mathbf{b} + 0 = \mathbf{b}$.
8. Since $\tilde{\mathbf{x}}$ satisfies $A\tilde{\mathbf{x}} = \mathbf{b}$, it must also satisfy our dictionary constraint equation by the rules of the dictionary, meaning $\tilde{\mathbf{x}}_{\mathcal{B}} = \bar{\mathbf{b}} - \bar{A}\tilde{\mathbf{x}}_{\mathcal{N}}$.
9. Because $\tilde{\mathbf{x}}_{\mathcal{N}} = 0$, we conclude that $\tilde{\mathbf{x}}_{\mathcal{B}} = \bar{\mathbf{b}}$.
10. It follows that $\mathbf{x}' = \tilde{\mathbf{x}}_{\mathcal{B}} - \mathbf{x}_{\mathcal{B}}^* = \bar{\mathbf{b}} - \bar{\mathbf{b}} = 0$.
11. Thus, the unique solution to $B\mathbf{x}' = 0$ is $\mathbf{x}' = 0$, which proves that $B$ is an invertible matrix.

These statements combined show that a basis $\mathcal{B}$ yields a valid dictionary **if and only if** the corresponding $B$ matrix is invertible.

### Primal Simplex Method

- The main idea of the primal simplex method is to move from vertex to vertex with increasing objective function values until the optimal solution vertex is found.
- Every iteration of the primal simplex method corresponds to exactly one dictionary of which the basic feasible solution is a vertex of the feasible region. Moving from vertex to vertex is implemented by moving one variable from the non-basis to the basis, and vice versa.
- The **entering variable** is a non-basic variable with a positive coefficient in the objective row. It is selected to be increased, which geometrically translates to moving along an edge toward a new vertex with a better objective value. This variable becomes basic in the subsequent dictionary.
- The **bottleneck** is the constraint that limits the maximum amount the entering variable can increase without violating the non-negativity ($\ge 0$) requirements of the basic variables.
- The **leaving variable** is the basic variable corresponding to the bottleneck. This variable becomes non-basic in the subsequent dictionary.
- A dictionary is **optimal** when all coefficients in the objective row are non-positive, meaning no further improvements can be made. The basic feasible solution of the optimal dictionary is the optimal solution.

Formal Procedure:
1. **Initialization**: We start with a primal feasible dictionary.
2. **Select Entering Variable**: If all objective coefficients for the non-basic variables are $\le 0$ (i.e. no entering variable exists), then the dictionary is optimal and the algorithm stops, otherwise we select a new entering variable.
3. **Select Leaving Variable**: Find the bottleneck, and select the leaving variable.
4. **Update and Repeat**: Update the dictionary by replacing the bottleneck equation, putting the entering variable into the basis, and moving the leaving variable to the non-basis. Repeat from Step 2.

- Any feasible region has a finite number of vertices, therefore there exist only finitely many routes to optimality (although the number of routes grows exponentially in the number of vertices).
- Therefore, assuming cycling does not occur, the primal simplex method will always find an optimal solution in a finite number of steps.

### (1) Initialization

- For some problems, the initial dictionary determined directly from the extended form does not have a basic feasible solution.
- In such scenarios we first consider the auxiliary "Help" problem. 
	- We add an additional decision variable $x_{0}$ that loosens each of the constraints equally. Consequently the feasible region of this auxiliary problem is always non-empty, as you can simply increase $x_{0}$ to find a feasible solution.
	- We change the objective function to instead minimize $x_{0}$ (or maximize $-x_{0}$). If and only if the optimal objective value is $0$, then the feasible region of the original problem is non-empty.
- We can use the simplex method to solve Help. By the properties of the new decision variable, if the start dictionary is not immediately feasible (some $\bar{b}_{i} < 0$), we can create a start dictionary that IS feasible as follows:
	1. find the smallest $\bar{b}_{i}$
	2. let the corresponding basic variable $x_{i}$ leave the basis.
	3. have $x_{0}$ enter the basis.
	- From here, you can directly apply the simplex method.
- If you determine the Help problem has an optimal objective value of $0$, you can obtain a dictionary for the original problem as follows:
	1. Start with the optimal dictionary for the Help problem.
	2. Delete the $x_{0}$ column by setting $x_{0}$ to zero.
	3. Discard the objective row.
	4. Consider the objective row from the original problem. Eliminate the basic variables from it by substitution. Then add this new objective row back to the dictionary.
	5. The resulting dictionary will be a feasible dictionary of the original problem, allowing you to start the simplex method.
- This approach is called the two-phase simplex method.

### (2) Select Entering Variable

- The selected entering variable is called the **pivot**, and the action of selecting a pivot is called **pivoting**. The specific selection criteria used for selecting the pivot is called the **pivot rule**.
- **Smallest Index Rule**: selecting the variable with the smallest index that has a positive coefficient in the objective function.
- **Largest Coefficient Rule**: selecting the variable with the largest positive coefficient in the objective function.

### (3) Select Leaving Variable

- The goal is to determine the leaving variable, which is the first basic variable that restricts the entering variable from increasing. 
- We find the leaving variable using the **minimum ratio test**. 
	1. Consider each basic variable $x_{i}$ where the entering variable $x_{j}$ has a negative coefficient. Formally: $x_{i} = \bar{b}_{i} +\bar{a}_{ij}x_{j}+\dots$, where $\bar{a}_{ij} < 0$.
	2. Determine $q_{i} = \frac{\bar{b}_{i}}{|\bar{a}_{ij}|}$. The basic variable that yields the smallest ratio $q_{i}$ becomes the leaving variable as it is the first to hit zero.
- If there is a tie in the minimum ratio test, it means multiple basic variables will hit zero simultaneously. It is most common to pick the basic variable with the smallest index in this scenario.

### Degeneracy and Cycling

- One of the constant terms $\bar{b}_{i}$ in a dictionary can be zero, but then the associated basic variable $x_{i}$ is also zero in the corresponding basic feasible solution.
- A basic feasible solution is called **degenerate** if at least one of the basic variables has value zero. 
	- Presence of such solutions might cause iterations of the simplex method to not improve the objective value. As a result, the simplex method slows down or cannot terminate.
- The primal simplex method **cycles** if the same dictionary is encountered twice.
- For cycling to occur, degeneracy must be present in the problem.
- The simplex method does not terminate if and only if it cycles.
- The simplex method always terminates when applying the smallest index rule.

### Klee-Minty Problem

- The **Klee-Minty problem** is a specific linear programming formulation designed to demonstrate the worst-case performance of the simplex method.
- The problem can be generalized for $n$ variables as:
	- maximizing $z = \sum_{j=1}^{n} 10^{n-j} x_j$
	- subject to:
		- $\sum_{j=1}^{i-1} 2 \cdot 10^{i-j} x_j + x_i \le 100^{i-1}$ for $i=1,...,n$
		- $x_j \ge 0$ for $j=1,...,n$.
- When solving this formulation using the simplex method and applying the smallest index rule, the algorithm visits every single vertex of the feasible region.
- Consequently, the simplex method solves a Klee-Minty problem with $n$ variables in exactly $2^n - 1$ iterations.  
- Algorithms that always terminate within polynomial time do exist (such as the ellipsoid method and interior point method). However, performing better in the worst case does not mean they perform better on average. 

### Duality

- Any linear combination of linear inequalities (where the coefficients of the linear combination are non-negative) gives another linear inequality that is also valid. 
- By the fact that the decision variables are non-negative $x_{i} \geq 0$,  you can use these linear combinations of linear inequalities as upper bounds on the objective function.
- An upper bound is better if it is smaller. We want to find the best upper bound. We can define the problem of finding the tightest upper bound as another LP problem.
- This related LP problem is called the **dual problem**, the original problem is then called the **primal problem**. By construction, the optimal objective value of the dual problem is a valid upper bound on the optimal objective value of the primal problem.
- In general a primal problem is denoted using $(P)$, and its corresponding dual problem as $(D)$. The optimal objective function values are then denoted using $v(P)$ and $v(D)$ respectively.
- The dual of the dual is the primal problem.

| Notation   | Primal                                                                                                                                                                                 | Dual                                                                                                                                                                                       |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Entry-wise | $$\begin{aligned}\max \quad & \sum_{j=1}^{n} c_j x_j \\\text{s.t.} \quad & \sum_{j=1}^{n} a_{ij} x_j \le b_i \quad 1 \le i \le m \\& x_j \ge 0 \quad 1 \le j \le n\end{aligned}$$      | $$\begin{aligned}\min \quad & \sum_{i=1}^{m} b_i y_i \\\text{s.t.} \quad & \sum_{i=1}^{m} a_{ij} y_i \ge c_j \quad 1 \le j \le n \\& y_i \ge 0 \quad 1 \le i \le m\end{aligned}$$          |
| Vector     | $$\begin{aligned}\max \quad & \mathbf{c} \cdot \mathbf{x} \\\text{s.t.} \quad & \mathbf{a}_i \cdot \mathbf{x} \le b_i \quad 1 \le i \le m \\& \mathbf{x} \ge \mathbf{0}\end{aligned}$$ | $$\begin{aligned}\min \quad & \mathbf{b} \cdot \mathbf{y} \\\text{s.t.} \quad & \mathbf{a}_j^{T} \cdot \mathbf{y} \ge c_j \quad 1 \le j \le n \\& \mathbf{y} \ge \mathbf{0}\end{aligned}$$ |
| Matrix     | $$\begin{aligned} \max \quad & \mathbf{c}^T \mathbf{x} \\ \text{s.t.} \quad & A\mathbf{x} \le \mathbf{b} \\ & \mathbf{x} \ge 0 \end{aligned}$$                                         | $$ \begin{aligned} \min \quad & \mathbf{b}^T \mathbf{y} \\ \text{s.t.} \quad & A^T \mathbf{y} \ge \mathbf{c} \\ & \mathbf{y} \ge 0 \end{aligned} $$                                        |

Or using the subscript $0$ and $s$ to distinguish between standard form and extended form we get.
 
| Notation                | **Primal**                                                                                                                                                                  | **Dual**                                                                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Without slack variables | $$\begin{aligned} \max_{\mathbf{x}_0} \quad & \mathbf{c}_0^\top \mathbf{x}_0 \\ \text{s.t.} \quad & A_0 \mathbf{x}_0 \le \mathbf{b} \\ & \mathbf{x}_0 \ge 0 \end{aligned}$$ | $$\begin{aligned} \min_{\mathbf{y}_{0}} \quad & \mathbf{b}^\top \mathbf{y}_{0} \\ \text{s.t.} \quad & A_0^\top \mathbf{y}_{0} \ge \mathbf{c}_0 \\ & \mathbf{y}_{0} \ge 0 \end{aligned}$$ |
| With slack variables    | $$\begin{aligned} \max_{\mathbf{x}} \quad & \mathbf{c}^\top \mathbf{x} \\ \text{s.t.} \quad & A\mathbf{x} = \mathbf{b} \\ & \mathbf{x} \ge 0 \end{aligned}$$                | $$\begin{aligned} \min_{\mathbf{y}_{0}} \quad & \mathbf{b}^\top \mathbf{y}_{0} \\ \text{s.t.} \quad & A^\top \mathbf{y}_{0} \ge \mathbf{c} \end{aligned}$$                               |

The rewrite for the dual is explained as follows:
$$
A^\top \mathbf{y}_{0} \ge \mathbf{c} \iff \begin{bmatrix}A_{0}^T \\ I_{m}\end{bmatrix} \mathbf{y}_{0} \ge \begin{bmatrix}\mathbf{c}_{0} \\ \mathbf{c}_{s}\end{bmatrix} \iff A_{0}^\top \mathbf{y}_{0} \geq \mathbf{c}_{0} \land \mathbf{y}_{0} \geq 0
$$

Furthermore, if we define the slack variables for the dual as $\mathbf{y_{s}}$, and set $\mathbf{y}=[\mathbf{y_{0}^{\top}\ \mathbf{y}_{s}^{\top}}]^{\top}$ This gives the extended form of the dual as:
$$\begin{aligned} \min_{\mathbf{y}_{0}} \quad & \mathbf{b}^\top \mathbf{y}_{0} \\ \text{s.t.} \quad & \begin{bmatrix} A_0^\top & -I \end{bmatrix} \mathbf{y} = \mathbf{c}_0 \\ & \mathbf{y} \ge \mathbf{0} \end{aligned}$$

### Duality Theorems

- **Weak Duality Theorem**: Let $\mathbf{x}$ and $\mathbf{y}$ be feasible solutions of a linear programming problem $(P)$ and its dual $(D)$ respectively, then $\mathbf{c}^{T}\mathbf{x} \leq \mathbf{b}^{T} \mathbf{y}$.  
- By the weak duality theorem, if the primal problem is unbounded, then the feasible region of the dual problem is empty. 
- **Strong Duality Theorem**: If $(P)$ has an optimal solution $\mathbf{x}^{*}$, then also the dual problem $(D)$ has an optimal solution $\mathbf{y}^*$, and their optimal objective values are equivalent: $v(P)=\mathbf{c}^T\mathbf{x}^*=\mathbf{b}^T\mathbf{y}^*=v(D)$.
- By the strong duality theorem, and because the dual of the dual is the primal problem, we obtain that the primal problem has an optimal solution if and only if the dual problem has an optimal solution.

The following table shows which situations may occur. Y means the situation may occur, whereas N means situations may not occur.

| Primal \ Dual | optimal | empty | unbounded |
| :------------ | :-----: | :----: | :------: |
| **optimal**   |    Y    |   N   |     N     |
| **empty**     |    N    |   Y   |     Y     |
| **unbounded** |    N    |   Y   |     N     |

### Weak Duality Proof

Proof outline: assume you have a feasible solution for the primal and the dual. Show that the objective value for the dual is greater than or equal that of the primal.

1. Because $\mathbf{x}$ is primal feasible, we know $A_{0}\mathbf{x} \le \mathbf{b}$ and $\mathbf{x} \ge 0$.  
2. Because $\mathbf{y}$ is dual feasible, we know $A_{0}^{T}\mathbf{y} \ge \mathbf{c}_{0}$ and $\mathbf{y} \ge 0$.
3. Since the dual constraint tells us $\mathbf{c}_{0} \le A_{0}^{T}\mathbf{y}$, and $\mathbf{x}$ is non-negative, we can substitute the constraint yielding: $\mathbf{c}_{0}^{T}\mathbf{x} \le (A_{0}^{T}\mathbf{y})^{T}\mathbf{x}$.
4. This simplifies to: $\mathbf{c}_{0}^{T}\mathbf{x} \le \mathbf{y}^{T}A_{0}\mathbf{x}$.
5. Since the primal constraint tells us $A_{0}\mathbf{x} \le \mathbf{b}$, and $\mathbf{y}$ is non-negative, we can substitute the constraint yielding: $\mathbf{y}^{T}A_{0}\mathbf{x} \le \mathbf{y}^{T}\mathbf{b}$.
6. By chaining these together, we show weak duality: $\mathbf{c}_{0}^{T}\mathbf{x} \le \mathbf{y}^{T}A_{0}\mathbf{x} \le \mathbf{y}^{T}\mathbf{b}$.

### Strong Duality Proof

Proof outline: start by assuming we have an optimal solution for the primal problem, then construct a solution for the dual problem that is both feasible and optimal, and show the objective function values are equal.

1. Suppose we have primal problem $(P)$ in extended form:
	$$
	\begin{aligned} \max \quad & \mathbf{c}^T \mathbf{x} \\ \text{s.t.} \quad & A\mathbf{x} = \mathbf{b} \\ & \mathbf{x} \ge 0 \end{aligned}
	$$ 
	where $A = [A_{0} \ I_{m}]$, $\mathbf{x} =[\mathbf{x}_{0}^T \ \mathbf{x}_{s}^T]^T$, and $\mathbf{c} = [\mathbf{c}_{0}^T\ \mathbf{c}_{s}^T]^T$, with $\mathbf{c}_{s}=0$.
2. We assume this problem has an optimal solution. Consequently, the simplex method eventually reaches the optimal dictionary for some basis $\mathcal{B}$:
	1.  $\mathbf{x}_{\mathcal{B}} = \bar{\mathbf{b}} - \bar{A}\mathbf{x}_{\mathcal{N}}$
	2. $z = z^* + \mathbf{r}^T \mathbf{x}_{\mathcal{N}}$
	- Here, $z^*$ is the optimal objective value,  $\mathcal{N}$ is the non-basis, and all reduced costs $\mathbf{r}$ are non-positive ($\mathbf{r} \leq 0$). 
3. We define a full reduced cost vector $\bar{\mathbf{c}}$ for all variables. We assign a reduced cost of zero to the basic variables ($\bar{\mathbf{c}}_{\mathcal{B}} = 0$) and use our non-positive reduced costs for the non-basic variables ($\bar{\mathbf{c}}_{\mathcal{N}} = \mathbf{r}$). Consequently, $\mathbf{c}^T \mathbf{x} = z^* + \bar{\mathbf{c}}^T \mathbf{x}$.
4. We partition our vectors into the original decision variables (subscript $0$) and the slack variables (subscript $s$): $\mathbf{x} = [\mathbf{x}_0^T, \mathbf{x}_s^T]^T$ and $\bar{\mathbf{c}} = [\bar{\mathbf{c}}_0^T, \bar{\mathbf{c}}_s^T]^T$. This gives:
	 $$
	 \mathbf{c}_0^T \mathbf{x}_0=z^* + \bar{\mathbf{c}}_0^T \mathbf{x}_0 + \bar{\mathbf{c}}_s^T\mathbf{x}_{s}
	$$
5. We substitute the definition of the slack variables, and regroup terms:
	$$
	\mathbf{c}_0^T \mathbf{x}_0 = z^* + \bar{\mathbf{c}}_0^T \mathbf{x}_0 + \bar{\mathbf{c}}_s^T(\mathbf{b} - A_0 \mathbf{x}_0) = (z^* + \bar{\mathbf{c}}_s^T \mathbf{b}) + (\bar{\mathbf{c}}_0 - A_0^T \bar{\mathbf{c}}_s)^T \mathbf{x}_0
	$$
6. For this equation to hold true for any vector $\mathbf{x}_{0}$, the following must be true:
	- $\mathbf{c}_0 = \bar{\mathbf{c}}_0 - A_0^T \bar{\mathbf{c}}_s$
	- $0 = z^* + \bar{\mathbf{c}}_s^T \mathbf{b}$
7. We propose the dual candidate solution: $\mathbf{y}^* = -\bar{\mathbf{c}}_s$. 
8. Because we are at the optimal dictionary, we know that $\bar{\mathbf{c}} \le 0$, which means $\bar{\mathbf{c}}_s \le 0$, and our candidate solution is non-negative: $\mathbf{y}^* \ge 0$.
9. Next, we verify if $\mathbf{y}^*$ satisfies the other constraints of the dual problem. Substituting $\mathbf{y}^*$ into the first equation established in Step 6 yields:
	$$
	\mathbf{c}_0 = \bar{\mathbf{c}}_0 + A_0^T \mathbf{y}^*
	$$
	Rearranging gives $A_0^T \mathbf{y}^* = \mathbf{c}_0 - \bar{\mathbf{c}}_0$. Since $\bar{\mathbf{c}}_0 \le 0$, subtracting it can only increase or maintain the value of the right side, meaning $A_0^T \mathbf{y}^* \ge \mathbf{c}_0$. 
10. Because $\mathbf{y}^* \ge 0$ (per 8.) and $A_0^T \mathbf{y}^* \ge \mathbf{c}_0$ (per 9.), we have proven that $\mathbf{y}^*$ is a feasible solution for the dual problem.
11. We now determine the objective value of this dual feasible solution by substituting $\mathbf{y}^*$ into the second equation from Step 6:
	$$
	0 = z^* - (\mathbf{y}^*)^T \mathbf{b} \implies z^* = \mathbf{b}^T \mathbf{y}^*
	$$
12. By the weak duality theorem, $\mathbf{c}^{T}\mathbf{x} \leq \mathbf{b}^{T} \mathbf{y}$. Furthermore, our dual feasible solution $\mathbf{y}^*$ achieves an objective value ($\mathbf{b}^T \mathbf{y}^*$) that perfectly equals the optimal primal objective value $z^*$. Consequently, it is impossible for the dual to achieve a better (smaller) value. Therefore, $\mathbf{y}^*$ is the optimal dual solution, and $v(P) = v(D)$.

### Candidate Solutions and Feasibility

- Recall that a dictionary with a basic feasible solution is called primal feasible.
- Also recall that we determined the dual candidate solution from the dictionary using $\hat{\mathbf{y}} = -\bar{\mathbf{c}}_s$. We will show $\hat{\mathbf{y}}^\top = \mathbf{c}_{\mathcal{B}}^\top B^{-1}$.
	1. $\hat{\mathbf{y}} = -\bar{\mathbf{c}}_s$ means $\hat{y}_{i} = 0$ if the slack variable $x_{n+i}$ is basic, and $\hat{y}_{i} = -(\mathbf{c}_{\mathcal{N}}^\top - \mathbf{c}_{\mathcal{B}}^\top B^{-1} A_{\mathcal{N}})_k$ if the slack variable $x_{n+i}$ is the $k$-th non-basic variable. 
	2. Let $\mathbf{e}_{i}$ be the column corresponding to $x_{n+i}$ in $A$, and note that its objective coefficient is $c_{n+i} = 0$.
	3. Case 1 ($x_{n+i}$ is non-basic): Because $n+i \in \mathcal{N}$, $\mathbf{e}_{i}$ is a column of $A_{\mathcal{N}}$. The entry corresponding to $x_{n+i}$ in the reduced cost vector $-\bar{\mathbf{c}}_{s}$ is $c_{n+i} - \mathbf{c}_{\mathcal{B}}^\top B^{-1} \mathbf{e}_{i} = 0 - (\mathbf{c}_{\mathcal{B}}^\top B^{-1})_{i}$. Therefore, $\hat{y}_{i} = -(0 - (\mathbf{c}_{\mathcal{B}}^\top B^{-1})_{i}) = (\mathbf{c}_{\mathcal{B}}^\top B^{-1})_{i}$.  
	4. Case 2 ($x_{n+i}$ is basic): Because $n+i \in \mathcal{B}$, $\mathbf{e}_{i}$ is a column of $B$. If $n+i$ is the $k$-th entry in the basis $B$, then $B \mathbf{e}_{k} = \mathbf{e}_{i}$. This implies that $B^{-1} \mathbf{e}_{i} = \mathbf{e}_{k}$. Since $c_{n+i} = 0$ is the $k$-th entry in $\mathbf{c}_{\mathcal{B}}$, it follows that $\mathbf{c}_{\mathcal{B}}^\top B^{-1} \mathbf{e}_{i} = \mathbf{c}_{\mathcal{B}}^\top \mathbf{e}_{k} = 0$. Thus, $\hat{y}_{i} = 0 = (\mathbf{c}_{\mathcal{B}}^\top B^{-1})_{i}$.
	5. Since $\hat{y}_{i} = (\mathbf{c}_{\mathcal{B}}^\top B^{-1})_{i}$ evaluates as true in both scenarios, it follows that $\hat{\mathbf{y}}^\top = \mathbf{c}_{\mathcal{B}}^\top B^{-1}$.
- If this dual candidate solution $\hat{\mathbf{y}}$ is feasible, then the dictionary is called **dual feasible**. We will show that the candidate solution $\hat{\mathbf{y}}^\top = \mathbf{c}_{\mathcal{B}}^\top B^{-1}$ being feasible $A^\top \hat{\mathbf{y}} \geq \mathbf{c}$ is equivalent to the simplex stopping condition $(\mathbf{c}_{\mathcal{N}}^{\top} - \mathbf{c}_{\mathcal{B}}^{\top}B^{-1}A_{\mathcal{N}}) \leq 0$.
	1. First we rearrange the feasibility condition $\hat{\mathbf{y}}^\top A \ge \mathbf{c}^\top$.
	2. Next, we split the condition into basic and non-basic variables:
		1. $\hat{\mathbf{y}}^\top A_{\mathcal{N}} \ge \mathbf{c}_{\mathcal{N}}^\top$
		2. $\hat{\mathbf{y}}^\top B \ge \mathbf{c}_{\mathcal{B}}^\top$ 
	3. The second inequality is always true for our candidate solution $\hat{\mathbf{y}}^\top B = \mathbf{c}_{\mathcal{B}}^\top B^{-1}B =\mathbf{c}_{\mathcal{B}}^\top$.
	4. Substituting the candidate solution in the first inequality gives another inequality $\hat{\mathbf{y}}^\top A_{\mathcal{N}}= \mathbf{c}_{\mathcal{B}}^\top B^{-1} A_{\mathcal{N}} \ge \mathbf{c}_{\mathcal{N}}^\top$. 
	5. Rearranging this gives the simplex stopping criterion: $\mathbf{c}_{\mathcal{N}}^{\top} - \mathbf{c}_{\mathcal{B}}^{\top}B^{-1}A_{\mathcal{N}} \leq 0$.
	- This shows the simplex stopping criterion is equivalent to our candidate dual solution being feasible.
- Consequently, a dictionary is optimal, if and only if its both primal AND dual feasible. 
	- Proof: If a dictionary is optimal, it must be primal feasible, and it must satisfy the stopping criterion for the primal simplex method. As shown above, this stopping criterion is strictly equivalent to dual feasibility. Conversely, if a dictionary is both primal and dual feasible, it inherently satisfies the stopping criteria for the primal simplex method, meaning it must be optimal.

### Complementary Slackness

- **Complementary slackness** (without slack variables): Given some primal feasible vector $x^* = (x_1^*, ..., x_n^*)$ and dual feasible vector $y^* = (y_1^*, ..., y_m^*)$, these vectors are the optimal solutions for their respective problems if and only if both conditions are met:
    1. $x_j^*(c_j - \sum_{i=1}^m a_{ij}y_i^*) = 0$ for $1 \le j \le n$
    2. $y_i^*(b_i - \sum_{j=1}^n a_{ij}x_j^*) = 0$ for $1 \le i \le m$
- **Complementary slackness** (with slack variables): Given some primal feasible vector $x^* = (x_1^*, ..., x_n^*, x^*_{n+1}, \dots, x^{*}_{n+m})$ and dual feasible vector $y^* = (y_1^*, ..., y_m^*, y_{m+1}^*, \dots, y_{m + n}^*)$, these vectors are the optimal solutions for their respective problems if and only if both conditions are met:
	1. $x_j^*y_{m+j}^* = 0$ for $1 \le j \le n$
	2. $y_i^*x_{n+i}^* = 0$ for $1 \le i \le m$
- Interpretation: every decision variable in the primal problem is paired with a specific constraint in the dual problem, and vice versa. Complementary slackness states that for every single one of these pairs, at least one of them must be "tight". This means the decision variable is zero, or the corresponding constraint in the other problem holds as an exact equality (the slack is zero).
- You can determine whether a vector $x^*$ is the optimal solution by constructing $y^*$ according to the slackness relations, and verifying whether $y^*$ is feasible. Example:
	1. First determine if $x^*$ is feasible. If not, its not the optimal solution.
	2. Is $x^*$ is feasible, construct a system of linear equations based on the complementary slackness relations.
		1. If a primal constraint has slack (meaning $\sum_{j=1}^{n}a_{ij}x_{j}^{*}<b_{i}$), set the corresponding dual variable to zero: $y_{i}^{*}=0$.
		2. If a primal decision variable is strictly positive (meaning $x_{j}^{*}>0$), force its corresponding dual constraint to be tight: $\sum_{i=1}^{m}a_{ij}y_{i}^{*}=c_{j}$.
	3. Determine the solution $y^*$ for the system of equations you just constructed.
	4. If $y^*$ is not dual feasible, then $x^*$ is not the optimal solution. 
	5. If $y^*$ is dual feasible, then $x^*$ is the primal optimal solution, and $y^*$ the dual optimal solution. 
- The complementary slackness conditions form the basis of the **primal-dual simplex method**. This algorithm, which actively tries to find primal and dual feasible vectors that satisfy these exact conditions, can be significantly faster than the standard primal simplex method for specific problem classes like network flow problems.

### Complementary Slackness Proof

Part 1: If $x^*$ and $y^*$ are optimal, then the complementary slackness conditions hold.

1. Assume $x^*$, and $y^*$ are the optimal primal and dual solutions respectively.
2. According to the strong duality theorem, their optimal objective values must be equal, meaning $c_0^T x^* = b^T y^*$ .
3. According to the weak duality theorem, we know that the "bridge" inequality $c_0^T x^* \le (y^*)^T A_0 x^* \le b^T y^*$ must hold for any feasible solutions.
4. Because the left and right sides of this inequality are equal at optimality, the inequality collapses, giving us: $c_0^T x^* = (y^*)^T A_0 x^* = b^T y^*$.  
5. We can split this continuous equality into two separate equations to discover our conditions:
	- The Dual Condition: $c_0^T x^* = (x^*)^T A_0^T y^* \implies (x^*)^T (c_0 - A_0^T y^*) = 0$
	- The Primal Condition: $b^T y^* = (y^*)^T A_0 x^* \implies (y^*)^T (b - A_0 x^*) = 0$
- This shows the dot products of the vectors are always zero. However, we must still show that the element wise products are always zero. 
	- From primal feasibility, we know $x_j^* \ge 0$. From dual feasibility ($A_0^T y^* \ge c_0$), we know the slack limits are non-positive: $(c_j - \sum_{i=1}^m a_{ij}y_i^*) \le 0$. Therefore, every term in the summation $\sum_{j=1}^n x_j^*(c_j - \sum_{i=1}^m a_{ij}y_i^*)$ is $\le 0$.  
	- From dual feasibility, we know $y_i^* \ge 0$. From primal feasibility ($A_0 x^* \le b$), we know the slack limits are non-negative: $(b_i - \sum_{j=1}^n a_{ij}x_j^*) \ge 0$. Therefore, every term in the summation $\sum_{i=1}^m y_i^*(b_i - \sum_{j=1}^n a_{ij}x_j^*)$ is $\ge 0$.
- The only mathematical way for a sum of entirely non-positive numbers (or entirely non-negative numbers) to equal exactly zero is if every individual term is independently zero.  
- This shows the complementary slack conditions hold:
	1. $x_j^*(c_j - \sum_{i=1}^m a_{ij}y_i^*) = 0$ for all $1 \le j \le n$
	2. $y_i^*(b_i - \sum_{j=1}^n a_{ij}x_j^*) = 0$ for all $1 \le i \le m$

Part 2: If the complementary slackness conditions hold, then $x^*$ and $y^*$ are optimal.

1. Assume we have some primal feasible $x^*$ and dual feasible $y^*$ where our two complementary slackness conditions hold true.  
2. If we sum the first condition over all $j$, we get $\sum_{j=1}^n x_j^*(c_j - \sum_{i=1}^m a_{ij}y_i^*) = 0$, which translates to the vector notation $c_0^T x^* = (x^*)^T A_0^T y^*$.
3. If we sum the second condition over all $i$, we get $\sum_{i=1}^m y_i^*(b_i - \sum_{j=1}^n a_{ij}x_j^*) = 0$, which translates to the vector notation $b^T y^* = (y^*)^T A_0 x^*$.  
4. We then connect 2, and 3 together: $c_0^T x^*= (x^*)^T A_0^T y^*= (y^*)^T A_0 x^* = b^T y^*$.
5. According to the weak duality theorem, the primal objective can never exceed the dual objective: $c_0^T x^* \le b^T y^*$. Therefore, neither the primal nor the dual solution can be improved further without violating weak duality. This shows $x^*$ and $y^*$ are definitively proven to be the optimal solutions.

### Revised Simplex Method

Idea: Instead of computing the entire dictionary, we compute only the necessary parts of each dictionary in the primal simplex method.

Algorithm:
1. Construct matrices $B$, $A_{\mathcal{N}}$, and vectors $\mathbf{c}_{\mathcal{B}}$, and $\mathbf{c}_{\mathcal{N}}$.
2. Determine the entering variable using the smallest index rule. 
	1. We compute the reduced cost $r_{j}$ for each $j \in \mathcal{N}$ one by one starting from the non-basic variable with the smallest index. $r_{j}=c_{j}-\mathbf{c}_{\mathcal{B}}^\top B^{-1} \hat{\mathbf{a}}_{j}= c_{j}- \mathbf{y}^\top \hat{\mathbf{a}}_{j}$. 
	2. Since $B^{-1}$ is difficult to compute, we instead determine $\mathbf{y}$ as the solution to the system of equations $B^\top\mathbf{y}=\mathbf{c_{\mathcal{B}}}$.
	3. Once we find the first reduced cost $r_{s}>0$ we stop computing reduced costs, and put $x_{s}$ in the basis. If no such reduced cost exists, we have found the optimal dictionary.
	- This saves us from having to compute all coefficients in the objective row, except for the last iteration.
3. Determine the leaving variable using the bottleneck equation. 
	1. To find the bottleneck we set all non-basic variables except $x_{s}$ to zero, obtaining $\mathbf{x}_{\mathcal{B}} = B^{-1}\mathbf{b} - B^{-1}A_{\mathcal{N}}\mathbf{x}_{\mathcal{N}}= B^{-1}\mathbf{b}-B^{-1} \hat{\mathbf{a}}_{s}x_{s}= \bar{\mathbf{b}} - \mathbf{d}x_{s}$.
	2. Since $B^{-1}$ is difficult to compute we determine $\bar{\mathbf{b}}$ and $\mathbf{d}$ by solving the systems of linear equations $B \bar{\mathbf{b}}=\mathbf{b}$ and $B\mathbf{d}=\hat{\mathbf{a}}_{s}$ respectively.
	3. The $k$-th basic variable $x_{p}$ leaves the basis, where $k=\arg\min_{i}\{ \bar{b}_{i}/d_{i}: i \in \{ 1,\dots,|\mathcal{B}| \}, d_{i}>0 \}$.
	- This saves us from having to compute the coefficients of other non-basic variables besides $x_{k}$.
4. Determine the new basis $\mathcal{B}'= \mathcal{B} \setminus \{ p \} \cup \{ s \}$ and non-basis $\mathcal{N}'= \mathcal{N} \setminus \{ s \} \cup \{ p \}$ and return to step 1. At step 1, you can simply update the matrices and vectors by interchanging the columns/scalars.

### Dual Simplex Method

- The primal simplex method works with primal feasible dictionaries, whereas the **dual simplex method** works with dual feasible dictionaries.
- A dictionary is dual feasible if the coefficients of the non-basic variables in the objective row (the reduced costs) are non-positive.
- The main idea of the dual simplex method is to solve a linear programming problem in standard form by implicitly solving its dual.
- The algorithm constructs a sequence of dictionaries that stay dual feasible while becoming "more primal feasible".
- At each iteration, the objective value decreases, aligning with the fact that the dual problem is a minimization problem.
- In contrast to the primal simplex, the dual simplex method determines the leaving variable first, and the entering variable second.
- If a starting dictionary is neither primal nor dual feasible, the dual simplex method cannot be directly applied, and the 2-phase primal simplex method (the Help problem) must be used instead.

Procedure:

1. **Initialization**: Start with a dictionary that is dual feasible.
2. Select Leaving Variable: Check the constant terms $\bar{b}_i$ of the basic variables.  
	1. If all $\bar{b}_i \ge 0$, the dictionary is also primal feasible. Since it is both primal and dual feasible, it is optimal, and the algorithm stops.
	2. If the dictionary is not primal feasible, select a basic variable $x_{i^*}$ that has a negative constant term ($\bar{b}_{i^*} < 0$) to leave the basis.  
	3. If there are multiple basic variables with negative constant terms, use a pivot rule, such as the smallest index rule, to make the choice.  
3. **Select Entering Variable**: Look at the dictionary row corresponding to the leaving variable $x_{i^*}$.  
	1. If all non-basic variable coefficients in this row are non-negative ($\bar{a}_{i^*j} \ge 0$), increasing any non-basic variable to enter the basis would make the currently negative basic variable $x_{i^*}$ even more negative. In this case, no feasible solution can ever be found, and the feasible region is empty.  
	2. If there is at least one negative coefficient ($\bar{a}_{i^*j} < 0$), use the dual minimum ratio test to select the non-basic variable $x_{j^*}$ to enter the basis.  
	3. The entering variable is determined by finding the index $j^*$ that achieves the minimum ratio: $j^* = \arg\min_j \{\frac{\bar{c}_j}{\bar{a}_{i^*j}} : j \in \mathcal{N}_k, \bar{a}_{i^*j} < 0\}$.  
	4. This test provides the "bottleneck column" and ensures that all coefficients in the new objective row remain non-positive, thus strictly preserving dual feasibility.  
4. **Update and Repeat**: Construct a new dictionary by pivoting the leaving variable out of the basis and the entering variable into the basis. Stop if the new dictionary is primal and dual feasible; otherwise, return to Step 2.

### Sensitivity Analysis

TODO: state something like the following "we have some LP problem (define problem)", and "we know the optimal basis is B, with optimal dictionary (insert formula for dictionary)"

Adding / Removing Constraints

- TODO: explain how to add a constraint
- TODO: explain how to add a variable
	- Note: in the explanation of adding constraints and variables, ensure you use the following template:
		1. Formally define what we want to determine. 
		2. Provide the derivation of the updated dictionary using the previously optimal dictionary.
		3. explain whether its still dual/primal feasible, and next steps
- TODO: write the conclusion about adding variables and constraints

Changing Coefficients

- TODO: explain how to handle perturbations in vector b
- TODO: explain how to handle perturbations in the objective vector c
- TODO: write the conclusion on changing the coefficients

### Shadow Prices

The economic intuition behind duality in linear programming is best understood by framing the primal and dual problems as a negotiation over limited resources.

Let's start with the primal problem in extended form.
$$\begin{aligned} \max \quad & \mathbf{c}^T \mathbf{x} \\ \text{s.t.} \quad & A\mathbf{x} = \mathbf{b} \\ & \mathbf{x} \ge \mathbf{0} \end{aligned}$$

Imagine a manufacturer deciding what to build.

- $\mathbf{x}_{0}$ are the actual quantities of products to manufacture.
- $\mathbf{x_{s}}$ represent unused, leftover resources.
- $\mathbf{c}_{0}$ are non-negative coefficients representing the profit for producing any of the products to manufacture, and $\mathbf{c}_{s} = 0$ since leftover resources yield no profit.
- $\mathbf{c}^T \mathbf{x}$ is the total profit the manufacturer takes home. The goal is to maximize this number.
- $\mathbf{b}$ represents the bounds on the available resources A vector representing the total inventory of available resources (e.g., total labor hours, total pounds of steel).
- $A$ is the technology matrix. The element $a_{ij}$ represents exactly how much of resource $i$ is consumed to create one unit of variable $j$.
- $A\mathbf{x} = \mathbf{b}$ are the constraints. Because $\mathbf{x}$ includes slack variables, this equality simply acts as an accounting ledger: (Resources consumed by products $A_{0}\mathbf{x_{0}}$) + (Resources left sitting as slack $\mathbf{x_{s}}$) = (Total resources available $\mathbf{b}$).

Now, imagine an outside buyer wants to purchase the manufacturer's entire inventory of raw materials ($\mathbf{b}$). To do this, the buyer formulates the dual problem:

$$\begin{aligned} \min_{\mathbf{y}_{0}} \quad & \mathbf{b}^\top \mathbf{y}_{0} \\ \text{s.t.} \quad & A_0^\top \mathbf{y}_{0} \ge \mathbf{c}_0 \\ & \mathbf{y}_{0} \ge 0 \end{aligned}$$

- $\mathbf{y}$ are the the dual variables, also called the shadow prices. This is the price the buyer assigns to the raw resources.
- $\mathbf{b}^T \mathbf{y}$ is the total amount of money the buyer must pay to purchase the entire resource inventory $\mathbf{b}$ at prices $\mathbf{y}$. Naturally, the buyer wants to minimize this total payout.
- $A^\top_{0}\mathbf{y}_{0} \geq \mathbf{c}_{0}$ if the buyer wants to acquire the resources, they have to convince the manufacturer to actually sell them. This is only the case if the prices offered by the buyer outweigh the profit of producing the goods themselves.
- $\mathbf{y}_{0} \ge 0$ states that the buyer cannot propose negative prices.

(TODO: write why shadow variables dictate the price, relating to the slack conditions)
