
### Regression vs Classification

Supervised Learning may be divided into two categories:

- **Regression**: involves predicting a continuous output value. The target variable $y$ is a (vector of) real number(s) $y \in \mathbb{R}^k$. 
- **Classification**: involves predicting a discrete category class or class label. The target variable $y$ belongs to a finite set of classes, $y \in \{C_{1}, C_{2}, \dots, C_{k}\}$.

### Regression Loss

The goal of any regression model is to ensure the predicted value is as close to the true value as possible.

The **residual** $r_{i}$ is defined as the difference between the observed value $y_{i}$ and the predicted value $\hat{y}_{i}$ for a given data point.
$$
r_{i} = y_{i} - \hat{y}_{i}=y_{i} -\mathbf{x}^T_{i}\beta
$$

We define three loss functions may be defined based on the residuals:

- **Quadratic Loss (Squared Error)**: This loss is the residual sum of squares (also called $RSS$). It penalizes larger errors more heavily than smaller ones.
    $$ 
    L(y_{i}, \hat{y}_{i}) = (y_{i} - \hat{y}_{i})^2 = r_{i}^2
    $$
- **Absolute Loss**: This loss uses the absolute value of the residual. It is more robust to outliers than quadratic loss because it grows linearly rather than quadratically.
    $$
    L(y_{i}, \hat{y}_{i}) = |y_{i} - \hat{y}_{i}| = |r_{i}|
    $$
- **Huber Loss**: This function combines the best properties of both quadratic and absolute loss. It is quadratic for small errors (where $|r_{i}| \le \delta$) making it differentiable at zero, and linear for large errors (where $|r_{i}| > \delta$), making it robust to outliers.
    $$
    L_{\delta}(y_{i}, \hat{y}_{i}) = \begin{cases} \frac{1}{2}(y_{i} - \hat{y}_{i})^2 & \text{if } |y_{i} - \hat{y}_{i}| \leq \delta \\ \delta \left(|y_{i} - \hat{y}_{i}| - \frac{\delta}{2}\right) & \text{otherwise} \end{cases}
    $$

### Linear Regression

**Linear Regression**: We fit a linear function $f$ to estimate $y$ given some features $\mathbf{x}$. The function can be we written as $f(\mathbf{x})=\hat{y}=\mathbf{x}^T\beta$, with weights $\beta = (\beta_{0}\ \beta_{1}\ \beta_{2}\ \cdots\ \beta_{d} )^T$. We want to find $\beta$ such that some loss function is minimized. 

**Ordinary Least Squares** (OLS) is a fundamental linear regression technique that determines the weights by minimizing the residual sum of squares ($RSS$).
$$
\mathcal{L}_{\text{OLS}}(\beta) = \sum_{i=1}^{N}(r_{i})^{2} = \sum_{n=1}^{N}(y_{i} - \mathbf{x}_{i}^{T}\beta)^{2}=(\mathbf{y}-X\beta)^T(\mathbf{y}-X\beta)
$$
We find the weights for which this loss is minimal $\hat{\beta}_{OLS}$ by setting the derivative of the loss to zero, and solving for $\beta$. This gives:
$$
\hat{\beta}_{OLS} = (X^{T}X)^{-1}X^{T}y
$$

 Interesting note: Geometrically this solution corresponds to finding the orthogonal projection of the vector $y$ onto the subspace spanned by the columns of $X$.

### Coefficient of Determination $R^2$

Total Sum of Squares ($TSS$) measures the total variance in the observed data. It is the sum of squared differences between the observed data ($y_{i}$) and global mean ($\bar{y}$). 
$$
TSS=\sum(y_{i}-\bar{y})^2
$$

The Coefficient of Determination denoted $R^2$ is a measure of how well the regression predictions approximate the real data points. It represents the the proportion of variability in the response variable $Y$ that can be explained by your model. 
$$
R^{2} = \frac{TSS - RSS}{TSS} = 1 - \frac{RSS}{TSS}
$$

- $R^2 = 1$: the model explains all the variability of the response data (perfect fit).
- $R^2 = 0$: the model explains none of the variability of the response data (model is not better than just predicting the mean).

### Bias-Variance Tradeoff

The expected prediction error can be decomposed into three parts:
$$
E(Y-\hat{Y})^2 = Bias(\hat{f}(X))^{2} + Var(\hat{f}(X)) + Var(\epsilon)
$$
- **Bias:** The error introduced by approximating a complex real-life problem with a much simpler model.
- **Variance:** The amount by which the estimated function $\hat{f}$ would change if estimated using a different training data set. High variance means small changes in data result in large changes in the model.
- **Irreducible Error ($Var(\epsilon)$):** The noise inherent in the problem that cannot be reduced by any model.

The tradeoff: Variance vs Bias
- **High Variance & Low Bias:** Occurs with flexible (complex) models. The model accommodates the training data very well but is unstable. This leads to overfitting.
- **Low Variance & High Bias:** Occurs with simple (rigid) models. The model is stable but may fail to capture the underlying pattern.
- **Goal:** The objective is to find a balance where both bias and variance are low, rather than minimizing just one.

Regularization is a machine learning technique used to prevent overfitting by adding a penalty term to the loss function, which discourages overly complex models.

### Regularizing Linear Regression

