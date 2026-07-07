
While working on my [Bachelor's thesis](https://repository.tudelft.nl/record/uuid:82e0d46c-a1f4-46c9-aaa6-fbdcd8a81012) I discovered it was possible to efficiently approximate the optimal trading strategy in (intraday) trading scenarios given perfect lookahead using dynamic programming (DP). The idea for future work I posed in the thesis was to train a supervised model instead of a reinforcement learning model, using this dynamic programming approximation as the ground truth. This became Dynamic Programming-based Supervised learning (DPSL). One could view this as having access to the optimal value function, and using it to approximate the optimal policy.

The idea then became to compare the performance of this DPSL technique with the standard reinforcement learning (RL) techniques I attempted in my thesis. The main issue with the thesis however was that the models were only using features derived from past prices (and some features derived from the time-of-day/week/year) for the prediction of future prices. In many markets, getting postive PnL using these features alone is generally impossible. The issue was the lack of predictive power in the features, and DPSL did not solve this. As a consequence, both the DPSL and RL methods performed poorly, and since the bottleneck lied elsewhere, the comparison was largely irrelevant. Leading me to drop the project.

Since I still really like the idea of being able to find the perfect trading strategy (under the assumptions of zero market impact, and perfect lookahead), and using these to train trading models, I am still putting the unfinished work here.

The code I wrote for implementing and testing the DPSL approach is available here: https://github.com/rbmr/SupervisedFX

The repository containing the full (unfinished) paper is available here: https://github.com/rbmr/RLvsDPSL/blob/main/RLvsDPSL.pdf


