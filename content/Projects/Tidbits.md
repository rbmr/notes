### Pareto Dominance

In some scenarios, there are multiple objectives to optimize. In many such scenarios optimizing one comes at the cost of optimizing another. 

A solution is said to **dominate** another if it meets two specific criteria:
1. It is no worse than the other solution across all objectives.
2. It is strictly better in at least one objective.

Note condition 2 exists solely to exclude equivalent solutions.

A solution is **Pareto Optimal** if there is no other solution that dominates it. The **Pareto Front** is the set of Pareto optimal solutions. 

It is clear that one should pick a solution from the Pareto Front if given the choice, however deciding which solution to pick becomes a matter of tradeoff.

### A4 is great.

The **A4** standard is part of the ISO216 international standard for paper sizes.

The "A" series is based on the unique mathematical ratio $1 : \sqrt{ 2 }$. A0 has an area of exactly one square meter. If you cut an A0 in half across its longest side, you get two A1 sheets that maintain the exact same proportions. 

This process [may repeat infinitely](https://youtu.be/pUF5esTscZI?si=o-QQ7j_MvWxUp3-V) in both directions.

### Research Pipelines

Doing projects for Uni I noticed the following setup being repeated.

- The 3 loops: the things to compare, the scenarios to compare them across, and the different seeds to handle stochasticity. Each run is an experiment.
- These loops may be combined (by Cartesian product), and parallelized if the runs themselves are not already using all cores. This final structure is called the pipeline.
- You need experiments only to yield the data. The results from a full pipeline run can generally be stored in a single table. Analysis is done by performing queries on this specific table. This distinction between running the experiments and analyzing the results is important, because experiments are generally slow, and changing the analysis should not require re-running the experiments.
- That's it.