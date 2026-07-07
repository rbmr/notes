### True Error

The objective of a machine learning model is not to memorize a dataset, but to find the underlying patterns that apply to the problem as a whole.

**Generalization** refers to a model's ability to perform well on previously unseen data drawn from the same distribution as the data used to create the model. A model that generalizes well captures the true underlying signal of the data, rather than the random noise. 

The **true error** is the expected value of the loss function over the actual underlying data distribution. All **evaluation** techniques are ultimately designed to estimate a model's true error.

### Cross Validation

**Cross-validation** is any model evaluation technique for determining whether a model generalizes to unseen data.

The simplest example of cross-validation is the **holdout** method. In this approach, the dataset is partitioned into two mutually exclusive sets: a training set and a test set. The model is exclusively trained on the training set, and its performance is then evaluated once on the testing set. 

The issue with the holdout method is that the performance on the evaluation dataset is highly dependent on the single split of the data into train and test. Depending on the split, the performance may vary greatly. To address this instability, we try different splits, and average out the performance on the test set across iterations, consequently getting a closer approximation of the model's true error.

Suppose all $n$ samples in a dataset are labeled using numbers $1$ through $n$. We can then define a split as a way to partition the set of samples $\{ 1,2,\dots,n \}$ into two disjoint subsets, the train and the test set. 

We face the following trade-offs:
- Smaller test sets have lower bias, but higher variance.
- More splits means less variance, but is more computationally expensive.

### Cross Validation Methods

To address the limitations of a single holdout split, several different cross-validation strategies have been developed to better estimate a model's true error. The following are some common methods.

**$k$-fold Cross Validation** is the most widely adopted cross validation technique. The dataset is randomly divided into $k$ equally sized, mutually exclusive "folds". The model is then trained $k$ separate times, in each iteration $k-1$ folds are used for training and the single remaining fold is held out for testing. 

**Stratified $k$-fold Cross Validation** is a variation of k-fold used primarily for classification problems, and especially those involving imbalanced datasets. Stratification ensures that the proportion of target classes in each fold approximately matches the overall distribution of the entire dataset. This prevents splits where a train or test set completely lacks samples from a minority class.

**Leave-one-out Cross-Validation** (**LOOCV**) is an extreme case of $k$-fold cross validation where $k$ is equal to $n$ (the total number of samples). In each iteration, the model is trained on $n-1$ samples, and evaluated on the remaining sample. Because almost all data is used, LOOCV results in an almost unbiased estimate of the true error. However, it is extremely computationally expensive for large datasets.

**Leave-$p$-out Cross Validation** (**LpOCV**) is a generalization of LOOCV, where we leave out $p$ observations from the dataset to form the test set, and uses the remaining $n-p$ observations for training. Unlike with $k$-fold cross validation, this process is repeated for all possible *combinations* of $p$ observations. Because it calculates every permutation, LpOCV is extremely computationally expensive, and rarely used in practice. Furthermore the decreased variance it provides over $k$-fold is not very significant, as there is a significant correlation between train/test sets.

### Hyperparameters

We distinguish between two types of variables in machine learning:
- **Parameters** (or **weights**) are the internal variables the model learns automatically from the training data during the learning process. Examples include: weights in a neural network, or the coefficients in a linear regression.
- **Hyperparameters** are the external configuration variables of the model itself. Examples include: the learning rate, the depth of a decision tree, or the value of $k$ in $k$-nearest neighbors.

> Note: one may also view the type of model being used as a hyperparameter.

### Train, Validate, Test

We want to determine the optimal hyperparameters, and then assess the performance of these optimal hyperparameters. How would we do this?

**Option 1**: We pick the hyperparameters that maximize performance on the training data, just like the other parameters. This won't work, because the process will heavily bias the hyperparameters toward maximum memorization rather than actual learning.
- Example: consider the $k$-nearest neighbor algorithm. It will consistently conclude $k=1$ is the best choice, because the nearest neighbor to any training sample is itself. The error rate on the training data will be $0\%$, but is likely to lead to poor generalization.

**Option 2**: We pick the hyperparameters that maximize performance using the test data. This is already a bit better, but it wont work either. The main issue being "data leakage". We are optimizing the hyperparameters on the same data that is used to evaluate them, which leads to false confidence. It is like betting on the winning horse after the race has finished. 

So what if we just evaluate the winning hyperparameters using *another* independent set of data? This leads us directly the standard train, validate, test split.

We split the data twice, leading to three independent sets:
- the training set: used by the model to optimize its parameters.
- the validation set: used to determine which hyperparameters seem to lead to the best generalization.
- the test set: used to determine how good the best hyperparameters actually are.

One can view the test set as not just evaluating the final model, but evaluating the entire model pipeline itself.

### Nested Cross Validation

The reduce the variance in the final performance estimation, the full process from start to finish becomes as follows:

(TODO: organize the following information more cleanly)

1. Outer split: Split the data into outer train, and outer test.
2. Inner split: Split outer train into train and validate.
3. For each hyperparameter configuration, train the model on the train set, and evaluate it on the validation set.
4. Repeat from 2, but with a different split some number of times (k-folds, leave one out, only one split, etc)
5. Based on all of the inner splits, determine which hyperparameter configuration performed the best. We then retrain the model with this hyperparameter configuration, but on the entire outer train dataset.
6. We evaluate the resulting model on the outer test set.
7. Repeat from 1, but with a different split some number of times. 

The resulting average performance provides a robust estimation of the performance of our model pipeline overall. If we were to deploy our model, we do the inner loop again (finding the best hyperparamaters), followed by training the model on the ENTIRE dataset with the final hyperparameters. 

(Thoughts: Intuitively, this all makes sense to me, but I feel like it doesn't explain enough on WHY we should do it this way. I understand it as follows: the train validate split is really only for determining parameters that are relevant to the generalizing ability of the model. We can reinterpret "training" more broadly, say as a subroutine that is not only about fitting the regular parameters, but also about fitting the hyperparameters, and in order to fit the hyperparameters properly, we need some inner cross validation. After we found the best hyperparameters, only then will we retrain the model on all the data that was provided to us using these optimal hyperparameters. This fully trained and ready model is then output. We can view this entire subroutine as training some meta-model, then the outer loop is essentially just training that meta-model and evaluating ITS performance. It then also makes sense that after we evaluated the meta-model and want to use it practice, that we call the entire subroutine on the entire dataset again. I recognize this terminology is informal, so help me figure out a better way of describing this.)

