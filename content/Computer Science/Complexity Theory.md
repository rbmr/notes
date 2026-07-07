
### Time Complexity

The **running time**, or **time complexity**, of an algorithm is informally defined as a function $f: \mathbb{N} \rightarrow \mathbb{N}$, where $f(n)$ represents the number of elementary steps an algorithm requires to solve a worst-case instance of input size $n$. These **elementary steps** include basic operations such as arithmetic calculations or numerical comparisons. While this informal model is practical and easy to use, formal and mathematically precise definitions of time complexity rely on the use of Turing machines.

Note that a superior [[Asymptotic Bounds|asymptotic upper bound]] on time complexity only says an algorithm is *eventually* more efficient for large input sizes, not that it is more efficient overall. It is frequently the case that an algorithm with a worse time complexity performs better on average for the actual distribution of inputs.

### Complexity Classes

To rigorously study and categorize the computational difficulty of problems, complexity theory focuses on decision problems. **Decision Problems** are problems that strictly ask for a "yes" or a "no" answer. Once can transform a problem for which the answer is a number, into a decision problem by applying a threshold or bound.

Based on the difficulty of computing or verifying solutions, decision problems are categorized into fundamental complexity classes:
- **Class P**: The class of decision problems for which there exists a polynomial time-time algorithm that can solve the problem.
- **Class NP** (Non-deterministic Polynomial-time): The class of decision problems for which there exists a certificate for each yes-instance, along with a polynomial time algorithm that can check whether a given certificate proves that a given instance is a yes-instance.
- **Class co-NP**: The class of decision problems for which there exists a certificate for a no-instance, along with a polynomial-time algorithm that can check whether a given certificate proves that a given instance is a no-instance.

A **reduction** is a function that transforms any instance of a problem $\Lambda$ to an instance from a problem $\Pi$, such that the yes or no outcome is perfectly preserved. A **polynomial-time reduction** (denoted as $\Lambda \propto \Pi$) from problem $\Lambda$ to problem $\Pi$ is a reduction that can be computed in polynomial time. If such a reduction exists, this shows $\Pi$ can be used to solve $\Lambda$. Informally, this implies "$\Pi$ is at least as hard as $\Lambda$".

Using reductions, we can then define the hardest classes in computer science:
- **Class NP-Hard**: A decision problem $\Pi$ is NP-hard if every single problem $\Lambda \in \text{NP}$ can be reduced to it in polynomial time ($\Lambda \propto \Pi$). Consequently, if a polynomial-time algorithm is ever found for an NP-hard problem, it would mean all problems in the class NP can also be solved in polynomial time. 
- **NP-complete**: A decision problem is NP-complete if it is both NP-hard and is also contained within the class NP.

### P versus NP

<iframe width="560" height="315" src="https://www.youtube.com/embed/YX40hbAHx3s?si=k5PYNfx5Pr7UBTOf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Fixed Parameter Tractability

- **Parameterized Complexity** is a branch of computational complexity theory that classifies hard (typically NP-hard) problems on a finer scale by measuring complexity in terms of both the total input size $n$ and a specific parameter $k$.
- A problem is **Fixed-Parameter Tractable** (**FPT**) if there exists an algorithm that solves it in $O(f(k) \cdot n^c)$ time, where:
	- $n$ is the size of the input.
	- $k$ is the parameter (often the size of the solution being sought)
	- $f(k)$ is a computable function that depends only on $k$.
	- $c$ is a constant independent of both $n$ and $k$.
- If a problem is FPT, the combinatorial inherent in NP-hard problem is entirely confined to the parameter $k$. If $k$ is known to be small in real-world application, the algorithm runs efficiently, effectively performing like a polynomial time algorithm $O(n^c)$.
- 