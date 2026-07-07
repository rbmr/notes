These notes are based on the lecture notes for the course 2025/2026 Constraint Solving (CS4535) from Delft University of Technology.

### Fundamentals

- A **variable** $x$ represents an unknown quantity whose value is to be determined.
- The **domain** $D(x)$ of a variable $x$ is the set of all values a specific variable $x$ may assume. Domains can be anything: numerical (integer, real, complex), categorical, ordinal, etc.
- For numerical domains we define the **lower bound** $LB(x)$ and **upper bound** $UB(x)$ as the smallest and largest values of its domain respectively.
- Domains may be represented in different ways:
	- **Set Representation**: each value is explicitly stored, e.g. using a boolean value for each domain element. 
	- **Interval Representation**: only the lower and upper bounds of the domain are recorded, regardless of the domain size.
	- Representations that mix the two ideas, such as adding lower/upper bounds to a set, or storing a set of disjoint intervals.
- An **assignment** $A$ is a mapping from a subset of variables to values from their respective domains. The **scope** of $A$ is the set of all variables mapped by $A$.
- A **full assignment** (or complete assignment) is an assignment where every variable in the problem has been assigned a value. Any assignment that is not a full assignment is called a **partial assignment**.
- A **constraint** $C$ is a predicate that classifies each assignment as either feasible $\top$ or infeasible $\bot$.

### Feasibility

- An assignment $A$ is called **feasible** (or **consistent**) with respect to some constraint $C$ (denoted $A \vDash C$) when $C(A) = \top$. The set of all feasible assignments for some constraint $C$ is denoted as $Sol(C)$.
- A full assignment $A$ is considered **feasible** (or **consistent**) with respect to all constraints $\mathcal{C}$ (denoted $A \vDash \mathcal{C}$) when $\forall C \in \mathcal{C}: A \vDash C$. 
- A **Constraint Satisfaction Problem** (**CSP**) is defined by a 3-tuple $(X,\mathcal{D},\mathcal{C})$, where $X=(x_{1}, x_{2}, \dots, x_{n})$ is the set of all variables, $\mathcal{D}=(D_{1}, D_{2}, \dots, D_{n})$ is the set of their corresponding domains, and $\mathcal{C}$ is the set of all constraints. 
- A constraint satisfaction problem $(X,\mathcal{D},\mathcal{C})$ is **feasible** (or **satisfiable**) iff there exists at least one full assignment $A$ such that $A \vDash \mathcal{C}$. Deciding the feasibility of a CSP is NP-complete.

### Optimization

- Formally a **Constraint Optimization Problem** (**COP**) extends a CSP by introducing an **objective function** $f$ that assigns a numerical value to each full assignment. 
- The **optimal assignment** $A^*$ is the feasible solution that maximizes/minimizes the objective function. 
- Constraint optimization can be implemented as repeated constraint satisfaction. Repeatedly run a CSP with the additional constraint that the objective function value of the new solution must exceed the objective function value of the previous solution. Once no such new solution exists, we know the previous solution was the optimal assignment.

### Modeling and Solving

- The **model** provides the abstract mathematical formulation for a problem. It defines the variables, constraints, and the semantics of the problem. 
	- For any given problem, there may be many different models, some of which may be better suited than others for solving the problem.
- An **instance** is a concrete realization of this model. It defines the actual variables that appear in the instance, their precise domains, and the explicit list of constraints.
- **Solving** a CSP means either finding a feasible assignment, or concluding no feasible assignment exists.

### Backtracking Search 

- The **solver** refers to the entire search procedure including all its components. Solver components include:
	- A **partial assignment** is a collection of domains of the variables. Initially this partial assignment is simply the original domain set. During search, the solver modifies the partial assignment through a combination of *decisions* (choices made by the algorithm), *propagation* (logical consequences of those choices), and *backtracking*.
	- The **trail** is a stack that records all modifications to the variable domains, maintaining a clear distinction between decisions, propagations, and their associated decision levels. 
	- (Derived) constraints, and additional data structures that improve the efficiency of propagation and decision making.
