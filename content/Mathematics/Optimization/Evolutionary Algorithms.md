These notes are based on the course CS4205 Evolutionary Algorithms 2025-2026 from Delft University of Technology.

### Introduction

Three main ingredients:
1. A population of individuals.
2. Selection (to determine which individuals to keep)
3. Variation (to create new individuals, aka offspring)

*How* each of these ingredients are handled is subject to debate. This includes which stochastic operators to use (mutation, crossover, recombination, stochastic selection, etc), the size of the populations to use, and the amount of variation.

General Evolutionary Algorithm: $EA(n)$
1. $t \leftarrow 0$
2. $\boldsymbol{P^t} \leftarrow createAndEvaluateInitialIndividuals(n)$
3. **while** $terminationCriterionNotSatisfied(\boldsymbol{P^t})$ **do**
	1. $\boldsymbol{O^t} \leftarrow createAndEvaluateOffspring(\boldsymbol{P^t})$
	2. $\boldsymbol{P^{t+1}} \leftarrow selectSurvivingIndividuals(\boldsymbol{P^t}, \boldsymbol{O^t})$
	3. $t \leftarrow t + 1$

Consider the following general optimization problem. 
$$
(\arg)\max_{x\in S}\{f(x)\}
$$
We will compare the general term used, against the term used in evolutionary algorithms (EA).
- $f$ is the **optimization** function.
	- $f^{EA}$ is  the **fitness** (or evaluation) function
- $x$ is a **solution** ($x^*$ is an optimal solution)
	- $x^{EA}$ is an **individual**, or a **genotype**, and $x$ is the **phenotype**.
- $S$ is the set of all **feasible** solutions.
	- $S^{EA}$ is the **feasible search space** of the EA.

Optimization is key in many (real-world) situations. However, the right tool depends on the job. One critical aspect is how much is known/understood about the problem.
- **Black Box Optimization** (**BBO**) has no prior knowledge about the objective function $f$. Optimization is generally a matter of guessing, evaluating, and retrying intelligently.
- **White Box Optimization** (**WBO**) everything is known and understood about the problem, and you may use this to your advantage. This may include solving (parts of) the problem analytically, and building problem-specific algorithms.
- WBO is typically superior for simple problems, and allows for finding the true optimum. For BBO, its not possible to find the true optimum if the search space is infinite, however BBO algorithms are generally superior for complex problems, and generalize better.
- In the real world, problems are often some shade of gray (GBO). We may use some problem-specific aspects, but not everything is known.

Evolutionary Algorithms may fill the role of a flexible/generic, powerful, parallelizable, optimization technology aimed at BBO/GBO.

### Classic Simple Genetic Algorithm

Algorithm

- The **genotype** is a binary string of fixed length $\ell$.
1. We **initialize** by creating $n$ binary strings uniformly.
2. First we select $n$ parents to reproduce (allowing duplicates). The selection probability $p_{i}^S$ of a parent $P_{i}$ is based on its proportion of fitness $f$ contributed: $p_{i}^S= f(P_{i})/\sum_{i=0}^{n-1}f(P_{i})$. Consequently the expected number of copies of individual $i$ is $np_{i}^S$. Issues:
	- Requires fitness maximization, and non-negative fitness.
	- Far above average individuals quickly dominate the entire population.
	- Similar fitness (convergence) dissolves the selection pressure.
3. From the selected parents, we create $n/2$ groups of $2$ parents **randomly**. For each 2 parents we create 2 offspring.
	- We apply crossover with probability $p_{c}$. Crossover methods include one-point crossover, two-point crossover, and uniform crossover.
	- After crossover, we flip each bit with probability $p_{m}$ (mutation).
4. Finally we replace the entire population with the generated offspring. And repeat from 2. We terminate when either:
	- A maximum is reached in terms of time, or number of function evaluations.
	- Diversity is lost: all genotypes are (almost) the same, all fitness values are (almost) the same. 
	- A desired fitness level is reached.

### Schema Analysis of GAs

