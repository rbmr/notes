### Bayes as the Base

Bayes theorem can be used to describe how to update the probability of the model parameters $\theta$ given the data $X$.
$$
P(\theta | X) = \frac{P(X | \theta) \cdot P(\theta)}{P(X)}
$$

Components:
- Posterior $P(\theta|X)$: The probability of the parameters given the observed data $X$.
- Likelihood $P(X|\theta)$: The probability of observing the data $X$ given specific parameters $\theta$. This measures how well the model explains the data.
- Prior $P(\theta)$: The probability of the parameters $\theta$ before seeing any data.
- Evidence $P(X)$: The probability of the data. Since the data is $X$ is fixed and observed, this is essentially a constant normalizing factor.

We want to find the most likely model parameters $\theta$, given the data we have observed $X$. More simply, we want to estimate the posterior.

### Maximum Likelihood Estimation

 **Maximum Likelihood Estimation (MLE)** estimates the optimal model parameters by finding the model parameters for which the likelihood is maximal.

First we assume we have no prior knowledge about the parameters, meaning each value of $P(\theta)$ is equally likely. Consequently, both the prior $P(\theta)$ and the evidence $P(X)$ are constant with respect to $\theta$, making the posterior directly proportional to the likelihood.

$$
P(\theta | X) \propto P(X | \theta)
$$

Consequently, under MLE, the optimal parameters $\theta_{MLE}$ are those that maximize the likelihood of observing the data given the parameters.

$$
\theta_{MLE} = \arg\max_{\theta} P(\theta | X) = \arg\max_{\theta} P(X | \theta)
$$

Next we assume that all samples $x_{i}$ from the data $X$ are independent and identically distributed (i.i.d.). Consequently, the joint probability of all observed data points is the product of their individual probabilities. This gives us our final estimate.

$$
\theta_{MLE} = \arg\max_{\theta} \prod_{i=1}^{N} P(x_i | \theta)
$$

In practice, maximizing the likelihood $P(X|\theta)$ directly is difficult because repeatedly multiplying small probabilities together, will lead to arithmetic underflow (rounding to zero). To solve this, we use the **Log-Likelihood**.

Because the logarithm is a strictly increasing function, maximizing the Likelihood is mathematically equivalent to maximizing the Log-Likelihood. 

$$
\theta_{MLE} =  \arg\max_{\theta} P(X | \theta) = \arg\max_{\theta}\log P(X | \theta)
$$

This converts products to sums which are easier to work with.

$$
\theta_{MLE} = \arg\max_{\theta}\sum_{i=1}^{N} \log P(x_i | \theta)
$$

### Maximum A Posteriori (MAP)

If we do take the probability of the parameters into account based on prior knowledge, or regularization goals, we get the **Maximum A Posteriori (MAP)** estimation. Instead of maximizing just the likelihood, MAP aims to find the point estimate that maximizes the entire posterior distribution $P(\theta|X)$. Since $P(X)$ is still constant with respect to $\theta$, the posterior is proportional to the likelihood times the prior.
$$
P(\theta | X) \propto P(X | \theta) \cdot P(\theta)
$$
The optimal parameters $\theta_{MAP}$ are found by maximizing this product:
$$
\theta_{MAP} = \arg\max_{\theta} P(X | \theta) P(\theta)
$$
Just like with MLE, it is computationally more stable to maximize the logarithm of this value. Combined with the i.i.d. assumption, this gives us out final objective function to maximize.
$$
\theta_{MAP} = \arg\max_{\theta} \left( \sum_{i=1}^{N} \log P(x_i | \theta) + \log P(\theta) \right)
$$

### Bayesian Inference

Both MLE and MAP provide a point estimate, a single best value for $\theta$. **Bayesian Inference** takes this a step further, we not only want the maximum value, but we want the entire posterior distribution $P(\theta|X)$.

By keeping the full distribution, we quantify our uncertainty about the parameters. If the distribution is narrow, we are confident in our parameters, if it is wide, we are uncertain. 

To get the full posterior, we cannot drop the denominator $P(X)$. To find the probability of the data, we must integrate over all possible parameter values $P(\theta)$, which gives:
$$
P(X) = \int P(X | \theta) P(\theta) d\theta
$$
For all but the simplest models, this high-dimensional integral is impossible to solve exactly. Because determining the exact posterior is too hard, we must rely on approximations. Common techniques include Markov Chain Monte Carlo (MCMC) methods, or variational inference (VI).

### Posterior Predictive Distribution

(TODO: explain that the ultimate goal of keeping the full posterior is to make better predictions, if we want to predict a new unseen data point, a point estimate would just plug in the "best" parameters, instead we determine full posterior predictive distribution averaging the predictions of all possible models weighted by how likely they are given the posterior)

# TODO

TODO: I want to write some summary on how to extend these ideas to the realm of supervised learning. Also relate everything to linear regression.