**Ridge regression** (L2 regularization) prevents overfitting by penalizing the sum of squared coefficients (the L2 norm). This shrinks coefficients to zero, but rarely forces them to be exactly zero. Its loss function $\mathcal{L}_{\text{Ridge}}$ is defined as:
$$
\mathcal{L}_{\text{Ridge}}(\beta) = \sum_{n=1}^{N}(y_{n}-\mathbf{x}_{n}^{T}\beta)^{2} + \lambda\beta^{T}\beta
$$
Taking the derivative of the loss and setting it to zero, we obtain:
$$
\hat{\beta}_{Ridge}=(X^{T}X+\lambda I)^{-1}X^{T}y
$$

**Lasso Regression** (L1 Regularization): Lasso (Least Absolute Shrinkage and Selection Operator) penalizes the absolute values of the coefficients (the L1 norm). Its primary advantage is that it can drive some coefficients exactly to zero, effectively performing feature selection and resulting in sparse models. Its loss function $\mathcal{L}_{\text{Lasso}}$ is defined as:
$$
\mathcal{L}_{\text{Lasso}}(\beta) = \sum_{n=1}^{N}(y_{n}-\mathbf{x}_{n}^{T}\beta)^{2} + \lambda||\beta||_{1}
$$
where $||\beta||_{1} = \sum |\beta_j|$ is the L1 norm of the weight vector.

Due to the absolute value term, Lasso has no closed-form solution. The parameters must be estimated using iterative numerical algorithms such as coordinate descent.

**Elastic Net Regression** combines the properties of both Ridge and Lasso by including both the L1 and L2 regularization penalties in the loss function. The loss function $\mathcal{L}_{\text{ElasticNet}}$ is a linear combination of the Lasso and Ridge penalties:
$$
\mathcal{L}_{\text{ElasticNet}}(\beta) = \sum_{n=1}^{N}(y_{n}-\mathbf{x}_{n}^{T}\beta)^{2} + \lambda_{1}||\beta||_{1} + \lambda_{2}\beta^{T}\beta
$$
Here we must tune two hyperparameters: $\lambda_1$ controls the sparsity (Lasso influence), and $\lambda_2$ controls the coefficient shrinkage (Ridge influence). Like Lasso, Elastic Net does not have a closed-form solution and requires iterative optimization.

### Bayesian Linear Regression

We can view linear regression through a probabilistic lens to understand how different estimation methods (OLS, Ridge) relate to statistical assumptions about data and parameters.

Suppose we assume the relationship between inputs and outputs is modeled as $y_{i} = \mathbf{x}_{i}^{T}\beta + \epsilon$, where the noise $\epsilon$ is i.i.d following a Gaussian distribution $\mathcal{N}(0, \sigma_{\epsilon}^{2})$. Then the likelihood of observing the outcomes $\mathbf{y}$ given the parameters is the product of the individual probabilities: 
$$ 
p(\mathbf{y}\mid X,\beta,\sigma_{\epsilon}^{2}) = \prod_{i=1}^{N} \mathcal{N}(y_i | \mathbf{x}_{i}^{T}\beta, \sigma_{\epsilon}^{2})
$$

[[Maximum Likelihood|Maximum Likelihood Estimation]] (MLE) seeks the parameters $\hat{\beta}_{\text{ML}}$ that maximize this likelihood. As it turns out, maximizing this likelihood is mathematically equivalent to minimizing the sum of squared residuals. Consequently, the MLE solution is identical to the OLS solution.
$$
\hat{\beta}_{ML} = (X^{T}X)^{-1}X^{T}y = \hat{\beta}_{OLS}
$$

[[Maximum Likelihood|Maximum A Posteriori]]  (MAP) Estimation seeks to parameters that maximize the posterior probability, rather than just the likelihood.
$$
\hat{\beta}_{MAP} = \underset{\beta}{\text{argmax}}\ p(y|X,\beta,\sigma_{\epsilon}^{2})p(\beta)
$$
If we assume a Gaussian Prior for the parameters $p(\beta)$ and a Gaussian Likelihood for the data (as with OLS), the optimization problem changes. Maximizing the posterior becomes equivalent to maximizing the likelihood, plus a term related to the prior. This turns out to be mathematically identical to the Ridge Regression (L2 Regularization) solution. 
$$
\hat{\beta}_{MAP} = \left(X^{T}X + \frac{\sigma_{\epsilon}^{2}}{\sigma_{\beta}^{2}}I\right)^{-1}X^{T}y = (X^{T}X+\lambda I)^{-1}X^{T}y=\hat{\beta}_{Ridge}
$$ 
The regularization parameter represents the ratio of the noise variance to the prior variance: 
$$
\lambda = \frac{\sigma_{\epsilon}^{2}}{\sigma_{\beta}^{2}}
$$ 

%% TODO: reformulate this section more cleanly %%

### Linear Classifiers

While regression predicts continuous values, linear models can also be adapted for classification tasks. 

**Logistic Regression** estimates the posterior probabilities of $K$ classes via linear functions, and then ensuring they remain valid probabilities (in $[0,1]$, and sum to one).
- In the case of 2 classes we use the [[Activation Functions|Sigmoid Function]] $\sigma(a)$.
- For more than 2 classes we use the [[Activation Functions|Softmax Function]].

The **Perceptron**, invented in 1957 by Frank Rosenblatt, is a fundamental linear classifier that combines a linear combination of inputs with a non-linear activation function, specifically the [[Activation Functions| Heaviside Step Function]].

A **Multilayer Perceptron (MLP)** is created by stacking these perceptrons into multiple layers, where the output of one perceptron serves as the input to another. MLPs formed the basis for [[Neural Networks]].