- A **schema** (plural: "schemata") is a vector of length $\ell$. The **Domain** of the schema is $\times_{i=0}^{\ell-1}\{ 0,1,\star\}$, where $\star$ is a wildcard. The **similarity subset** is the subset $h$ of all $\ell$-dimensional binary genotypes that match the schema. Example: $1\star \star\ 0 =\{ 1000,1010,1100,1110 \}$. 
- We use $\bigstar$ to denote the all-wildcard schema $\{ \star \}^\ell$, all genotypes match $\bigstar$.
- General idea: observe change in average fitness of a schema in a single generation, we extrapolate the result over multiple generations. This gives a prediction of the behaviour of the average schema fitness.
- We use $\mu(h,t)$ to denote the number of individuals in population $P_{t}$ that match the schema $h$. Furthermore, we use $\varphi(h,t)$ to denote the cumulative fitness of these individuals. The population based average schema fitness becomes $\bar{\varphi}(h,t)=\varphi(h,t)/\mu(h,t)$. The probability that a selected individual matches the schema $h$ is $\psi(h,t)=\frac{\varphi(h,t)}{\varphi(\bigstar,t)} = \frac{\bar{\varphi}(h,t) \mu(h,t)}{\bar{\varphi}(\bigstar,t) n}$ 
- The expected number of copies of instances of schema $h$ in the next generation is denoted as $E[\mu(h,t+1)]$. 
- Without variation, if the population-based average schema fitness $\bar{\varphi}(h,t)$ remains larger than the average population fitness $\bar{\varphi}(\bigstar,t)$, then # matches of $h$ grows exponentially (geometrically).
- Variation may lead to disruption and reconstruction.
	- **Disruption** is when at least one parent matches the schema, but the offspring do not match the schema. We denote the probability of disruption as $\epsilon(h)$.
	- **Reconstruction** is when no parents matches the schema, but the offspring does. Reconstruction is assumed to have a negligibly small probability. 
	- Consequently we obtain the **schema growth equation**:
		$$
		E[\mu(h,t+1)] \geq\mu(h,t) \frac{\bar{\varphi}(h,t)}{\bar{\varphi}(\bigstar, t)}(1 - \epsilon(h))
		$$
	- We use the $\geq$ sign instead of $=$ because we left out reconstruction.
- The schema growth equation says that the number of times a schema appears in the population increases if the product $\frac{\bar{\varphi}(h,t)}{\bar{\varphi}(\bigstar, t)}(1 - \epsilon(h))$ is $>1$. 
	- The average population fitness $\bar{\varphi}(\bigstar,t)$ catches up with the average schema fitness $\bar{\varphi}(h,t)$ due to the finite population size $n$. Which decreases $\frac{\bar{\phi}(h,t)}{\bar{\phi}(\bigstar, t)}$ with each generation.
	- **defining length** of the schema (distance between outer fixed bits), increases the probability of disruptions with one-point crossover, but not with uniform crossover or bit-wise mutations.
	- **order** of the schema (number of fixed bits in the schema), increases the probability of disruptions with one-point crossover, uniform crossover, and bit-wise mutations.
- The **schema theorem** states that low-order, above-average schemata with a small defining length receive an exponentially increasing number of matches in subsequent generations in simple GA. Schemata that meet these criteria are called **building blocks**.

### Tournament Selection

Selection methods

- **Proportionate selection**: selects individuals based on their proportion of fitness contributed.
- **Rank/domination-based selection**: sorts individuals based on their fitness (removes dependency on actual fitness, we just need the order).
- **Tournament Selection** to select $n$ solutions, we repeat $n$ times: pick $s \geq 2$ individuals, select the best solution. For picking the $s$ individuals we pick randomly, either with or without replacement.
	- with replacement: some solutions may never be considered, 
	- without replacement: every solution is considered $(sn)/N$ times, and order of solutions to choose from is randomized each "round", and boundary cases when $N \bmod s \neq 0$ are handled carefully.

Takeover time for Tournament Selection

- Let $P(t)$ be the **proportion of copies** of the best individual found in the initial population after $t$ selection rounds. We have $P(0)=1/n$. Let $Q(t)$ be the proportion of all other individuals, i.e. $Q(t)=1-P(t)$.
- The **takeover time** is the number of generations $t$ until the population has (almost) only copies of initially-best. Mathematically, this is the generation $t$, where $P(t)=(n-1)/n=1-(1/n)$, or equivalently $Q(t)=\frac{1}{n}$
- Simplifying assumptions: Suppose every generation, $n$ offspring are generated and $n$ of these offspring are selected to fill the next population. We disregard the use of variation.
- A non-best solution can only get selected when it is pitted against all non-best solutions, so $Q(t)=Q(t-1)^s=Q(0)^{(s^{t})}=\left( 1-\frac{1}{n} \right)^{(s^t)}$. 
- Substituting, and reworking gives $t \approx \log(n \log n)/\log(s)$ for large $n$. This means that in order to get a larger takeover time, the population size must grow significantly. 
- Consequently, efficiency does not come from increasing the population size, but from tuning your algorithm so that good genetic patterns multiply fast enough to combine into the optimal solution before that convergence happens.

