Data is represented in a $p$-dimensional space where each dimension is a feature. 

#### The Curse of Dimensionality

In high-dimensional spaces ($p \to \infty$), the data needed for the same density grows exponentially with the dimensions $p$. This leads to:
- Distance Concentration: In high dimensions, points tend to be equidistant.
- Convex Hull: In high dimensions, almost all samples lie on the convex hull.

Consequently, for a fixed sample size $N$ increasing features $p$ initially reduces the error, but eventually increases due to the curse of dimensionality. 

### Assessing Separability

#### Scatter Matrices

To assess the separability of classes, we decompose the total variance into specific scatter matrices.

**Within-class scatter matrix** ($S_{W}$): The matrix represents the average compactness of individual classes. Calculated as the weighted sum of the covariance matrices of each class:
$$
S_{W}=\sum_{i=1}^{M}\frac{n_{i}}{N}\Sigma_{i}
$$
Here, $M$ is the number of classes, $N$ is the total number of samples, $n_{i}$ is the number of samples in class $w_{i}$, and $\Sigma_{i}$ is the covariance matrix of class $w_{i}$. For good classification performance, a smaller $S_{W}$ is preferred.

**Between-class scatter matrix** ($S_{B}$): The matrix measures the separation between classes. Calculated as the weighted average distance of individual class means from the global mean.
$$
S_{B}=\sum_{i=1}^{M}\frac{n_{i}}{N}(\mu_{i}-\mu)(\mu_{i}-\mu)^{T}
$$
Where $\mu_{i}$ is the mean of class $w_{i}$ and $\mu$ is the overall global mean. For good classification performance, a larger $S_{B}$ is preferred.

**Total scatter matrix** ($S_{T}$): The matrix represents the overall width or variance of the entire dataset and is the sum of the within-class and between-class scatter matrices.
$$
S_{T}=S_{W}+S_{B}
$$

#### Mahalanobis Distance

Mahalanobis Distance $D_{M}$ measures the distance between a point and a distribution, accounting for the variance using the covariance matrix $\Sigma$. It is defined as $D_{M}=(\mathbf{x}-\mu)^T\Sigma^{-1}(\mathbf{x}-\mu)$. If $\Sigma$ is the identity matrix, then the mahanalobis distance equals the Euclidean distance.  

To measure the distance between two classes, we extend the Mahalanobis distance. Assuming Gaussian distributions with equal covariance matrices, the distance is defined using the within-class scatter matrix $S_{W}$ rather than a single global covariance matrix. 
$$
D_{M}=(\mu_{1}-\mu_{2})^{T}S_{W}^{-1}(\mu_{1}-\mu_{2})
$$

#### Fisher Discriminant Ratio (FDR)

To quantify the separability capabilities of individual features, we combine the Within-class and Between-class scatter matrices into the Fisher Discriminant Ratio.

For a 1-D, two-class problem, the criterion is defined as the ratio of the squared distance between means to the sum of their variances.
$$
J_{F}=\frac{(\mu_{1}-\mu_{2})^{2}}{\sigma_{1}^{2}+\sigma_{2}^{2}}
$$

This concept generalizes to finding a projection vector $a$ that maximizes the ratio of between class scatter to within class scatter.
$$
J_{F}(\mathbf{a})=\frac{\mathbf{a}^{T}S_{B}\mathbf{a}}{\mathbf{a}^{T}S_{W}\mathbf{a}}
$$

### Dimensionality Reduction Strategies

To address the curse of dimensionality, we reduce dimensions through two main methods: 
1. Feature Selection: Selecting a subset ($d$) of the original features ($p$). The original features are retained.
2. Feature Extraction: Mapping $p$ measurements to $d$ new measurements. The original features are transformed.

#### Feature Selection Strategy

Selecting a subset $d$ from $p$ original features. 

Exhaustive Feature Selection: finding the optimal subset requires checking all possible feature combinations. This becomes computationally impossible as $p$ grows large.

To avoid the cost of exhaustive search, heuristic methods are used. 
- Forward Selection (FS): Start with an empty set. Iteratively add the feature that maximizes some criterion when combined with the already selected set.
- Backward Selection (BS): Starts with the full set of features. Iteratively removes the feature that affects the criterion value the least until the desired number of features remains.
- The Nesting Effect: A major limitation of FS and BS. Once a feature has been added/removed, it cannot be undone.
- Bidirectional Selection: Run FS and BS simultaneously. Ensures convergence by preventing FS from selecting features BS has removed and vice-versa.
- Floating Selection: Addresses the nesting effect by allowing "backtracking." Allowing backward steps after a forward step (or vice versa) if it improves the criterion.

#### Feature Extraction Methods

Transforming the original $p$ features into a new set of $d$ features.

**Principal Component Analysis (PCA)** is an unsupervised feature extraction method and is considered the most classical approach to dimensionality reduction. It transforms the data into a new coordinate system where the axes (principal components) are ordered by the amount of variance they capture.
- Goal: retain as much variance as possible, which is equivalent to minimizing the reconstruction error.
- Process:
	1. The data $X$ is mean-centered.
	2. The covariance matrix is computed as $\Sigma=XX^T$.
	3. Eigen-decomposition is performed on the covariance matrix: $\Sigma v=\lambda v$ where $v$ are the eigen vectors and $\lambda$ eigen values.
	4. The eigen vectors are ordered by their eigenvalues from largest to smallest. 
	5. You construct the projection matrix $V_{k}$ by taking the first $k$ columns from the ordered eigenvector matrix $V$.
	6. Finally you project the original mean-centered data $X$ onto this new subspace to get the lower-dimensional data $T_{k} = V_{k}^TX$.
 
**Linear Discriminant Analysis (LDA)** is a supervised feature extraction method. The goal is to find the projection vector $a$ that maximizes the separability between different classes. To achieve this LDA maximizes the [[Curse of Dimensionality#Fisher Discriminant Ratio (FDR)|Fisher Criterion]].

Standard PCA and LDA are linear methods, meaning they may be inefficient if the data is not linearly separable in the original dimension. One can project the data onto a higher dimensional space such that the data becomes linearly separable. To reduce the consequent increase in computation complexity we use the [[Kernel Trick]].



