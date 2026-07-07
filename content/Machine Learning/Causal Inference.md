### References

- CAUSAL INFERENCE IN STATISTICS: https://web.cs.ucla.edu/~kaoru/primer-complete-2019.pdf
	- Chapters 1.1-1.2, 1.5, 2, and 3-3.6
	- Pages: 21-26, 46-54, 55-72, 73-95
- CAUSAL INFERENCE What if: https://miguelhernan.org/whatifbook
	- Section 12.1-12.2, and Chapter 13
- S.R. Künzel, J.S. Sekhon, P.J. Bickel, & B. Yu, Metalearners for estimating heterogeneous treatment effects using machine learning, Proc. Natl. Acad. Sci. U.S.A. 116 (10) 4156-4165, https://doi.org/10.1073/pnas.1804597116 (2019).

### Causality

Causation is a distinct and necessary addition to traditional statistics. While statistics identifies associations, causal inference is required to understand the mechanisms generating the data, in order to predict the results of actions.

**Simpson's paradox** is a phenomenon in probability and statistics in which a trend appears in several groups of data but disappears or reverses when the groups are combined. 

**Example 1**: A group of sick patients are given the option to try a new drug. Among those who took the drug, a lower percentage recovered than among those who did not. However, if we partition by gender, both men and women are more likely to recover when taking the drug. How could this be possible? The answer was that women were less likely to recover, and drug takers were more likely to be women. Put differently, being a woman was a common cause of both taking the drug, and failing to recover. In order to determine the proper prescription, we must consult the segregated data, which shows that the drug is helpful.

**Example 2**: A company wants to know if their bonus program is effectively increasing total sales. During the analysis researches consider segregating the data by a third variable the number of client calls made. Within the high calls group, the sales numbers will look about the same whether the employee was in the bonus program or not, and in the low calls group sales will be poor for everyone. Looking at this data would suggest the bonus program doesn't work. Combining all the employees into one large group, and simply comparing those in the bonus program against those who aren't, the data show the bonus program achieved significantly more sales, which is the true effect of the program.

The choice between the segregated or aggregated view depends entirely on the causal story, the mechanism that generated the data. Statistics alone cannot tell you which view is correct, you must understand the relationship between the variables.
- You segregate the data when the third variable is a **common cause** of both the treatment, and the outcome.
- You should aggregate the data when the third variable is **affected by the treatment**.

### Structural Causal Models

**Structural Causal Models (SCMs)** formally articulate causal assumptions. Formally, a structural causal model consists of:
- **exogenous variables** $U$ (variables with no cause in the model)
- **endogenous variables** $V$ (variables caused by at least one other variable)
- functions $F$ that determine the value of each endogenous variable $x$, given all the variables $y$ that **directly causes** $x$. 

### Graphical Models

Every SCM is associated with a **graphical causal model**, which is simply a **Directed Acyclic Graphs** (**DAGs**), where each node corresponds to a variable, and each edge represents that a variable directly causes another variable. Consequently, exogenous variables have no ancestors, and every endogenous variable has at least one ancestor that is an exogenous variable.

**Rule of Product Decomposition**: The joint distribution of the variables is the product of the conditional distributions of each variable given its parents. 
$$
P(x_{1}, x_{2}, \dots, x_{n})= \prod_{i=1}^{n}P(x_{i}|p_{i})
$$
where $x_{i}$ is the value of variable $X_{i}$, and $p_{i}$ are the values of the parents of variable $X_{i}$. This rule simplifies the estimation of joint probability distributions. A simple chain graph $X \to Y \to Z$ can be simplified as:
$$
P(X=x,Y=y,Z=z) = P(X = x)P(Y=y|X=x)P(Z=z|Y=y)
$$

This knowledge allows us to save an enormous amount of space when laying out a joint distribution. Instead of creating a probability table for every combination of values across all variables, we divide them into several smaller tables for each direct causal relationship. We then use the rule of product decomposition to reconstruct the joint probabilities wherever needed.