- A **conflict** occurs whenever the current partial assignment violates a constraint, or (equivalently) when at least one domain becomes empty as a result of propagation. 
- A conflict implies the previous decision led to a contradiction. This requires **backtracking** to the previous decision and continuing from there. Backtracking consists of reverting the operations to the partial assignment since the last decision as recorded by the trail, and then adding the negation of the decision as a constraint.
- A high-level overview backtracking search is as follows:
	1. Repeatedly apply propagation until no further inferences can be made.
	2. If a conflict arises (domain becomes empty):
		- If we are at decision level $0$, the CSP is infeasible.
		- Otherwise, we backtrack (undo most recent decision, and all of its consequences), and add the negation of the previous decision as a new propagation, and continue the search.
	3. If all variables have been assigned we have found a feasible assignment.
	4. Otherwise, make a new decision. 

### Propagation

- A **propagator** is a function associated with a set of constraints that *contracts* the domains of variables by removing the values that cannot appear in any feasible assignment. 
- We say a propagator is at a **fixed point** if its repeated application does not reduce domains any further. If a propagator is guaranteed to reach a fixed point after a single application, we say it is **idempotent**.
- Let $C$ be a constraint over variables $X=\{ x_{1}, x_{2}, \dots, x_{n} \}$ with domains $\mathcal{D}=\{ D(x_{1}), D(x_{2}), \dots, D(x_{n}) \}$, where $\mathcal{D}$ is a fixed point with respect to a propagator $p$. Furthermore, let $Sol(C)$ be the set of all feasible assignments given the domains $\mathcal{D}$ and constraint $C$.
	- A propagator $p$ enforces **bound consistency** if for any variable $x_{i} \in X$, there exists a lower bound- $A_{LB} \in Sol(C)$ and upper bound solution $A_{UB} \in Sol(C)$ such that $A_{LB}(x_{i})=LB(x_{i})$ and $A_{UB}(x_{i})=UB(x_{i})$.
	- A propagator $p$ enforces **domain consistency** (also called **arc consistency**) if for any variable $x \in X$, and any value $v \in D(x)$, there exists a solution $A \in Sol(C)$ such that $A(x)=v$.
	- Domain consistency implies bound consistency, but not the other way around.
- When designing propagators you face a trade-off between computational efficiency, and propagation strength. The practical value of a propagator is finally determined by its ability to reduce the overall runtime of solving a problem.

### Explanations

- An **explanation** is a propositional statement that specifies the logical reason behind why a propagation or conflict occurred. 
	- An **atomic constraint** $a_{i}$ is an elementary predicate involving a single variable. Each atomic constraint has the form $\langle x *c \rangle$, where $x$ is a (numerical) variable, $c$ is a constant, and $* \in \{=, \neq, \leq, \geq, <, >\}$ is a comparison operator.
	- Explanations are constructed as a conjunction of atomic constraints.
	- A **propagation explanation** has the form $a_{1} \land a_{2} \land \dots \land a_{n-1} \implies a_{n}$.
	- A **conflict explanation** has the form $a_{1} \land a_{2} \land \dots \land a_{n} \implies \bot$.
	- Propagation and conflict explanations are interchangeable. 
- An explanation is **valid** if it is logically entailed by the constraint. Formally for a constraint $C$, an explanation $E$ is valid if $\forall A \in Sol(C): A \vDash E$. 
- If an atomic constraint $a$ was assigned before an atomic constraint $b$ for a trail $T$ we denote this as $a \preceq_{T} b$. 
	- Any assigned atomic constraint precedes any unassigned atomic constraint. 
	- During a conflict, any assigned atomic constraint is considered to precede the contradiction $\bot$.
	- Tighter bounds are ordered before weaker bounds. Implied disequality atomic constraints do not have a defined order among themselves.
- An explanation is **applicable** if it can be used as a justification given the state of the search. Formally for a domain $D(T)$ induced by a trail $T$, an explanation $a_{1} \land a_{2} \land \dots \land a_{n-1} \implies a_{n}$ is **applicable** with respect to $T$ if $D(T) \vDash a_{1} \land a_{2} \land \dots \land a_{n-1}$ and $\forall a_{i} \in \{ a_{1}, a_{2},\dots,a_{n-1} \}:a_{i} \preceq_{T}a_{n}$.
- An explanation is **correct** if it is both valid and applicable, and **incorrect** otherwise.	
- During a conflict, any assigned atomic constraint is considered to precede the contradiction $\bot$.

