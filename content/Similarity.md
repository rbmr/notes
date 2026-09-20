---
tags:
  - machine-learning
  - mathematics/nuggets
---
Defining the distance, or similarity between (sets of) points.

### Norms

A **norm** is a mathematical function, denoted as $\vert{}\vert{}x\vert{}\vert{}$, that assigns a strictly positive length or size to all vectors in a [[Vector Spaces|vector space]] (except the zero vector). For a function to be mathematically classified as a norm, it must satisfy four fundamental properties for any vectors $x, y$ and any scalar $a$:
- **Non-negativity:** $\vert{}\vert{}x\vert{}\vert{} \ge 0$ (A vector's length cannot be negative).
- **Definiteness:** $\vert{}\vert{}x\vert{}\vert{} = 0 \iff x = \mathbf{0}$ (Only the zero vector has a length of zero).
- **Absolute Homogeneity (Scalability):** $\vert{}\vert{}ax\vert{}\vert{} = \vert{}a\vert{} \vert{}\vert{}x\vert{}\vert{}$ (Multiplying a vector by a scalar scales its length by the absolute value of that scalar).
- **Triangle Inequality:** $\vert{}\vert{}x + y\vert{}\vert{} \le \vert{}\vert{}x\vert{}\vert{} + \vert{}\vert{}y\vert{}\vert{}$ (The shortest path between two points is a straight line).

Any norm naturally defines a **geometric distance** metric between two points $x$ and $y$ by evaluating the norm of their difference: $d(x,y) = \vert{}\vert{}x - y\vert{}\vert{}$.

**$L_2$ Norm** (Euclidean Norm) Measures the standard straight-line magnitude of a vector. It is the most common norm but is sensitive to the magnitude of feature values. It induces the Euclidean distance:
$$
\vert{}\vert{}x\vert{}\vert{}_{2}=\sqrt{\sum_{i=1}^{n}x_{i}^{2}}
$$

**$L_1$ Norm** (Manhattan Norm) The sum of the absolute values of a vector's components. It induces the Manhattan distance, representing travel distance along a grid (like city blocks).
$$
\vert{}\vert{}x\vert{}\vert{}_{1}=\sum_{i=1}^{n}\vert{}x_{i}\vert{}
$$

**$L_p$ Norm** (Minkowski Norm) A generalized norm parameterized by $p \ge 1$ (the $p \ge 1$ constraint is strictly required to satisfy the triangle inequality). If $p=2$, it is the $L_2$ norm; if $p=1$, it is the $L_1$ norm.
$$
\vert{}\vert{}x\vert{}\vert{}_{p}=\left(\sum_{i=1}^{n}\vert{}x_{i}\vert{}^{p}\right)^{1/p}
$$

**$L_\infty$ Norm** (Chebyshev/Max Norm) The maximum absolute magnitude among any single coordinate dimension of a vector. It defines the Chebyshev distance, representing distance in spaces where moving across multiple dimensions simultaneously takes the same effort as moving across just one (often compared to how a king moves on a chessboard).
$$
\vert{}\vert{}x\vert{}\vert{}_{\infty}=\max_{i}\vert{}x_{i}\vert{}=\lim_{ p \to \infty }\vert{}\vert{}x\vert{}\vert{}_{p}
$$

###  Similarity and Correlation Measures

**Cosine Similarity** (Angular Similarity) Measures the cosine of the angle between two non-zero vectors. It focuses on orientation rather than magnitude, often used for text or high-dimensional data.
$$
s_{cos}(x,y)=\frac{x^{T}y}{||x||||y||}
$$

**Pearson's Correlation Coefficient** (Centered Cosine Similarity) Measures the linear correlation between two variables. It is essentially cosine similarity applied to centered data (subtracting the mean $\mu$). It is useful for finding objects with similar shapes or trends, ignoring amplitude.
$$
r_{Pearson}(x,y)=\frac{(x-\mu_{x})^{T}(y-\mu_{y})}{||x-\mu_{x}||||y-\mu_{y}||}
$$

### Cluster Linkage Criteria (Group-to-Group)

**Single Linkage** (Nearest Neighbor) Defines the distance between two clusters $R$ and $S$ as the minimum distance between any single object in $R$ and any single object in $S$. It tends to produce long, stringy clusters.
$$
g(R,S)=\min_{i,j}\{d(x_{i},x_{j}):x_{i}\in R,x_{j}\in S\}
$$

**Complete Linkage** (Farthest Neighbor) Defines the distance between two clusters as the maximum distance between any object in $R$ and any object in $S$. It tends to produce compact, spherical clusters.
$$
g(R,S)=\max_{i,j}\{d(x_{i},x_{j}):x_{i}\in R,x_{j}\in S\}
$$

**Average Linkage** (Group Average) Defines the distance as the average pairwise distance between all objects in $R$ and all objects in $S$. It is a compromise between single and complete linkage.
$$
g(R,S)=\frac{1}{|R||S|}\sum_{i,j}\{d(x_{i},x_{j}):x_{i}\in R,x_{j}\in S\}
$$
