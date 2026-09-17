---
tags:
  - mathematics/graph-theory
  - machine-learning
---
These notes are based on the course DSAIT4305 Graph Machine Learning (2026/27 Q1) at Delft University of Technology.

Notes are really rough. 

Lecture 1 Intro
- many types of graph:
	- directed vs undirected
	- weighted vs unweighted
	- static vs sliced
- many types of ML tasks on graphs, including:
	- node level prediction: predict user interests in a social network
	- link level prediction: predict new friendships in a social network
	- graph level prediction: predict functionality of an unseen compound structure in a chemical interaction graph
- generalisation setting
	- transductive: learn and predict on components of the same graph
	- inductive: learn from one graph and predict on a new (previously unseen) graph
- label propagation: to determine labels for some unlabeled node, assume a random walk starts at the unlabeled node, and determine the probability of ending up at each labeled node, then take the label that is most probable.
	- can use transition matrix. labeled nodes only transition to themselves, unlabeled nodes transition to other (un)labeled nodes with probability proportional to edge weights. 
	- the kth power of the probability matrix is the probability matrix for k steps. the probability matrix converges if the probability of staying on the unlabeled nodes goes to zero.
	- a graph is called **label connected** if and only if it is possible to reach a labeled node from any unlabeled node in a finite number of steps.
	- likely relevant mathematics: [[Markov Chains#Discrete Time Markov Chains|Discrete Time Markov Chains]]
- nearest neighbor based approaches infer labels based on probabilities of nearest/one-hop neighbours. one iteration of lp (label propagation) is weighted NN voting.
- random walk with restart adds probability of alpha to reset back to the starting distribution. theoretically, then the label distributions would converge even when the graph is not label connected, but the labels will not be meaningful if in any component there will be no labelled vertices to inform the labeling. 
- training labels might be noisy, keeping the labels fixed might exaggerate the noise. so what if instead we allowed the output label distribution of the labelled nodes to also vary?

Lecture 2
- Machine learning models need continuous representations.
- how would represent the nodes? We want information about the nodes themselves, aswell as their position in the graph. 
- you can handcode features or learn them, we focus on the latter.
- encoder-decoder: 
	- encoder learns embeddings for each node (the representation), 
	- decoder tries to reconstruct information about these nodes after the fact using only their embeddings (the test of similarity)
- random walk based methods: define node similarity based on their co-occurrence within short, fixed-length random walks.
	- goal: given a nodes representation, predict its neighborhood.


Reflection sep 17 2026: studying the slides directly is not doable. There are too many "missing" details, and they are too unstructured. The recommended alternative learning approach is to take the overleaf quideline at https://www.overleaf.com/project/662656e68ae583a6ec52db13, and filling in the questions using the slides/provided materials.