### Checkers

- Verification is the process of asserting the validity of an explanation. 
- Checkers independently verify the validity of a solver by verifying its explanations.
- Checkers should remain as simple, and independent. 
	- It provides a one-sided guarantee of validity. When a checker validates an explanation, we can be confident in its correctness. When it fails to confirm an explanation, the explanation might still be correct, but the verification cannot certify it.
	- This limitation is acceptable because a checker does not need to actually validate all explanations, only those produced by a specific propagation method.
- Formally, let $\mathcal{E}$ be the set of all explanations. A **checker** $V$ (which is tied to a specific algorithm), is a mapping $V: \mathcal{E} \to \{ \text{valid},\text{unknown} \}$ such that $\forall E \in \mathcal{E} : \left( V(E) = \text{valid} \implies E\text{ is a valid explanation} \right)$.

### Decomposition

- An alternative to writing a dedicated propagator is to **decompose** a constraint into other (typically simpler) constraints. 
- Most constraints can be decomposed into linear inequality constraints. This becomes necessary when an underlying solver does not support a dedicated propagator.
- The general rule of thumb is that a dedicated propagator is preferable to using a decomposition. As more advanced techniques, in particular conflict analysis, is introduced one may challenge this conventional wisdom.

### Branching

- To find a feasible solution, we systematically explore the entire search space. The exploration can be visualized as a binary search tree. Each node represents a **decision**. From each decision, we **branch** into two subproblems resulting from assuming the decision $\top$ or its negation $\bot$, visualized as edges moving away from the decision node.
- The search space is usually explored using depth-first search. The order in which the subproblems are explored is referred to as the **branching strategy**. The goal of the branching strategy is to reduce the overall size of the search tree. 
- The **variable selection heuristic** which selects the next variable on which to branch. Examples include: 
	- Smallest domain, 
	- Smallest value, 
	- Conflicting (number of conflicts a variable has been involved in), 
	- Fixed order (useful for bench-marking, and this order can be predetermined using domain-specific knowledge)
	- Frequency (variable that appears in the most propagators)
	- Random (pick a variable uniformly or following a distribution, useful for bench-marking)
	- Custom (incorporate knowledge in to the problem structure)
- The **subproblem selection heuristic** which determines how to branch on the selected variable by selecting both the comparison operator, and the constant for the resulting atomic constraint. Examples include:
	- Smallest / Largest value (select min or max value from the domain, for example in scheduling the earliest start time can lead to viable schedules quickly)
	- Reference assignment (select the value suggested by a given reference assignment, this concentrates the search around an assignment that is close to feasibility, e.g. an assignment produced by a greedy algorithm)
	- Split (select a value that splits the domain, creating subproblems of comparable size)
	- Random (select the branching value at random or following a distribution, serves as a useful baselines)
	- Fixed (define the value ordering in advance based on domain-specific insight)

### Conflict Analysis

- Propagation in constraint programming reasons over individual constraints, communicating only through variable domains. This comes with the fundamental limitation that it can only capture interactions between constraints when the relevant variable assignments have been made. As a result, a solver may repeatedly encounter essentially the same conflicts. To avoid repeating identical mistakes, we need a mechanism that is both robust and computationally inexpensive. 
- **Conflict analysis** is a reactive technique that identifies the underlying causes of conflicts as they occur, deriving new constraints to prevent the solver from ever revisiting that same conflicting combination of assignments.
- **Conflict Analysis** uses the following procedure:
	1. We start with the explanation of the conflict (called the **conflict nogood**)
	2. Identify the atomic constraint in the no good that was assigned last, and retrieve the propagation for this atomic constraint, and replace the atomic constraint with its reason. 
	3. We repeat 2. until a termination condition is met. We consider two options:
		- **1UIP learning** (**first unique implication point**): Terminates when the conflict nogood becomes **asserting**, that is, until it would have led to a propagation at an earlier decision level. Concretely this occurs when the nogood contains exactly one atomic constraint (called the **asserting** atomic constraint) at the current decision level.
		- **All-decision learning**: skips over atomic constraints resulting from a decision (since they dont have a reason), and terminates when no propagated assignments remain.
		- 1UIP has become the de facto standard, but nonetheless the all-decision learning scheme also has its uses, particularly within core-guided search techniques for optimisation.
	4. The resulting no good (called the **learned nogood**) explicitly encodes the reason for the conflict, allowing the solver to backtrack to the point in the search where this nogood would propagate. This, in turn, enables backtracking across multiple decision levels (called **backjumping**).
