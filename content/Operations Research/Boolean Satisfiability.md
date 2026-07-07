### Boolean Satisfiability

The **Boolean Satisfiability Problem** (often abbreviated as SAT) is the problem of determining whether there exists an assignment of truth values to a set of Boolean variables that makes a given Boolean formula true. 

If such an assignment exists, the formula is deemed **satisfiable**. If no such assignment exists the formula is **unsatisfiable**.

SAT is the first problem that was proven to be NP-complete (by the Cook-Levin theorem). No known algorithm efficiently solves all instances of SAT in polynomial time.

To formalize SAT, formulas are typically expressed in [[site/Mathematics/Logic#Normal Forms|Conjunctive Normal Form]] (CNF). A formula in CNF is a conjunction (logical AND $\land$) of one or more clauses, where a clause is a disjunction (logical OR $\lor$) of literals. A literal is either a variable $x_{1}$ or its negation $\neg x_{1}$.  

### 2-Satisfiability

**2-Satisfiability** (**2-SAT**) is a restricted case of the Boolean Satisfiability problem where the input formula is in CNF, and every clause contains exactly two literals. 2-SAT can be solved in linear time.

Process:
1. Model the 2-SAT problem as a directed graph.
	- For a formula with $n$ distinct Boolean variables $x_{1}, x_{2}, \dots, x_{n}$, the graph will have exactly $2n$ nodes. Every variable $x_{i}$ is represented by two separate nodes, one for the positive literal $x_{i}$, and one for its negation $\neg x_{i}$.
	- For a formula with $m$ distinct clauses we create $2m$ edges. For every clause $A \lor B$, where $A$ and $B$ are literals, we add two directed edges to the graph:
		1. An edge ($\neg A$, $B$), representing $\neg A \implies B$.
		2. An edge ($A$, $\neg B$), representing $A \implies \neg B$.
2. Find the [[Graph Theory#Strongly Connected Components|strongly connected components (SCCs)]] of the graph.
3. The 2-SAT formula is unsatisfiable if some variable $x_{i}$ and its negation $\neg x_{i}$ are in the same SCC. 
	- Reasoning: if $x_{i}$ and $\neg x_{i}$ are in the same SCC, then $x_{i} \implies \neg x_{i}$ AND $\neg x_{i} \implies x_{i}$, creating the contradiction $x_{i} \iff \neg x_{i}$.
4. If no variable and its negation are in the same SCC we can find a satisfying assignment as follows:
	 1. Consider the condensation graph of SCCs which naturally forms a directed acyclic graph (DAG). 
	 2. Go over the SCCs in reverse topological order. For each literal $A$ in the SCC, if it is unassigned, assign it to be True ($\top$), and set its negation $\neg A$ (guaranteed to be in a different SCC) to be False ($\bot$). 
	 3. The resulting assignment is a satisfying assignment.

### 3-Satisfiability

**3-Satisfiability** (**3-SAT**) is a restricted case of the Boolean Satisfiability problem where the input formula is in CNF, and every clause contains exactly three literals. Unlike 2-SAT, which can be solved in linear time, 3-SAT is NP-complete.

Any general SAT problem expressed in CNF can be reduced to 3-SAT in polynomial time. This is achieved by transforming clauses that have more or fewer than three literals into equivalent sets of 3-literal clauses using auxiliary variables:
- A clause $l_{1} \lor l_{2} \lor \dots \lor l_{k}$ with $k > 3$ can be split into 3-literal clauses by introducing $k-3$ new variables $y_{1}, y_{2}, \dots, y_{k-3}$, as follows:
	$$
	(l_{1} \lor l_{2} \lor y_{1}) \land(\neg y_{1} \lor l_{3} \lor y_{2}) \land (\neg y_{2} \lor l_{4} \lor y_{3}) \land \dots \land (\neg y_{k-3}, l_{k-1}, l_{k})
	$$
- Trivially, $(l_{1} \lor l_{2}) \equiv (l_{1} \lor l_{2} \lor \neg y_{i}) \land (l_{1} \lor l_{2} \lor y_{i})$ and $(l_{1}) \equiv (l_{1}\lor y_{1}) \land (l_{1} \lor \neg y_{1})$.

### Tseitin Transformation

TODO:
- define equivalence
- define equisatifisability
- explain the tseitin transformation

### SAT Solvers

TODO: explain how SAT solvers work (for a formula already in CNF) 

### Maximum Satisfiability

TODO: define MaxSAT

### Satisfiability Modulo Theories

TODO: define Satisfiability Modulo Theories