If we do not know the graphical structure of an SCM, estimation quickly becomes impossible for a large number of variables, and small datasets due to the curse of dimensionality.

### Deriving Dependencies

By examining the structure of a causal graph, you can predict patterns of independencies in the data without knowing the specific functions or error distributions. This allows us to test if a hypothesized causal model could have generated the observed data.

There are three foundational configurations of variables in causal graphs that determine how dependencies flow:

- **Chains** ($X \to Y \to Z$) represent a sequential mechanism. $X$ and $Z$, are typically dependent because changes in $X$ affect $Y$ which in turn affect $Z$. However if you condition on $Y$, the path is blocked, and $X$ and $Z$ become independent conditional on $Y$.
- **Forks** ($X \leftarrow Y \to Z$) represent one variable as the common cause of two others. Because $X$ and $Z$ share a common cause, they are likely dependent in the data. Conditioning on the common cause $Y$ blocks this dependence, rendering $X$ and $Z$ independent conditional on $Y$.
- **Colliders** ($X \to Z \leftarrow Y$) represent a common effect of two causes. Variables $X$ and $Y$ are unconditionally independent because no causal mechanism connects them. Unintuitively, conditioning on $Z$ forces $X$ and $Y$ to become dependent.

Causal models are rarely limited to single paths between variables, pairs of variables often have multiple paths connecting them that traverse various chains, forks, and colliders. To determine dependencies universally, we use **d-separation** (directional separation). 

Two nodes $X$ and $Y$ are considered:
- **d-separated** conditional on $Z$ (definitely independent) if every path between them is blocked. 
- **d-connected** conditional on $Z$ (likely dependent) if even a single path is unblocked.

A path $p$ is considered blocked for some set of conditioning nodes $Z$ if and only if:
- The path contains a chain ($A \to B \to C$) or a fork ($A \leftarrow B \to C$) where the middle node $B$ is included in the conditioning set $Z$.
- The path contains a collider ($A \to B \leftarrow C$) where the collision node $B$ NOR any of its descendants are in $Z$.

### Model Testing and Causal Search

Causal models offer testable implications with the datasets they generate. By applying d-separation to a hypothesized graphical model, we can identify which specific variables must be conditionally independent. We can then test for these predicted conditional independencies using our actual dataset. If the data contradicts the models predictions, we can confidently reject the causal model for the data. Conversely, if every d-separation condition matches the conditional dependencies found in the data, the model cannot be refuted using any further tests of this kind.

**Global Statistical Hypothesis Testing** evaluates how likely it is that the observed samples were generated by the hypothesized model as a whole. However, this has several drawbacks:
- If even a single parameter cannot be estimated, the joint distribution cannot be estimated, meaning the model cannot be tested at all.
- Because it evaluates the model globally, a rejected model provides no information about why it failed, or which specific edges should be added or removed to improve the fit.
- When a model involves a large number of variables, the test becomes unreliable due to measurement noise and sampling variation.

Using d-separation for model testing addresses these issues by offering a local testing method with several distinct advantages:
- It is non-parametric, meaning it evaluates the graph's structure without relying on specific functions connecting the variables.
- Because it tests models locally rather than globally, researchers can pinpoint exactly where a hypothesized model is flawed and repair those specific areas.
- If certain coefficients in one area of the model cannot be identified, we can still gather incomplete but valid information about the rest of the model.

(begin AI generated content I dont understand)

Because of how dependencies flow, some graphs share indistinguishable testable implications. A set of graphs with identical implications is called an **equivalence class** if they meet the following criteria:
- They share a common skeleton: meaning they have the exact same edges, regardless of the direction those edges point.
- They share common v-structures, which are colliders whose parent nodes are not adjacent to one another. 

Any two graphs that satisfy these criteria will yield identical sets of d-separation conditions. The existence of equivalence classes is extremely useful because it enables us to perform **causal search**. Instead of the traditional approach of starting with a causal model to generate a dataset, we can start with a dataset and reason backwards to discover the equivalence class of causal models that could have logically generated it.

(end AI generated content I dont understand)








