Defining the distance, or similarity between (sets of) points.

#### 1. Geometric Distance Measures (Point-to-Point)

**Euclidean Distance** ($L_2$ Norm) The standard straight-line distance between two points $x$ and $y$ in $l$-dimensional space. It is the most common metric but is sensitive to the magnitude of feature values.
$$
d(x,y)=\sqrt{\sum_{i=1}^{n}(x_{i}-y_{i})^{2}}
$$

**Manhattan Distance** ($L_1$ Norm) The sum of the absolute differences of their coordinates. It represents travel distance along a grid (like city blocks).
$$
d(x,y)=\sum_{i=1}^{n}|x_{i}-y_{i}|
$$

**Minkowski Distance** ($L_p$ Metric) A generalized distance metric where $p$ is a parameter. If $p=2$, it is Euclidean; if $p=1$, it is Manhattan.
$$
d_{p}(x,y)=\left(\sum_{i=1}^{n}|x_{i}-y_{i}|^{p}\right)^{1/p}
$$

**Chebyshev Distance** ($L_\infty$ Norm) The maximum absolute difference between any single coordinate dimension of the two points. It represents distance in spaces where moving across multiple dimensions simultaneously takes the same effort as moving across just one (often compared to how a king moves on a chessboard).
$$
d(x,y)=\max_{i}|x_{i}-y_{i}|=\lim_{ p \to \infty }d_{p}(x,y)
$$

#### 2. Similarity and Correlation Measures

**Cosine Similarity** (Angular Similarity) Measures the cosine of the angle between two non-zero vectors. It focuses on orientation rather than magnitude, often used for text or high-dimensional data.
$$
s_{cos}(x,y)=\frac{x^{T}y}{||x||||y||}
$$

**Pearson's Correlation Coefficient** (Centered Cosine Similarity) Measures the linear correlation between two variables. It is essentially cosine similarity applied to centered data (subtracting the mean $\mu$). It is useful for finding objects with similar shapes or trends, ignoring amplitude.
$$
r_{Pearson}(x,y)=\frac{(x-\mu_{x})^{T}(y-\mu_{y})}{||x-\mu_{x}||||y-\mu_{y}||}
$$

#### 3. Cluster Linkage Criteria (Group-to-Group)

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
