Doing projects for Uni I noticed the following setup being repeated.

- The 3 loops: the things to compare, the scenarios to compare them across, and the different seeds to handle stochasticity. Each run is an experiment.
- These loops may be combined (by Cartesian product), and parallelized if the runs themselves are not already using all cores. This final structure is called the pipeline.
- You need experiments only to yield the data. The results from a full pipeline run can generally be stored in a single table. Analysis is done by performing queries on this specific table. This distinction between running the experiments and analyzing the results is important, because experiments are generally slow, and changing the analysis should not require re-running the experiments.
- That's it.