- Conflict analysis has several important properties:
	1. The conflict nogood remains conflicting with respect to the current trail in every iteration (of step 2). 
	2. **The conflict nogood is entirely implied by the constraints of the problem, and therefore does not eliminate any feasible solutions**.
	3. **Only propagated atomic constraints are replaced with their reasons**. We never replace an atomic constraint that was used as a branching decision. If the decision atomic constraint were ever the last remaining atomic constraint from the current decision level, the termination criterion would already be satisfied.
	4. **Conflict analysis is guaranteed to produce an asserting nogood**. 
		- There can be no circular dependencies among atomic constraints, one of two assignments always occurs first on the trail, and only the later one can be a consequence of the earlier. Thus an atomic constraint cannot appear in its own reason. 
		- In each iteration we replace the most recently assigned propagated atomic constraint with the atomic constraints appearing in its reason. Since these reason constraints are always assigned earlier in the trail, and since the number assignments is finite, the rewriting process cannot continue indefinitely. 
- Conflict analysis is valuable for three main reasons:
	1. It provides a generic mechanism for combining multiple constraints, which can lead to exponential reductions in search effort.
	2. Atomic constraints that frequently appear in conflict analysis are strong candidates for branching, thereby improving the effectiveness of the search.
	3. The set of learned nogoods can serve as a proof for infeasibility or optimality, which can be checked independently to certify the correctness of infeasibility claims made by the solver.
- Conflict analysis is now a state-of-the-art technique used in both constraint programming and SAT, where it is more broadly known as **conflict-driven clause learning** (CDCL). 
- **Lazy clause generation** (LCG) in constraint programming, also known as **hybrid SAT-CP** is a technique where the solver maintains a dual view of the problem: a constraint programming model and a propositional logic (SAT) encoding of the problem. 

### Verifying Learned Nogoods

- We can verify the correctness of a learned no good by reconstructing how the nogood was produced, there are 3 key ideas:
	1. The nogood must be conflicting. If we assume all atomic constraints appearing in the nogood are true, then we expect to reach a conflict.
	2. The explanations used during conflict analysis must be sufficient to derive this conflict. In other words we must be able to follow the same sequence of explanations to reach the conflict.
	3. The explanations themselves must be correct. (This should already be handled by the other checkers.)
- Verification then adheres to the following steps:
	1. We initialize the domains as specified by the learned nogood.
	2. We then apply the explanations in order (these are expected to be correct)
	3. Finally, we verify that we indeed derive a conflict.

### Minimizing Learned Nogoods

- The conflict analysis procedure described earlier may produce learned nogoods that contain redundancies. That is, some atomic constraints may be implied by the conjunction of other constraints already present. Removing redundant atomic constraints is highly desirable. Smaller nogoods are more general and lead to more propagation. However, detecting (and removing) all redundancies in a nogood (so called **nogood minimization**) is in general a hard problem.
- Instead, we consider two approaches:
	1. Semantic minimization: removing or rewriting atomic constraints by leveraging the semantics of the atomic constraints. 
	2. Trail-based minimization: analyzing the current trail to identify explicit implications that show the redundancy of some atomic constraints.
- **Semantic minimization** works by constructing the domain implied by all atomic constraints involving the same variable and then describe that resulting domain using one or more atomic constraints. 
- The trail can be represented as an **antecedent graph**, where each node $a_{i}$ corresponds to an atomic constraint, and there is an edge $(a_{1}, a_{2})$ whenever atomic constraint $a_{2}$ is part of the reason for the propagation of atomic constraint $a_{1}$. 
	- Thus, $(a_{1},a_{2})$ indicates that "$a_{1}$ has $a_{2}$ as an antecedent". 
	- Decision atomic constraints have no outgoing edges, and edges are labelled with the constraint that caused the propagation. 
