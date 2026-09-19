---
tags:
  - machine-learning
  - mathematics/optimization
---
These notes are based on the 2026-2027 course FEM21061 Machine Learning in OR
at Erasmus School of Economics. 

### Intro

A typical [[Machine Learning]] model attempts to minimize an objective function $F$ with respect to some weights $\beta$:
$$
\min_{\beta}F(\beta) := L(\beta) + \lambda r(\beta)
$$
where:
- $L$ is the **loss**
- $r$ is the **regularizer**

How to specifically find these weights is dictated by the structure of the objective function $F$.

### Rough Notes

- Notation
- From population to empirical model: the objective function we are minimizing, should actually be minimized with respect to the actual distribution, but we dont have this distribution, we only have samples. Thus we minimize the expectation of the loss with the data.
- Explanation of train/test split and cross validation. And data leakage. 
