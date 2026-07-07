
### Linear Integer Inequalities

- A **linear integer inequality** is an inequality of the form: $\sum_{i}a_{i}x_{i}\geq b$, where $a_{i},b \in \mathbb{Z}$ are integer constants, and $x_{i}$ are integer variables. The case of $\leq$ will be analogous.
- The optimistic contribution of a variable $x_{i}$ is its corresponding maximum value of $a_{i}x_{i}$. This is computed as:
	$$
	\text{optim}(x_{i})=\begin{cases}a_{i}UB(x_{i}), & a_{i} \geq 0 \\ a_{i}LB(x_{i}), & a_{i} < 0 \end{cases}
	$$
- The **slack** of a linear inequality is computed as $\text{slack}=\sum_{i}\text{optim}(x_{i})-b$.

Conflict Detection:
- The linear inequality is infeasible if its slack is negative. Formally, given the current domain $\mathcal{D}$ and the linear inequality $C$, there: $\text{slack}<0 \iff \forall A \in \mathcal{A}(\mathcal{D}):A \not\vDash C$.
- A straightforward implementation recomputes the slack from scratch whenever the propagator is invoked. Alternatively the slack may be maintained incrementally, computed once at the root, and updated whenever a relevant bound changes.
- A conflict explanation of a linear inequality has the following form:
	$$
	\bigwedge_{a_i > 0} \langle x_i \le UB(x_i) \rangle \land \bigwedge_{a_i < 0} \langle x_i \ge LB(x_i) \rangle \implies \bot.
	$$
- To verify the validity of a conflict explanation $E$ you simply check whether the upper bounds $UB_{E}(x_{i})$ and lower bounds $LB_{E}(x_{i})$ stated in the explanation actually violate the constraint. 

Propagation: 
- We formalize bound propagation by determining how much each variable MUST contribute to maintain feasibility. Derivation:
	1. $\text{slack\_without}(x_{i}) = \text{slack}-\text{optim}(x_i)$ (definition)
	2. $\text{slack\_without}(x_{i})+a_{i}x_{i}\geq0$ (for feasibility)
	3. $a_{i}x_{i}\geq -\text{slack\_without}(x_{i})$ (rewrite)
	4. $x_{i} \geq \left\lceil  \frac{-\text{slack\_without}(x_{i})}{a_{i}}  \right\rceil$ if $a_{i} > 0$
	5. $x_{i} \leq \left\lfloor  \frac{-\text{slack\_without}(x_{i})}{a_{i}}  \right\rfloor$ if $a_{i} < 0$
	- Rounding up/down is required due to the nature of the domain.
- propagation explanation is simply conflict explanation with one constraint moved to the right hand side. 
- for verification of a propagation explanation we convert it to a conflict explanation and then verify the conflict propagation.

## Cumulative Integer Constraint

- A task $i$ is represented by a triple $(s_{i},d_{i},r_{i})$ where $s_{i} \in \mathbb{N}$ is the start time of task $i$, $d_{i} \in \mathbb{N}$ is its duration, and $r_{i} \in \mathbb{N}$ is its resource requirement. 
- Given a task $i$ and a time point $t$, let $a_{i,t}$ be a binary variable representing whether task $i$ is active at time $t$. Formally: $a_{i,t}=1 \iff s_{i} \leq t < s_{i} + d_{i}$.
- Let $T = \{ 0, 1, \dots, m \}$ denote the set of time points under consideration. The time horizon is implicitly defined by the domain of the variables $m=\max_{i}(UB(s_{i})+d_{i}-1)$.
- Given a set of tasks $X=\{ (s_{i},d_{i},r_{i}) \}_{i}$ and a total resource capacity $R \in \mathbb{N}$ the **cumulative constraint** $\text{CUMULATIVE}(X,R)$ enforces that at every time point the total resource consumption of the tasks does not exceed the resource capacity: 
	$$
	\forall t \in T: \sum_{(s_{i},d_{i},r_{i})\in X}a_{i,t}r_{i}\leq R
	$$
- Determining the feasibility of a cumulative constraint is an NP-complete problem. We therefore focus on polynomial time relaxations that enable effective propagation in practice. 

Timetabling-based conflict detection

- Time points at which a task is guaranteed to consume resources are called compulsory (or mandatory) parts. 
- A task has a mandatory resource consumption at a specific time if its duration is larger than the domain of the starting time. 
- A **resource profile** is a function $P(t)$ that captures the total mandatory resource consumption at a time $t$.
- The conflict detection algorithm reduces to computing the resource profile and checking whether there exists a time point at which the resource capacity is exceeded. The explanation consists of the bounds on the variables corresponding to the tasks whose mandatory parts exceed the resource capacity.
- The verification procedure follows the same general principles as the conflict-detection algorithm: it reconstructs the resource profile and performs the conflict check. The main differences are:
	- it executes both components of the conflict detection (detecting excess resource consumption AND identifying tasks that cannot be scheduled)
	- it uses a simpler and more trustworthy implementation