- **Trail-based Minimization** analyzing the antecedent graph allows us to detect implications that can be used to simplify learned nogoods. An atomic constraint $a_{i}$ in a learned nogood is redundant if and only if all paths starting from $a_{i}$ in the antecedent graph eventually reach only atomic constraints already in the nogood. Because the graph is acyclic, this leads to a linear time recursive dependency check for each atomic constraint that goes as follows:
	1. First we apply some initial labels:
		1. The asserting atomic constraint, AND the decision atomic constraints in the nogood are labelled *keep*.
		2. Decision atomic constraints not in the nogood, and atomic constraints from decision levels not represented in the nogood are labelled *poison*.
		3. All propagated atomic constraints appearing in the initial nogood start as *seen* (except the asserting one, which as starts as "keep" per 1.1.).
	2. We do a recursive post-order traversal from every atomic constraint labeled seen, we divide into cases:
		1. If all children are labeled *keep*, or *redundant*, this node becomes *redundant*. 
		2. If at least one child is labeled *poison*, then this node becomes also becomes *poison* if the current node is unlabeled, and *keep* if the current node is labeled as *seen*.
	3. After this process has finished all the atomic constraints in the initial nogood are either labeled *keep* or *redundant*. *redundant* atomic constraints may be safely removed.

### Nogood propagation algorithms

- Nogood propagation algorithms are inspired by clausal propagation in SAT solvers, which operate over propositional variables and clauses. The SAT community has developed exceptionally efficient propagation algorithms, as clause-based reasoning is central to SAT solving. 
- **Unit propagation** says that when all but one of the atomic constraints in a nogood are true, then the remaining unassigned atomic constraint must be set to false. 
- **Adjacency-list propagation** maintains a list of nogoods in which each atomic constraint appears. Whenever the atomic constraint becomes true, the solver inspects all of its nogoods to determine whether unit propagation can occur. 
- **Counter-based propagation** is a more refined alternative is to maintain for each nogood, a counter recording how many of its atomic constraints are unassigned, together with a flag indicating whether any of them is currently false. Propagation occurs when the counter reaches one, and no atomic constraint is false. 
- The adjacency list requires repeated re-scanning of the adjacency list, whereas the counter-based approach does not. However, the counter-based approach has the non-trivial drawback of needing to update the counters and flags when the solver backtracks, whereas the adjacency list approach does not. 
- **Two-watcher propagation** attempts to avoid maintenance work by adopting a lazy strategy that only performs detailed checks when propagation is genuinely plausible. A key observation is that a nogood can only propagate or become conflicting if it has at most one unassigned atomic constraint. 
	- The **two-watcher scheme** maintains the invariant that each nogood always has two watchers, and each watcher is either unassigned or assigned false. In this state, the nogood cannot propagate. When a watcher becomes true, the solver attempts to replace it with another atomic constraint from the nogood. If no such replacement is found, this implies all remaining atomic constraints are either true or already serving as watchers, in which case the nogood must either propagate (if only the other watcher remains unassigned), or report a conflict (if none remain unassigned). (TODO: there are some details missing/incorrect here, but I cant find any resources needed to fix it)
	- A distinct advantage of the two-watcher scheme is that it is backtrack-free, as the in-variants continue to hold when assignments are undone. Furthermore it is a prime example of a lazy propagation algorithm, worst case it may perform more work than the counter-based approach, but in typical cases where nogoods contain many atomic constraints, it provides a much more time efficient propagation mechanism. 
	- The discussion above assumed that all variables were binary, making it straightforward to determine when an atomic constraint becomes true, to generalize this to CP, most lazy solvers maintain a dual representation of the problem, a CP view and a SAT view. This dual representation introduces a boolean variable for each atomic constraint together with a dedicated channeling mechanism that synchronizes the truth value of the boolean variable with the status of the corresponding atomic constraint. 

### Conflict-Driven Variable Selection

