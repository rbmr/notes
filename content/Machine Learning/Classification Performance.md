

### Definition

In machine learning, a **confusion matrix** is a specific table layout used to visualize the classification performance of an algorithm. Each row represents instances in an actual class, while each column represents instances in a predicted class (or vice versa).

| **Total Population (Total)**: The total sample size. <br><br>$\text{Total} = P + N = PP + PN$ | **Predicted Positive (PP)**: The total number of instances predicted as positive.<br><br>$PP = TP + FP$    | **Predicted Negative (PN)**: The total number of instances predicted as negative.<br><br>$PN = FN + TN$     |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Actual Positive (P)**: The number of real positive cases in the data.<br><br>$P = TP + FN$  | **True Positive (TP)**: A positive sample correctly identified by the classifier.                          | **False Negative (FN)**: A positive sample incorrectly identified as negative. Also called a Type II error. |
| **Actual Negative (N)**: The number of real negative cases in the data.<br><br>$N = FP + TN$  | **False Positive (FP)**: A negative sample incorrectly identified as positive. Also called a Type I error. | **True Negative (TN)**: A negative sample correctly identified as negative.                                 |

### Examples

Some example results are as follows:

|**Entry**|**Actual**|**Predicted**|**Result**|
|---|---|---|---|
|1|1|0|FN|
|2|1|0|FN|
|3|1|1|TP|
|4|1|1|TP|
|5|1|1|TP|
|6|1|1|TP|
|7|1|1|TP|
|8|1|1|TP|
|9|0|1|FP|
|10|0|0|TN|
|11|0|0|TN|
|12|0|0|TN|

This gives the following Confusion Matrix:

| Actual \ Predicted | Predicted Positive | Predicted Negative | Total (Actual) |
|---|---|---|---|
| Actual Positive | TP = 6 | FN = 2 | P = 8 |
| Actual Negative | FP = 1 | TN = 3 | N = 4 |
| Total (Predicted) | PP = 7 | PN = 5 | Total = 12 |

Confusion matrices can be extended to multi-class classifiers. Suppose instead of 2 classes (positive and negative) we have 4 classes A, B, C, and D. Some example results would be as follows:

|Entry|Actual|Predicted|Result|
|---|---|---|---|
|1|A|A|Correct|
|2|A|A|Correct|
|3|A|B|Mismatch|
|4|A|C|Mismatch|
|5|B|A|Mismatch|
|6|B|B|Correct|
|7|B|D|Mismatch|
|8|C|A|Mismatch|
|9|C|A|Mismatch|
|10|C|B|Mismatch|
|11|C|D|Mismatch|
|12|D|A|Mismatch|
|13|D|C|Mismatch|
|14|D|C|Mismatch|
|15|D|C|Mismatch|
|16|D|D|Correct|

This gives the following Confusion Matrix:

|Actual \ Predicted|Predicted A|Predicted B|Predicted C|Predicted D|Total (Actual)|
|---|---|---|---|---|---|
|Actual A|2|1|1|0|4|
|Actual B|1|1|0|1|3|
|Actual C|2|1|0|1|4|
|Actual D|1|0|3|1|5|
|Total (Predicted)|6|3|4|3|16|

> **Note:** You may also interpret any multi-class classification problem as a binary classification by focusing on a single class. The two classes then become: "Is of Class X" (Positive) versus "Is NOT of Class X" (Negative).

### Metrics

While there are numerous named metrics used to evaluate classification performance, it is important to note that they all essentially just combine the 4 cells of the confusion matrix in different ways. The cells are: True Positives ($TP$), True Negatives ($TN$), False Positives ($FP$), and False Negatives ($FN$). On top of this, many of these metrics represent the same underlying mathematical concepts but are known by different names across various fields (e.g., "Recall" in machine learning is "Sensitivity" in medicine).

We simplify the confusion matrix as follows to be used for reference.

|**Total Population (Total)**|**Predicted Positive (PP)**|**Predicted Negative (PN)**|
|---|---|---|
|**Actual Positive (P)**|True Positive (TP)|False Negative (FN)|
|**Actual Negative (N)**|False Positive (FP)|True Negative (TN)|

#### Rate Metrics

Out of all the instances that truly belong to this class row, how many did the model handle correctly?

- **True Positive Rate ($TPR$)**: measures the proportion of actual positives correctly classified as positive.
	- Also known as **Recall**, **Sensitivity**, **Hit Rate**, **Probability of Detection**, or **Power**.
	- $TPR = \frac{TP}{P} = \frac{TP}{TP + FN} = 1 - FNR$
- **False Negative Rate ($FNR$)**: measures the proportion of actual positives incorrectly classified as negative.
	- Also known as **Miss Rate** or **Type II Error rate**.
	- $FNR = \frac{FN}{P} = \frac{FN}{TP + FN} = 1 - TPR$
- **False Positive Rate ($FPR$)**: measures the proportion of actual negatives incorrectly classified as positive.
	- Also known as **Fall-out**, **Probability of False Alarm**, or **Type I Error rate**.
	- $FPR = \frac{FP}{N} = \frac{FP}{TN + FP} = 1 - TNR$
