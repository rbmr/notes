![[machine_learning_2x.png|300]]

Reference: https://xkcd.com/1838/ 

#### Definition of AI

Artificial Intelligence (AI) is a term that is hard to define. In particular because the concept of "intelligence" is abstract and subjective, and the standard for what we consider "intelligent" constantly rises as technology masters new tasks.

I like the following definition:
> **Artificial intelligence** (**AI**) is the capability of computational systems to perform tasks typically associated with human intelligence. 
> 
> Reference: [https://en.wikipedia.org/wiki/Artificial_intelligence](https://en.wikipedia.org/wiki/Artificial_intelligence)

#### Learning vs Non-Learning

An **algorithm** is a finite sequence of rigorous, stepwise instructions used to perform a computation. Traditionally, each of the instructions in an algorithm are written directly, and explicitly. 

Sometimes, its near-impossible to formulate all the rules necessary to solve a problem (efficiently). So instead of telling a computer how to do something, we explain how to *learn* how to do something instead. 

> **Machine learning** (**ML**) is a field of study in artificial intelligence concerned with the development and study of statistical algorithms that can learn from data and generalise to unseen data, and thus perform tasks without explicit instructions.
> 
> Reference: [https://en.wikipedia.org/wiki/Machine_learning](https://en.wikipedia.org/wiki/Machine_learning)

Almost all machine learning can be reduced to following:
- Define a model family $f(\mathbf{x};\theta)$ with parameters $\theta$.
- Define an objective function $F$ that quantifies how well the model performs on the training examples $\mathcal{D}$.
- Use an algorithm to find the parameters $\theta$ for which the objective function $F$ is maximal (or minimal) with respect to $\mathcal{D}$.
- Finally, evaluate whether the model generalizes well to unseen scenarios.

Most AI systems consist of a combination of both Learning and Non-learning components.

#### Subdividing Machine Learning

Machine learning is commonly separated into three main learning paradigms: supervised learning, unsupervised learning, and reinforcement learning.

- [[Supervised Learning]]: For every input vector $\mathbf{x}_{i}$ in the dataset there is a corresponding correct output (or "ground truth") $y_{i}$. The goal is to learn a mapping that approximates this relationship well enough to predict $y$ for new, unseen $\mathbf{x}$.
- [[Unsupervised Learning]]: The dataset is simply a collection of vectors $\mathcal{D}=\{\mathbf{x}_{i}\}^N_{i=1}$. The goal is generally to discover patterns or structure within the data itself, such that this structure also holds for unseen data. 
- **Reinforcement Learning**: Data is not provided as a static set but is generated dynamically through interaction between an agent and an environment. The goal is to learn a mapping from states to actions (a policy) $\pi$ that maximizes the expected cumulative reward (return) over time.

Note that machine learning as a concept is highly flexible. Machine learning comes down to using an algorithm to tune some weights to minimize a loss function with respect to some training examples. Therefore these paradigms are not exhaustive nor do they provide strict boundaries.