- The *fail first* principle has long guided variable-selection strategies. It encourages choosing branching variables that are likely to cause conflicts early. The intuition is that failing sooner leads to stronger propagation and more pruning. Being "active in conflicts" is not well-defined. 
- We want a good measure that suggests whether a variable is more likely to cause conflicts. 
- **Variable State Independent Decaying Sum** (**VSIDS**) is a robust domain independent branching strategy originally developed for SAT solving, and later adopted in constraint programming. 
	- A variable considered **active** if it directly participates in the conflict analysis process. This means the variable must appear within the initial conflict nogood or within any of the propagation explanations used to derive the learned nogood.
	- For every atomic constraint encountered in an explanation during the conflict analysis, its activity score is incremented.
	 - After each conflict, the increment is multiplied by a constant factor $\gamma >1$ slightly larger than one. This produces similar behaviour as decay, but doesn't require us to multiply all the variables by a constant factor. 
	 - To prevent numerical overflow the solver occasionally resets the increment and divides all activities relative to this reset. As only the relative ordering of the scores matters.
 - VSIDS has two caveats:
	 - Early randomness: because all atomic constraints begin with an activity score of $0$, the solver relies on random tie-breaking early in the search until enough conflicts occur to differentiate the variables. This can heavily and sometimes negatively influence the search tree.
		 - Can be mitigated by using a domain specific branching heuristic first for a short period of time, or alternate between heuristics to initialize the activity profile before fully handing control over to VSIDS.
	 - Getting stuck: VSIDS is highly focused on resolving local conflicts. If the solver enters a poor region of the search space, VSIDS may be slow to guide it out, even if better regions exist elsewhere.
		- Can be mitigated using restarts.

### Restarts

- **Heavy tail behaviour**: unfortunate set of early decisions may lead the solver into a subproblem with no feasible solutions, and where proving infeasibility is difficult. And a fortunate set of early decisions may lead the solver into a subproblem where it finds a good solution quickly. 
- We can **restart** the search by backtracking to the root decision. When using conflict learning, restarting the search is not the same as beginning anew. Learned nogoods and any activity scores and remain in the solver. Empirically, restarts are a crucial component of modern solvers, although their theoretical foundations are less understood. 

How do we determine how often to restart?

- **constant restarts** restart after every $k$ conflicts.
- **geometric restarts** increases the restart interval by some fixed percentage after every restart. Allowing the solver to reach deeper areas of the search tree.
- **luby restart sequence** combine short and long intervals in a structured way.
	1. we restart after $k$
	2. we repeat the entire pattern of restarts up until now.
	3. $k := k * 2$
	- Result: $1,1,2,1,1,2,4,1,1,2,1,1,2,4,8,\dots$
- the aforementioned strategies are **static**, **dynamic** strategies adapt the restart frequency to the state of the solver.
- **glucose restarts** (named after the SAT solver in which they were first used) is a popular dynamic approach where we regularly test if the solver should restart, but *block* a restart if the solver appears to be in a promising part of the search space. 
	- promising aspects may include: large number of pruned domain values compared to a moving average, or average LBD of recently learned nogoods is significantly lower than the global average. 
	- variants of this approach are widely used in modern solvers.

### Learned Nogood Management

- Learned nogoods are valuable because they capture interactions between constraints that are not explicitly enforced elsewhere in the model. However, modern solvers may generate thousands of learned nogoods per second. We must therefore be selective about which nogoods to keep and which to delete. We use the following metrics to estimate learned nogood effectiveness.
- The **Nogood size** is the number of atomic constraints it contains. Unit nogoods are strongest, binary nogoods are also very useful.
	- Problem: nogoods of larger sizes may still lead to quick propagation.
- **Literal Block Distance** (**LBD**) instead of counting the number of atomic constraints in a nogood, we count how many distinct decision levels appear among the atomic constraints of the nogood. Nogoods spanning many decision levels are less likely to propagate again than nogoods spanning few decision levels.
	- Problem: computing and maintaining the LBD is difficult. So instead we approximate. 
	- When a nogood is first learned, all of its atomic constraints have assignments, its LBD is the number of distinct decision levels appearing in the nogood (excluding the current decision level). Each time the nogood participates in conflict analysis, either as the conflict no good, or as a part of an explanation, we recompute its number of decision levels. If the new value is lower, we store the update the stored LBD. Thus the LBD records the smallest number of decision levels ever observed for that nogood when it was active. 
	- LBD has become the de facto standard criterion for nogood quality.