Timetabling-based propagation

- We propagate if assigning the task to its bound values would directly lead to a conflict based on the compulsory parts. In practice timetabling is typically used to propagate upper and lower bounds on task start times. Although it is possible to remove interior values, creating holes in the domain can be computationally expensive without offering any real benefit to the timetabling reasoning. 
- Explanations are trivial, and verification consists of converting the explanation to a conflict explanation and verifying that.

Energetic reasoning

- Instead of reasoning over profiles we reason over energy. 
- Energy corresponds to the rectangle given by the time interval and resource consumption. An interval of length $x$, and $y$ units of capacity has $x\cdot y$ units of energy. Based on these capacities we can reason about whether certain tasks can fit in the interval.
- Any propagation detected by timetabling will also be detected by energetic reasoning, but not the other way around. However, energetic reasoning is more computationally expensive, as the number of time intervals grows quadratically with the time horizon.

### All Different Integer Constraint

- Given a set of integer variables $X$, the $\text{ALL\_DIFFERENT}$ constraint imposes that no two variables may be assigned the same value: $\forall x_{i},x_{j} \in X : x_{i} \neq x_{j}$.
- Variant 1: Propagation by pairwise decomposition.
	- Idea: decompose the constraint into a set of pairwise disequality constraints. This results in a quadratic number of constraints ($\frac{n(n-1)}{2}$) in the number of variables ($n$).
	- The same idea could be implemented directly by a stronger propagator, potentially avoiding the quadratic memory overhead. In practice the difference is often negligible.
	- Benefits: simple, and low computational cost. However it provides only weak propagation and may fail to detect infeasibility. For example for the case $\text{ALL\_DIFFERENT}(x_{1}, x_{2}, x_{3})\land x_{1},x_{2},x_{3}\in \{ 1,2 \}$.
- Given the domains $D$, identify a subset $X$ of $k$ variables such that $|X|=k$, and the union of their domains $D_{u}=\bigcup_{x_{i}\in X}D(x_{i})$, contains exactly $k$ values: $|D_{u}|=k$. The set $X$ that satisfies the above conditions is called a **Hall set**. 
	- The values in $D_{u}$ must be assigned exclusively to the variables in $X$ and can therefore be removed from the domains of all other variables. Formally, $\forall x_{j}\not\in X,\forall v \in D_{u}:x_{j}=v$.
	- Depending on how this idea is exploited algorithmically one either obtains bounds consistency or domain consistency.
- Variant 2: Bound-Consistent Propagation.
	- Rather than reasoning about the union of domains as an explicit set of values, we may instead over-approximate this union by an interval.
	- A straightforward implementation iterates over pairs of bounds to form candidate intervals, though more efficient $O(n\log n)$ algorithms exist.
- Variant 3: Domain-Consistent Propagation
	- We reason about the hall sets directly. This yields pruning strictly greater than the pruning of bound-consistent propagation.
	- The main challenge in achieving domain-consistent propagation is identifying Hall sets in polynomial time.

Network-flow based Conflict Detection

- Conflict detection is based on maximum flow. First we represent $\text{ALL\_DIFFERENT}$ as a graph, we build an undirected bipartite graph with two sets of vertices, variable vertices, and value vertices. We then add an edge $(x,v)$ between a variable $x$ and a value $v$ whenever $v \in D(x)$. Finally we add a source $s$ connected to the variable vertices and a sink $t$ connected to the value vertices. We then compute the maximum flow from the source to the sink using Ford-Fulkerson. If the maximum flow is less than the number of variables, then we have a conflict.
- To compute a non-redundant set of variables involved in the conflict, we inspect the residual graph of the maximum flow. A strongly connected subgraph containing more variables than values is a witness to the conflict. Such components can be identified in linear time, e.g. using Tarjan's algorithm. These variables form the basis for the explanation.
- A non-redundant explanation for an $\text{ALL\_DIFFERENT}$ conflict encodes precisely the domains of the variables in a Hall set together with the domain of an additional variable whose domain is a subset of the union of Hall-set domains.
- Because of this structure, the verifier only needs to: count the number of variables appearing in the explanation, determine the number of distinct values in their domains, and check that the former exceeds the latter. 
	- If this is the case, the explanation is valid
	- If this is not the case the explanation may still be valid, but then the explanation must contain redundancies. 

Network-flow based Propagation

- Propagation comes down to removing the edges that can NEVER belong to ANY maximum matching. Removing an edge $(x,v)$ corresponds to a propagation of the form $x\neq v$.
- The naive approach simply iterates over all maximum matchings, and determines any edges that do not occur in any of them. These edges are then removed.
