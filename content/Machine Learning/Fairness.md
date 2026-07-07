Training data is likely to inherit the biases from humans.

Assume, we have some attribute $A$ (age, gender, race, ...) that we don't want to be biased for. We want to ensure the model's predictions $R$ do not unfairly discriminate based on $A$.

There is no single, universally agreed-upon definition of fairness. We provide three distinct statistical criteria to measure it: Independence, Separation, and Sufficiency.

**Independence** (Demographic Parity): The prediction $R$ should be statistically independent of the sensitive attribute $A$ ($R \perp A$).
- Equalizes: positive prediction rate across groups. 
	- Formula: $P(R=1\mid A =a)=P(R=1\mid A=b)$
- Drawback: if the sensitive attribute is actually correlated with the target variable, enforcing independence can significantly reduce the model's accuracy and predictive performance.

**Separation** (Equalized Odds / Equal Opportunity): The prediction $R$ should be independent of the sensitive attribute $A$, given the true target $Y$ ($R \perp A \mid Y$).
- Meaning: People who actually belong to the positive class should have the same chance of being correctly predicted as positive, regardless of their group. 
- Equalizes: **True Positive Rates**, and **False Positive Rates** across groups.
- Visualizing the Trade-off: In ROC curves (which plot TPR vs FPR), different groups have different curves, the satisfy separation you must find a point where the curves intersect. This often requires artificially lowering the performance of the better group to match the worse group, rather than finding the optimal point for each.

**Sufficiency** (Predictive Parity): The true target $Y$ should be independent of the sensitive attribute $A$ given the prediction $R$ ($Y \perp A \mid R$).
- Meaning: If the model predicts a score of $X$, the probability of the outcome actually being positive should be the same for everyone, regardless of their group. 
- Equalizes: **Positive Predictive Values** across groups.
- Note: The slides suggest that standard classifiers often satisfy this condition "automatically" as they are designed to calibrate scores to probabilities.

How to enforce fairness: 
- Pre-processing: Fix the training data or representation before the model sees it. Example: resampling or reweighing data
- In-processing: Constrain the model during the training procedure. Example: adding fairness constraints to the optimization function.
- Post-processing: Fix the predictor scores after the model is trained. Example: choosing different thresholds for different groups to achieve a specific fairness criterion.
- Challenges:
	- You need the sensitive data: To check if an algorithm is fair, or to enforce fairness, you explicitly need the sensitive attribute $A$. You cannot simply delete the attribute because it is often correlated with other features (proxy variables).
	- Incompatibility: You often cannot satisfy all fairness criteria simultaneously. 
	- Performance cost: Enforcing fairness constraints (like independence) usually moves the model away from maximum accuracy. 