- **Nogood activity** is used as a tie breaker when several no goods share the same LBD. No goods that repeatedly participate in conflict analysis are presumably useful and should be preserved. The mechanism mimics the VSIDS heuristic for variable activity.
- A common policy is then to periodically delete half of the stored nogoods, keeping those with the lowest LBD and highest activity. Nogoods with LBD equal to two are often kept permanently.

### Certificates

- When a solver provides a feasible solution, its trivial to verify it, and determine if the objective function value matches the solution provided by the solver. Verifying infeasibility is much harder, and equally important. 
- The solver should provide a *certificate*, also called a *proof*, that can be checked both *efficiently* and *independently* from the solver that provided the certificate. We formalize the behaviour of the solver as an algorithm that derives mathematical proofs. 
- A certificate becomes a sequence of logical deductions from the constraints that leads to an obvious contradiction. Optimisation proofs may be interpreted in the same spirit, showing that the problem of finding a better solution is infeasible.
- We consider 3 critical components:
	- The proof system used to model the logical reasoning steps made by the solver.
	- Explain how proofs in this system can be verified efficiently and independently.
	- We examine how such proofs can be produced during solving.

Proof System

- The basic building block of a proof is a **fact**, the left hand side is called the premise (or reason), and the right hand side is called the consequent.
	- Facts make the reasoning explicit.
	- Although facts and explanations are similar, they differ on the following: facts must be validated with respect to the the entire set of constraints in the problem, as well as the facts that have already been derived. In contrast, explanations are valid with respect to only the constraint that generated them, and they must be *applicable* to given the trail.
	- Every step in the proof derives one fact. 
- An **inference** consists of:
	- the fact being justified.
	- a single constraint from the original CP, or an earlier deduction that implies the fact.
	- an **inference rule** that explains the reasoning step used to derive the fact from the given constraint. Inference rules include (1) the reasoning used by propagators and (2) the initial domains of the variables, which effectively restate the information in the CSP. We require inference inference rules to be verifiable in polynomial time.
- A **proof stage** derives a new fact by combining other facts. 
	- A proof stage consists of: 
		- a final implication $a_{1} \land a_{2} \land \dots \land a_{n} t\implies \bot$, called the deduction.
		- a sequence of facts that justify the deduction.
- When a solver proves infeasibility, the deduction of the last stage is $\top \implies \bot$.
- A proof stage is valid if we can derive its deduction fact by following the sequence of inferences. We start with the atomic constraints in the deductions premise, and apply the facts in the proof stage in order. If the premise of a fact is satisfied by the currently induced domains we add its consequent, if not we skip it. At the end, if the resulting set of atomic constraints is conflicting the proof stage is valid.
- A **proof** becomes a sequence of valid proof stages. Each stage can use the deductions of earlier stages as additional constraints. One of the deductions in the sequence is designated as the conclusion, this is the statement the solver wishes to justify. 
- Properties of the proof system: 
	- The proof system is **sound**: any conclusion justified by a proof is logically implied by the original constraint problem. Each inference rule guarantees the fact is derived from the constraints, each deduction shows that its premise leads to a contradiction.  
	- The proof system is **complete** under the assumption of finite domains.
- **Verification** of a proof amounts to checking that it satisfies the aforementioned definitions and conditions. Although producing a proof is difficult, checking a proof is polynomial with respect to the size of the proof.

Generating Proof Certificates

- The proof is strongly connected to the search process. The deduction steps correspond to nogoods obtained through conflict analysis, and the inference steps correspond to explanations. 
- This leads to a basic approach to proof production: record learned nogoods as deduction steps, and the explanations used to justify the the nogood then corresponds to the inferences. This comes with two challenges:
	- Proofs are only relevant when the solver proves infeasibility. If it fails to do either within the time limit, any time spent recording is wasted and slows down the solver. 
	- Solvers may perform substantial redundant work before finding the proof. Recording each step can be prohibitively expensive. 