- **True Negative Rate ($TNR$)**: measures the proportion of actual negatives correctly classified as negative.
	- Also known as **Specificity** or **Selectivity**.
	- $TNR = \frac{TN}{N} = \frac{TN}{TN + FP} = 1 - FPR$

#### Predictive Metrics

When the model claims a result is Positive or Negative, how trustworthy is that claim?

- **Positive Predictive Value ($PPV$)**: measures the proportion of true positives among all positive predictions.
	- Also known as **Precision**.
	- $PPV = \frac{TP}{PP} = \frac{TP}{TP + FP} = 1 - FDR$
- **Negative Predictive Value ($NPV$)**: measures the proportion of true negatives among all negative predictions.
	- $NPV = \frac{TN}{PN} = \frac{TN}{TN + FN} = 1 - FOR$
- **False Discovery Rate ($FDR$)**: measures the proportion of false positives among all positive predictions.
	- $FDR = \frac{FP}{PP} = \frac{FP}{TP + FP} = 1 - PPV$
- **False Omission Rate ($FOR$)**: measures the proportion of false negatives among all negative predictions.
	- $FOR = \frac{FN}{PN} = \frac{FN}{TN + FN} = 1 - NPV$

#### Overall Performance Metrics

Overall Performance Metrics attempt to summarize the confusion matrix into a single score.

- **Accuracy ($ACC$)**: The overall proportion of correct predictions. Note: This can be misleading on unbalanced datasets.
	- $ACC = \frac{TP + TN}{P + N} = \frac{TP + TN}{Total}$
- **Balanced Accuracy ($BA$)**: The arithmetic mean of sensitivity and specificity, useful for handling class imbalance.
	- $BA = \frac{TPR + TNR}{2}$
- **F1 Score**: The harmonic mean of Precision ($PPV$) and Recall ($TPR$).
	- Also known as the **F-measure**.
	- $F_1 = \frac{2 \times PPV \times TPR}{PPV + TPR} = \frac{2 \times TP}{2 \times TP + FP + FN}$
- **Positive Prediction Rate ($PPR$)**: measures the proportion of the total population that the model predicts as positive.
	- $PPR = \frac{PP}{Total} = \frac{TP + FP}{P + N}$
- **Negative Prediction Rate ($NPR$)**: measures the proportion of the total population that the model predicts as negative.
	- $NPR = \frac{NP}{Total} = \frac{TN + FN}{P + N}$

### Receiver Operating Characteristic

Most machine learning classifiers do not strictly output a class label (0 or 1) directly. Instead, they output a probability or a continuous score indicating the likelihood that an instance belongs to the positive class. To convert this score into a binary prediction, we apply a **Decision Threshold** (or cut-off). If the score is larger than or equal to a threshold we predict its positive, otherwise we predict negative.  

The standard threshold is often 0.5, but this is arbitrary. Changing the threshold changes the confusion matrix. 
- Lowering the threshold, causes more positive predictions, raising the True Positive Rate (TPR), but also increases the False Positive Rate (FPR).
- Raising the Threshold, causes more negative predictions, increasing the True Negative Rate (TNR), but also increasing the False Negative Rate (FNR).
- We balance between sensitivity (TPR) for specificity (TNR).

The **Receiver Operating Characteristic** (ROC) curve is a graphical plot, that illustrates this trade-off. A single confusion matrix only looks at a single threshold (like 0.5). The ROC curve plots the TPR on the y-axis, against the FPR on the x-axis, as you change the threshold from 0 to 1.
- The ideal point is in the upper left corner $(0, 1)$, representing 100% TPR, and 0% FPR.
- Random Guessing: A completely random classifier (like flipping a coin) produces a diagonal line from bottom-left $(0, 0)$ to the top right $(1, 1)$. This is called the line of no-discrimination.

(TODO: add example derivation of this curve)

The **Area Under the Curve** (**AUC**) often referred to as AUROC measures the two-dimensional area underneath the entire ROC curve from $(0, 0)$ to $(1, 1)$. It serves as a single scalar value that summarizes the performance of a classifier across all possible thresholds.
- Interpretation: it represents the probability that a classifier will rank a randomly chosen positive instance higher than a randomly chosen negative one.
- AUC = 1.0 represents the perfect classifier.
- AUC = 0.5 represents a random classifier (no discriminative ability), equivalent to a coin flip.
- AUC < 0.5 represents a classifier worse than random guessing. However simply inverting predictions makes the AUC > 0.5.

While the ROC curve and AUC metrics are widely used, they are not always applicable. For example, the ROC curve uses the False Positive Rate, which divides false positives by the total number of negatives. In datasets where the negative class is massive, a large number of false positives might still result in a very large FPR, making the model look better than it is. Consequently a model could have a high AUC (e.g., 0.9) while suffering from very low precision. 

The **Precision-Recall** (PR) Curve is an alternative visualization of ten preferred when dealing with highly imbalanced datasets. Contrary to ROC curves, the PR curve ignores True Negatives entirely and focuses solely on how well the model handles the positive class. 
- The y-axis is Precision (PPV) measuring the purity of positive predictions.
- The x-axis is Recall (TPR) measuring the completeness of the positive predictions.
- The goal is to be in the upper-right corner (1, 1), representing high precision and recall.
- Unlike the ROC curve the PR curve is not necessarily monotonic. 




