---
tags:
  - mathematics/optimization
  - mathematics/graph-theory
---
### Flow Networks

- A **flow network** is a directed graph $G = (V,E)$ where each edge $(u,v)\in E$ has a non-negative **capacity** $c(u,v)\geq 0$ if an edge does not exist between $u$ and $v$, its capacity is assumed to be $0$.
	- We distinguish two special vertices a **source** node $s$ (which produces flow), and a **sink** node $t$ (which consumes flow).
	- We assume without loss of generality that the source $s$ has no incoming edges, and the sink $t$ has no outgoing edges. Mathematically: $\forall v \in V: c(v,s)=c(t,v)=0$.
- A **flow** is a function $f: V \times V \to \mathbb{R}$ that represents the rate of material moving through the edges. To be a valid flow, it must satisfy the following conditions:
	- The flow on an edge cannot exceed its capacity, and cannot be negative. 
		- Mathematically: $\forall u,v \in V: 0 \leq f(u,v) \leq c(u,v)$.
	- For every vertex $u$ except the source $s$ and the sink $t$, the total flow entering the node must exactly equal the total flow leaving the node.
		- Mathematically: $\sum_{v \in V}f(v, u)=\sum_{v \in V}f(u,v)$ for all $u \in V \setminus \{ s,t \}$.
- The **value of a flow** (denoted $|f|$) is the net total flow leaving the source $s$, due to flow conservation, this is also exactly equal to the total flow entering the sink $t$.
	- Mathematically: $|f| = \sum_{v \in V}f(s,v)=\sum_{v \in V}f(v,t)$.
- An **$s-t$ cut** is a partition of the vertices $V$ into two disjoint sets $S$ and $T$ such that source $s \in S$ and the sink $t \in T$. 
	- The **capacity of a cut** (denoted $c(S,T)$) is the sum of capacities of all edges from set $S$ to set $T$. Mathematically $c(S,T)=\sum_{u\in S,v\in T}c(u,v)$.
	- The **net flow across a cut** (denoted $f(S,T)$) represents the net material moving from $S$ to $T$. Mathematically: $f(S,T)=\sum_{u \in S, v\in T}f(u,v)-f(v,u)$.
	- For any valid flow $f$ and any $s-t$ cut $(S,T)$, the net flow across the cut is exactly equal to the value of the flow $f(S,T)=|f|$.
	- Because the flow on any edge cannot exceed its capacity and the flow returning from $T$ to $S$ must be non-negative $f(u,v)\geq 0$ the net flow across any cut can never exceed the capacity of that cut $|f|=f(S,T)\leq c(S,T)$.

### Maximum Flow Problem

- The **maximum flow problem** asks us to to find a valid flow $f$ with maximum value $|f|$ for a given network.
- The **Max-Flow Min-Cut Theorem** states that in any flow network, the maximum value of an $s-t$ flow is exactly equal to the capacity of the $s-t$ cut with minimum capacity. 
- The **residual network** (denoted $G_{f}=(V,E_{f})$) is a directed graph that represents the remaining capacity available to push additional flow given a current flow $f$ and an existing flow network $G$.
	- The **residual capacity** (denoted $c_{f}(u,v)$) is the maximum amount of additional flow that can be pushed along a specific edge $(u,v) \in E_{f}$ in the residual network. This corresponds any additional flow that can be pushed along the edge $(u,v)\in E$ in the original graph, and the ability to cancel or redirect existing flow along the edge $(v,u) \in E$.
		- Mathematically $c_{f}(u,v)=(c(u,v)-f(u,v))+f(v,u)$.
	- An edge $(u,v) \in E_{f}$ is only included if $c_{f}(u,v)>0$.
- The **Ford-Fulkerson Method** is a greedy method for computing the maximum flow in a network. The algorithm works by repeatedly finding an **augmenting path** (a simple path from $s$ to $t$ in the residual network) and pushing as much flow as possible along that path. It stops when no augmenting paths can be found.
	- The basic Ford-Fulkerson does not specify how to choose the augmented path. 
	- **Edmonds-Karp Algorithm** is an optimized version of Ford-Fulkerson that uses BFS to always select the shortest augmenting path (in terms of number of edges, unweighted). This guarantees termination and gives a time complexity of $O(|V||E|^2)$.
	- **Dinic's Algorithm**: A faster algorithm that constructs a "level graph" (using BFS to map the shortest distance from $s$) and pushes flow along multiple paths simultaneously by finding the "blocking flow" via DFS. It achieves a time complexity of $O(|V|^2|E|)$ in general, and $O(|E|\sqrt{ |V| })$ on unit capacity networks like bipartite matching, making it highly efficient in practice.  
- **Push-Relabel Algorithms** take a different approach. Rather than finding full $s-t$ paths, they relax the flow conservation constraint during execution, maintaining a "preflow" (where the flow entering a node can exceed the flow exceeding it), pushing excess flow locally to adjacent nodes based on a "height" label. Optimized versions achieving a time complexity of $O(|V|^3)$ or $O(|V|^2\sqrt{ |E| })$.