### Modern Simple Genetic Algorithm

The Modern Simple Genetic Algorithm (modern sGA)

- In the P+O setting we determine the next population by generating $n$ offspring, and then selecting $n$ individuals from the combined pool $P \cup O$ of the current parent population $P$ and the newly generated offspring $O$. Because the parent population size is $n$, and the offspring population size is $n$, the combined selection pool $P \cup O$ has a total size of $2n$.
- To select $n$ survivors from the combined pool, modern sGA applies two rounds of tournament selection with $s=4$, and without replacement.
- This setup guarantees **elitism**, the best solution found so far is completely protected from being lost due to variation (mutation or crossover). Specifically, the absolute best solution in the combined pool is guaranteed to win its tournament both times the deck is shuffled, resulting in exactly 2 copies moving into the next generation. This ensures that once a local optimum is found, the algorithm exhibits effective convergence. 

The 3 core parameter settings matter a lot:
- high values for **mutation probability** slow down convergence
- **population size** determines initial supply of knowledge to make variations of
- choice of **variation operators** are in general important

### Permutation 

- Genes must be integer and unique (permutations).
- Aforementioned cross-over methods dont work since they create infeasible solutions. You can repair them, but that works poorly in general. Problem-specific repair is a bit better, but not needing repair is generally best. We want **permutation specific crossover**.
- **Davis's order crossover** (**OX**) (2 parent permutations, 1 offspring): copy a part from one parent to the offspring, read the rest from the other parent from the cut onwards, wrapping around and using only elements that are not used yet.  
- **Partially Mapped crossover** (**PMX**) (2 parent permutations, 1 offspring): copy a part from one parent to the offspring, read the rest from the other parent from left to right, resolve conflicts by (TODO: I dont understand this)
- **Cycle crossover** (**CX**) (2 parent mutations, 1 offspring): (TODO)
- **Edge crossover** (**EX**) (2 parent mutations, 1 offspring): designed around the traveling salesman problem.
	1. First we create a table mapping each element to the elements it is connected to in either parent. 
	2. Pick a random element to start from. And remove it from the table. 
	3. Pick element in its adjacency list that itself has the shortest adjacency list (break ties randomly). 
	4. If no such element exist, pick a random element that has not been picked yet.
	5. Repeat last 2 steps until finished.
	- The order in which elements were picked determines the new permutation.
- **Bean's Random Keys** takes a different approach. Instead of directly encoding the permutation sequence, it assigns a random real number to each integer. This array of real numbers is the genotype. The permutation sequence is derived by sorting the integers based on their assigned real numbers. This ordering is the phenotype. Because the genotype is just a list of independent numbers, you can apply any of the classic GA operators.
- Many other crossover methods or variations of the aforementioned crossover methods exist. They exploit different parts of the problem structure. The best operator is the operator that matches best with the problem.

### Real-Valued Genetic Algorithms

- Contrary to with integer valued optimization problems, you cannot sample the all possibilities in real spaces. Furthermore, mixing genes will never work either because intermediate values are not explored.
- We take convex combinations of parents to stay within solution space. However, the solution may be outside the population range, so we need to go beyond convex combinations. 

Classic Differential Evolution (DE)

- (TODO: explain how this works)

Classic Particle Swarm Optimization (PSO)

- (TODO: explain how this works)

Gaussian Real-valued Variation

- (difference vectors are still somewhat restrictive, so we want probability distributions. We perform variation by drawing samples from the distribution)
- (a natural probability distribution is the normal distribution since its widely used, relatively simple, unimodal, and symmetrical)

Classic Evolution Strategies