- Initial intuition: we remove steps from the proof that are not needed in the final proof. 
- Our goal to construct certificates during search while keeping the runtime overhead as small as possible. 
- To address we use **multi-stage proof production** which divides the our proof production approach into several phases:
	1. **Scaffolding**, where the solver runs normally, and produces a *proof scaffold*, which is a sequence of nogoods discovered during search (including registering nogood deletions).
		- The requirement is that the $i$-th scaffold step must be justifiable in polynomial time, assuming the atomic constraints in the nogood should lead to a contradiction by propagation, considering the original constraints, and the first $i-1$ steps of the scaffold. 
		- Learned nogoods naturally satisfy this property, referred to as reverse unit propagation. 
	2.  **Processing**, where the scaffold is transformed into a full proof by a separate proof elaborator (proof processor) which conceptually performs two transformations:
		1. **Trimming**: removing nogoods that are redundant to proof infeasibility.
		2. **Inference Introduction**: For each remaining nogood $C$ in the trimmed scaffold, the processor generates all inferences required to justify $C$. 
		- The output becomes a complete proof containing all reasoning steps needed to establish infeasibility. 
		- Two notes: (1) for the elaborator to justify the scaffolds, it must be able to reason at least as strongly as the solver. (2) The processor is free to use reasoning that differs from the solver's runtime reasoning, as long as it reaches the same justified conclusion.
	3. **Checking**: A simple, sound, and independent proof checker will then accept only correct proofs, ensuring that any bug that produces unsound reasoning will be detected.
- **reverse unit propagation**: given the constraints in the database at the time when the learned nogood has been derived, assuming the premises from the learned nogood leads to a conflict by propagation without any search. 
	- Given a nogood that requires justification, assume its atomic constraints from its premise, and propagate. If the nogood satisfies the reverse unit propagation property, this will result in a conflict. We can then use out conflict analysis procedure to compute a justification.
	- Considering the antecedent graph, traversing this graph in topological order produces all necessary inference steps to justify the nogood. 
- Trimming removes redundant nogoods from the scaffold. A couple details:
	- Trimming does not determine inferences, it merely establishes that they are possible assuming the input scaffold was correct.
	- The trimmed scaffold is not unique, different valid subsets may exist.
- **Backwards trimming** is a trimming technique adapted from SAT solving. It works as follows: we perform a linear pass through the list of nogoods starting from the newest nogood (the conclusion), and moving toward the oldest nogood. As it scans backward, whenever it hits a marked nogood, it immediately identifies and marks the nogoods used to justify it. 
	- To ensure a newer nogood cannot be used to justify an older nogood, the solver removes a nogood from the propagation engine the moment it has been processed during the backward pass.

### Computational Limits

- Constraint solvers are incredibly powerful but still fail poorly on some seemingly simple problems.
- **The pigeonhole problem**. Can we place $n$ pigeons into $n-1$ holes such that no two pigeons share a hole? Clearly no. But integer variables + an all different constraint shows infeasibility in polynomial time, whereas a model with binary variables (one variable per pigeon + hole pair), the solver needs to explore an exponential number of assignments. 
- **The mutilated checkerboard problem**. Consider a $N \times N$ checkerboard pattern, with two diagonally opposing corners removed. Is it possible to tile the remaining squares with $2 \times 1$ (or $1 \times 2$) dominoes such that each domino covers one black and one white square? Again clearly no, we have an imbalance in white and black squares. Yet depending on the modeling choice this may again require exponential time to prove infeasibility.
- **Contradictory inequalities**: consider a problem with two inequality constraints, where one requires the weighted sum to be larger than or equal to some value, whereas the other requires it to be less than that same value. The contradiction is immediate. However, the solver may again evaluate an exponential number assignments to conclude infeasibilty.
- We may raise the question, is this exponential proof length a consequence of the solver, or the underlying proof system? 

### Alternative Proof Systems

- A proof system specifies the language of the proofs, the basic starting objects (axioms), and the allowed derivation rules. Different systems have different strengths.
- The **resolution proof system** takes the clauses of CNF formulas as axioms, and derives a new clause using a single inference rule (resolution). 
- A classic result shows that any any resolution proof of unsatisfiability for the pigeonhole formula must be exponentially large. This means that no SAT solver whose reasoning is limited to resolution can avoid exponential behaviour on those instances. Constraint programming generalizes the classic resolution proof system, but when the input is a propositional formula, constraint programming amounts to applying the resolution, inheriting the same fundamental limitations. 
- **Extended resolution** is a technique from proof complexity that strengthens the classical resolution proof system by allowing the introduction of new auxiliary variables. These auxiliary variables are defined in terms of existing variables. 

