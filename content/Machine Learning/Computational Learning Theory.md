Under what conditions is a learning algorithm guaranteed to perform well?

### Probably Approximately Correct

The core philosophy of **Probably Approximately Correct** (**PAC**) is that we cannot expect a learner to learn a concept perfectly every single time (because we rely on a random sample of data). Instead, we aim for a learner that will **probably** (with high confidence) produce a hypothesis that is **approximately correct** (has very low error).

Formal definitions:
- **$X$ (Instance Space):** The set of all possible examples/instances.
- **$C$ (Concept Class):** The set of target concepts we want to learn. A concept $c$ is a function $c: X \rightarrow \{0,1\}$.
- **$D$ (Distribution):** A fixed, but unknown, probability distribution over the instances $X$.
- **$H$ (Hypothesis Space):** The set of possible hypotheses the learner considers to approximate the concept $c$.
- True Error ($error_D(h)$): The probability that the hypothesis $h$ disagrees with the true concept $c$ on a randomly drawn instance from $D$:
	$$
	error_D(h) = Pr_{x \in D}[c(x) \neq h(x)]
	$$

A Concept class $C$ is PAC-learnable if there exists an algorithm (Learner $L$) such that for every concept $c \in C$ and every distribution $D$:
- Approximately Correct: The learner outputs a hypothesis $h$ such that the error is bounded by a small parameter $\epsilon$:
	$$
	error_D(h) \leq \epsilon
	$$
- Probably: The above condition holds with a probability of at least $1-\delta$ (where $\delta$ is the confidence parameter indicating the probability of failure):
	$$
	Pr(error_D(h) \leq \epsilon) \geq 1 - \delta
	$$
- Efficiency: The learner must achieve this using a sample size $m$ and computation time that are polynomial in $1/\epsilon$, $1/\delta$, and the complexity of the concept.

A major goal of PAC theory is determining the bound on $m$ (the number of training samples) required to guarantee learning.

- **Discrete Hypothesis Spaces**: A **consistent learner** is one that produces a hypothesis with zero error on the training set. But, fitting the training data does not guarantee the true error is low. The **Version Space** is the set of all hypotheses consistent with the training data. We want this version space to be $\epsilon$-exhausted, meaning it contains no hypotheses with a true error $> \epsilon$. The bound for the number of samples $m$ required to ensure this with probability $1 - \delta$ is:
	$$
	m \geq \frac{1}{\epsilon}(\ln|H| + \ln(1/\delta))
	$$
	- Interpretation: the number of samples needed grows with the size of the hypothesis space and the required precision. If your search space $|H|$, you need more data to narrow it down.
- **Continuous Hypothesis Spaces**: The slides provide a concrete example of learning an axis-parallel rectangle in a 2D plane. 
	- Strategy: the learning finds the tightest fit rectangle $R'$ around the positive training examples. 
	- Analysis: The error is the area difference between the true rectangle $R$ and the learned rectangle $R'$. By analyzing the probability that training points "miss" the error strips along the edges, we can derive a sample bound.
	- The bound: For axis-parallel rectangles, the sample complexity is: $m > \frac{4}{\epsilon}\ln\left( \frac{4}{\theta} \right)$
	- This shows that even with infinite possible rectangles we can find a finite sample size to guarantee PAC learning.
- **VC-dimension**: For general continuous spaces where we cannot count $|H|$, we use the Vapnik-Chervonenkis (VC) dimension. The VC-dimension replaces $\ln|H|$ in the sample complexity formula. It measures the "capacity" or complexity of the hypothesis space (roughly, how flexible the model is).

There is a fundamental trade-off between the number of samples $m$, the allowable error $\epsilon$, and the confidence $\theta$. To get higher confidence or lower error, you typically need more data. 

> **No Free Lunch Theorem**: Across all problems, no single learner is better than any other. A learner only performs well if its hypothesis space is suited to the problem.

### Weak vs Strong Learners

A **Strong learner** (PAC-learner) is a learner that can achieve an arbitrarily small error $\epsilon$ with arbitrarily high confidence $1-\delta$.

A **Weak Learner** is a learner that performs only slightly better than random guessing with some fixed error rate and a fixed confidence.

It has been Mathematically proven that if a "weak" learner exists, it can be "boosted" into a strong learner. This means that strict PAC requirements are not always necessary, we just need a learner that is slightly better than a coin toss.

The original idea behind **boosting** involves resampling the training data. 
1. Train a weak learner
2. Identify the objects that were misclassified.
3. Repeat 1-2 with the misclassified objects, some number of times.
4. The final prediction is made by a majority vote of the collection of weak learners.

### Adaptive Boosting (AdaBoost)

**AdaBoost** is a constructive algorithm designed to implement the theoretical promise of boosting: turning a weak learner into a strong PAC learner. Instead of resampling the data like original boosting, AdaBoost works by explicitly re-weights the training instances.
- Linear Additive Model: AdaBoost builds a strong classifier $F_K(x)$ by creating a weighted sum of $K$ weak classifiers. The final decision is a linear combination of these weak learners:
	$$
	F_K(x) = \sum_{k=1}^{K} \alpha_k f_k(x)
	$$
	- Here, $f_k(x)$ are the weak classifiers (outputting binary $\pm 1$) and $\alpha_k$ are their corresponding weights.
- Exponential Loss: The algorithm optimizes the model by minimizing an exponential loss function rather than a standard 0-1 loss. The loss $L$ over $N$ training examples is defined as:
	$$
	L = \sum_{i=1}^{N} \exp(-y_i F_K(x_i))
	$$
	- This function heavily penalizes incorrect classifications (where $y_i$ and predicted $F_K(x_i)$ have different signs).
- Optimizing all weights $\alpha$ and classifiers $f$ simultaneously is an open problem. Therefore, AdaBoost uses a "greedy" incremental approach:
	- At each step $K$, the algorithm fixes the previously learned ensemble ($F_{K-1}$) and only attempts to find the best _new_ weak classifier $f_K$ and its weight $\alpha_K$ to add to the sum.

The full algorithm:
1. **Initialize Weights:** Start by assigning every training object an equal weight $w_i = 1$.
2. Train Weak Classifier: Train a new classifier $f_K$ that minimizes the weighted error $\epsilon_K$ on the training set. This forces the learner to focus on objects with high weights (those that were previously misclassified).
	$$
	\epsilon_K = \sum_{i=1}^{N} w_i \mathcal{I}(f_K(x_i) \neq y_i)
	$$
3. Compute Classifier Weight ($\alpha_K$): Calculate how much "say" this new classifier should have in the final vote. The better the classifier (lower error $\epsilon_K$), the higher its weight $\alpha_K$:
	$$
	\alpha_K = \frac{1}{2} \ln\left(\frac{\sum w_i}{\epsilon_K} - 1\right)
	$$
4. Update Object Weights: Re-calculate the weights for the training objects. Objects that were correctly classified get their weights decreased, while those that were wrongly classified get their weights increased.
	$$
	w_i \leftarrow w_i \cdot \exp(-y_i \alpha_K f_K(x_i))
	$$
5. **Repeat:** Iterate this process until $K$ classifiers are trained. The final strong classifier is the sign of the weighted sum of all weak classifiers.