- (in order to improve the probability of generating better solutions, we want some way to shape the probability distribution intelligently)
- (idea: encode the normal distribution parameters (called strategy parameters) into the genotype of each individual. Degrees: one variance, $\ell$ variances, or a full covariance matrix)
- (note: for the covariance matrix, we store the rotations instead of the covariances because the covariance matrix must remain positive definite)
- (we mutate the individual according to the distribution encoded by its strategy parameters)
- (we mutate the variance parameters by multiplying them by a log normal distribution (with mu zero), and ensuring they dont drop below a small threshold value (epsilon set by user). 
- (for multiple variance parameters we have a global Z and an individual Zi, global Z allows for significant mutations of all dimensions at once, which is improbable with individual Zi but sometimes necessary)
- (for rotation angles it is normal additively mutated)
- (recombination may also take place, but it is generally considered less important. Recombination generates one offspring at a time, recombination happens per component.)
- (three specific ways to recombine parents components are: (1) component is set to average of entire population, (2) component is set to convex combination of parent parameters, (3) component is set to a random value from one of the parents)

### Genetic Programming

- **Symbolic Regression**: Given some data $X \in \mathbb{R}^{n \times d}$ and $y \in \mathbb{R}^n$, find a mathematical expression $f: \mathbb{R}^d \to \mathbb{R}$ such that $y \approx f(X)$.
	- We use MSE to measure goodness of fit.
- **Genetic Programming** is a technique to stochastically evolve a population of individuals encoding computer programs.
	- Core representation: a tree.
	- Function set: set that contains the atomic functions that GP can compose to form (sub-)functions or (sub-)programs.
	- Terminal set: set that contains the terminals that GP can use in the composition to form (sub-)functions or (sub-)programs.
	- Primitive set: function set + terminal set.
- Initialization: 
	- GROW: up to a maximum depth, select randomly across all primitives. Once the maximum depth is reached select only terminals.
	- FULL: same as grow, but terminals only appear in the last level of the tree.
	- population is divided into bins, each bin with its own max bin depth. Bins are further split between grow and full 50/50.
- non-injective: many different trees with the same output
- terminals might include constants, but its difficult to choose them:
	- evolve the constants? -> ephemeral constants
	- just scale and translate the evolved model to minimize MSE -> linear scaling (LS). This has a closed form solution for least square.
- Fitness evaluation: MSE with a penalty for complexity. 
	- Complexity can be measured by depth of the tree, number of nodes, length of the expression.
- Termination: 
	- maximum number of generations reached
	- desired fitness threshold achieved
	- no improvement for k generations
	- maximum computation time exceeded
- Selection: 
	- select fitter individuals with higher probability.
	- preserve high quality solutions
	- maintain diversity
- Crossover:
	- subtree crossover, swap sub-trees in a way that does not exceed maximum depth.
- Mutations:
	- replace randomly selected subtree with a new random subtree
	- replace a randomly selected node with a compatible randomly selected node
	- replace an entire tree with one of its subtree
	- replace randomly selected subtree with a randomly selected terminal
	- apply a permutation to the arguments of a functional.

- Sufficiency: to find a solution we must be able to represent it. Usually, we cannot ensure sufficiency, but we might still obtain solutions that are good approximations.
- Closure: the primitives sets (functionals and terminals) and the variation operators must respect the property of closure. We must be able to mix the primitives without problems. Type consistency is especially important. Solutions:
	- Flexibility, make functions type flexible (TRUE=1, FALSE=0)
	- Constraints: put constraints on the variation operators, and only swap compatible sub-trees. 
	- Repair invalid sub-trees (fix them or substitute them)
- Evaluation Safety: An atomic function is evaluation safe if its evaluation does not compromise the evolution. Primitives that can fail at runtime should be protected to avoid runtime failures.
- Trees can get really big. We can limit their size by: 
	- limiting the size of individuals:
	- remove non-coding regions
	- punish individuals that are too big
- How to handle overfitting?
	- K-fold cross validation
- How to handle underfitting?
	- tree size/depth is too restrictive
	- not enough data
- Linear GP: use assembly like instructions instead of LISP functional structures.
- Cartesian GP: represents programs as circuits / graphs. Useful for problems with many inputs and many outputs. 
- Why do we care? Generally more explainable, and data efficient.
	- Interpretability is not clearly defined.
- GP has to solve multiple problems. And goals conflict signaling a tradeoff.
- Many ways to encode the same expression, learned one is often not the smallest.
	- Simplify using computer algebra systems (CAS), or E-graphs.
- Expression accuracy depends on structure and constants. Finding the best constants is a real-valued optimisation problem. But GP only optimizes structure, constants can be combined into new values.

### Multi-Objective EAs

- Evolutionary Multi-objective Optimization (EMO). We want a representative subset of elements from the pareto set. 

