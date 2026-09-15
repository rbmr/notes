---
tags:
  - mathematics/graph-theory
  - mathematics/optimization
---
### Cycle Detection

Detecting existing cycles in a graph. 

- TODO: explain how to detect cycles in a directed / undirected graph

Detecting cycles upon edge addition.

- TODO: explain how to detect whether adding an edge creates a cycle in a directed / undirected graph.

### Topological Ordering

TODO: explain how to find the topological ordering of a graph

### Spanning Trees

- A **spanning tree** of a connected, undirected graph $G=(V,E)$ is a subgraph $T=(V,E')$, such that $E' \subseteq E$ and $T$ is a tree.  
- The **minimum spanning tree** (**MST**) is a spanning tree of an edge-weighted graph that minimizes the total weights of its edges.
	- Mathematically: Given a weight function $w: E \to \mathbb{R}$ that assigns a real number to each edge, the MST is the spanning tree $T=(V,E)$ that minimizes the sum $\sum_{e \in E'} w(e)$.
- **Kruskal's Algorithm** is a greedy algorithm that constructs the MST by repeatedly adding the lowest-weight edge that does not form a cycle, stopping when the tree has $|V|-1$ edges.
- **Prim's Algorithm** is a greedy algorithm that constructs the MST by growing a single continuous tree. Starting from an arbitrary root vertex, it repeatedly adds the lowest-weighted edge that connects a vertex inside the tree to a vertex outside the tree, stopping when all vertices are included. 

### Strongly Connected Components

- A **Strongly Connected Component** (**SCC**) of a directed graph $G=(V,E)$ is a maximal strongly connected subgraph. 
	- Mathematically: An SCC is a subset of vertices $C \subseteq V$ such that:
		1. For every pair of vertices $u,v \in C$ there exists a directed path from $u$ to $v$ AND from $v$ to $u$.
		2. No additional vertices from $v\in V \setminus C$ can be added to $C$ without breaking this property.
	- Every vertex in a directed graph belongs to exactly one SCC. Thus, the SCCs partition the vertex set $V$ into disjoint subsets.
- The **condensation** of a directed graph $G=(V,E)$ is a new graph $G'=(V',E')$ formed by treating every SCC of $G$ as a single vertex.
	- There exists a directed edge $(U,V)$ in $E'$ if and only if there exists at least one edge $(u,v) \in E$ from a vertex $u \in U$ to a vertex $v \in V$, where $U$ and $V$ are SCCs of $G$.
	- The condensation of any directed graph is always a DAG.
- The **transpose** $G^T=(V,E^T)$ of a directed graph $G=(V,E)$ is a graph where the direction of every edge is reversed: $E^T=\{ (v,u) \mid (u,v) \in E \}$.
- A straightforward method to determine the SCC a vertex $v$ belongs to by:
	1. Finding the set of nodes $F$ reachable from $v$ in $G$
	2. Finding the set of nodes $B$ reachable from $v$ in $G^T$, essentially traversing the graph backwards. Consequently, $B$ equals the set of nodes from which $v$ is reachable. 
	3. The SCC containing $v$ is the set $F \cap B$. 
- It is possible to find ALL strongly connected components of a directed graph in linear time, specifically $O(|V|+|E|)$ with [Tarjan's Algorithm](https://www.youtube.com/watch?v=wUgWX0nc4NY) or [Kosaraju's Algorithm](https://www.youtube.com/watch?v=5wFyZJ8yH9Q).
	- These algorithms naturally output SCCs of a graph $G$ in the reverse topological ordering of the corresponding condensation $G'$.

### Bipartite Graphs

- An **odd cycle** is a cycle of odd length, and an **even cycle** otherwise.
- A **bipartite graph** (or bigraph) is a graph whose vertices can be divided into two disjoint sets $U$ and $V$ such that every edge connects a vertex in $U$ to one in $V$.
	- A graph is bipartite if and only if it does not contain any odd cycles.
	- A bipartite graph is **complete** (denoted $K_{m,n}$) if every vertex in set $U$ (of size $m$) is connected to every vertex in set $V$ (of size $n$).
- A **matching** $M$ of a graph $G=(V,E)$ is a subset of edges $M \subseteq E$ such that every vertex is incident to *at most* one edge in $M$.
	- If a vertex is incident to an edge in $M$ it is considered **matched**, otherwise it is **unmatched**.
	- A **perfect matching** occurs if every single vertex in the graph is matched. 
- The **Maximum Bipartite Matching Problem** asks us to find a matching $M$ of maximum size, within a given bipartite graph $G=(U\cup V, E)$. 
	- A perfect matching only exists if $|U|=|V|$.
- A solution to the maximum bipartite matching problem can be found by interpreting the problem as a maximum flow problem, and using a maximum flow algorithm to find the maximum flow.
- As similar problem called the **linear assignment problem**, asks to find a perfect matching, but with minimal or maximal edge weights. This can similarly be solved using maximum flow.

### Vertex Cover

- The **Vertex Cover** of a (un)directed graph $G=(V,E)$ is a subset of vertices $C \subseteq V$ such that for every edge $\{u,v\} \in E$, either $u \in C$ or $v \in C$.
- A vertex cover $C \subseteq V$ is a **minimum vertex cover** if $|C| \leq |C'|$ for all vertex covers $C'$ of $G$.
- The decision problem of determining whether a given graph has a vertex cover of at most size $k$ is one Karp's original NP-Complete problems.
- **2-Approximation** is a greedy method, running $O(|V|+|E|)$ time for finding a vertex cover that is at most twice the size of the minimum vertex cover:
	1. Initialize an empty set $C=\emptyset$
	2. While the set of edges $E$ is not empty:
		1. Pick an arbitrary edge $\{u,v\} \in E$
		2. Add both endpoints $u$ and $v$ to $C$.
		3. Remove all edges from $E$ that are incident to either $u$ or $v$.
	3. Return $C$.
- **Kőnig's Theorem** states that for bipartite graphs, the size of the minimum vertex cover exactly equals the size of the maximum bipartite matching. 
- **Bounded Search Tree**: If we need an exact answer for general graphs, and expect the minimum cover size $k$ to be relatively small, we can use a recursive branching algorithm that runs in $O(2^k \cdot |E|)$ time. To determine whether a given graph $G=(V,E)$ has a vertex cover of size at most $k$, we use the following recursive logic:
	 1. Base case 1 (Success): If the graph has no edges, return True.
	 2. Base case 2 (Failure): If $k=0$ (but edges still remain), return False.
	 3. Branching, pick some edge $\{ u,v \} \in E$. Since a valid vertex cover must include at least one of its endpoints, we branch into two possibilities:
		 1. Option A (include $u$ in the cover): create a new graph $G_{u}$ by removing vertex $u$ and all its incident edges from $G$. Recurse for $G_{u}$ and $k-1$.
		 2. Option B (include $v$ in the cover): create a new graph $G_{v}$ by removing vertex $v$ and all its incident edges from $G$. Recurse for $G_{v}$ and $k-1$.
	 4. Return True if option A, or option B returns True.

### Feedback Vertex Set

- A **Feedback Vertex Set** (**FVS**) of a (directed or undirected) graph $G=(V,E)$, is a subset $X \subseteq V$ such that the removal of $X$ (and all its incident edges) from $G$ leaves a graph without cycles.
- The **Minimum Feedback Vertex Set** is a feedback vertex set $X \subseteq V$ such that $|X| \leq |X'|$ for all possible feedback vertex sets $X'$ of $G$.
- The decision problem of determining whether a given graph has a minimum feedback vertex set of at most size $k$ is one Karp's original NP-Complete problems.
- **Greedy method**: A simple and efficient way to find a valid (though not minimum) FVS in $O(|V|+|E|)$ time is by using DFS.
	- Initialize an empty set $X = \emptyset$.
	- Perform a DFS traversal on the graph.
	- Whenever a back-edge is detected, add the current vertex to $X$, remove it from the graph, and backtrack.
	- Return $X$.
- **Bounded Search Tree**: If we need an exact answer for an undirected graph, and expect the minimum FVS size $k$ to be relatively small, we can use a fixed parameter tractable (FPT) recursive branching algorithm. To determine whether a graph $G$ has an FVS of size at most $k$:
	1. Base case 1 (Success): If the graph has no cycles, return True.
	2. Base case 2 (Failure): If $k=0$ (but cycles still exist), return False.
	3. Reduction rules (repeat until exhausted):
		1. Clean up: Remove any vertices of degree $\leq 1$ (they cannot be part of any cycle).
		2. Contract: If a vertex $v$ has exactly degree $2$ (neighbours $u$ and $w$), bypass it by removing $v$ and adding an edge $\{ u,w \}$. If this creates a self-loop, the vertex must be in the FVS, add it to the cover, decrement $k$ and continue.
	4. Branching: Once fully reduced, every remaining vertex has a degree of at least $3$. Find a cycle $C$ in the graph (preferable shortest). Sine a valid FVS must break this cycle, it must include at least one vertex from $C$.
		1. For each vertex $v \in C$ create a new graph $G_{v}$ by removing vertex $v$ and all its incident edges from $G$. Recurse for $G_{v}$ and $k-1$.
	5. Return True if any of the recursive branches returns True.

(TODO: expand and elaborate on these notes using lecture 8 from FEB22002X Combinatorial Optimization 2025-2026 as reference)