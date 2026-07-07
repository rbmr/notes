Game theory is the study of mathematical models of strategic interactions. 

#### Game Representation

First we shall model a game formally.

A **strategy** $(s_{i})$ is a complete deterministic plan of action. It must define which action the player will take at every decision point where it is their turn to move. 

**Strategic Form** (or Normal Form) is defined as a tuple $(N, S, X, \omega)$ where:
- $N$ is the set of all players involved.
- $S$ is the set of strategy profiles $S=\times_{i\in N}S_{i}$. Each profile is a tuple containing one strategy for every player from their respective set of deterministic strategies $S_{i}$.
- $X$ is the set of possible outcomes.
- $\omega$ is the outcome function $\omega:S\to X$ mapping strategy profiles to outcomes.

**Extensive Form** represents games as a tree where:
- The root node is the start of the game.
- Internal nodes are decision points where a player must choose an action.
- Outgoing edges represent the possible actions available at a specific node.
- Leaves are outcomes.

An **Information set** is a collection of decision nodes for a specific player that are indistinguishable to that player. If an information set contains more than one node, the player is unable to distinguish these nodes. This allows extensive form trees to model imperfect information, or simultaneous moves.

Strategic Form and Extensive Form are fundamentally interchangeable, they are different views on the same logical structure.

(TODO: my gut says this can be formulated in a better way)

#### Examples

**Example 1: Prisoner's Dilemma**. Two players must decide whether to "conceal" or "inform" on their partner. The utilities for each player depend on the joint decision. This can be represented using Strategic Form. The first number is the row player's utility; the second is the column player's.

| |conceal|inform|
|---|---|---|
|conceal|-2, -2|-5, 0|
|inform|0, -5|-4, -4|

**Example 2: Ultimatum Game**. First one player proposes a way to split some monetary amount $x$, e.g. Fair (50%-50%), or Unfair (80%-20%). The second player then observes this proposal and decides to Accept (A) or Reject (R). If the second player accepts both players get their respective proposed monetary amount, if they reject neither player gets anything. This can be represented using Extensive Form as follows:

![[Ultimatum_Game_Extensive_Form.png | 400]]   
Reference: [https://en.wikipedia.org/wiki/Ultimatum_game](https://en.wikipedia.org/wiki/Ultimatum_game)

**Example 3: Second-price (Vickrey) Auction**. A specific mechanism for allocating a single item. All players bid on an item, the highest bidder wins, but pays the price of the second-highest bid. Key property: telling the truth is a dominant strategy.

#### Analyzing Games

- **Pareto Efficiency**: An outcome is efficient if no other outcome exists that makes one play better off without making another worse off. 
- **Dominance**: A strategy $s_i \in S_{i}$ dominates $s'_i \in S_{i}$ if it yields a better result for player $i$ regardless of what the opponents do.
- A **Pure Strategy** involves selecting a specific strategy $s_{i}$ from $S_{i}$, a **Mixed Strategy** involves choosing a probability distribution over the available strategies. Pure strategies are a subset of mixed strategies.
- **Nash Equilibrium**: A strategy profile is in Nash Equilibrium (NE) if every player $i$ plays a strategy that is a best response to the strategies played by all other players. 
	- A Pure Nash Equilibrium is any Nash Equilibrium where every player plays a pure strategy. Any Nash Equilibrium that is not a Pure Nash Equilibrium is a Mixed Nash Equilibrium.
- **Nash's Theorem** proves that every strategic game with a finite number of pure strategies has at least one Nash equilibrium in mixed strategies.
- **Zero-Sum Games:** Games where the total utility is constant (one player's gain is the other's loss). These are solved using **Von Neumann’s maximin technique**, ensuring players maximize their minimum possible gain.

#### Mechanism Design

Mechanism Design is described as "Inverse Game Theory". Instead of analyzing a given game, the goal is to design the rules (the mechanism) so that rational (self-interested) agents naturally reach a desired outcome, as specified by a Social Choice Function (SCF).

- **Social Choice Function** ($f$): A function mapping the private preferences of all agents to an outcome in $X$. $f: \Theta^n \rightarrow X$. Ideally, this function maximizes social welfare, defined as the sum of all agents' valuations: $\sum_{i \in N} v_i(x, \theta)$.
- **Direct Mechanism**: A mechanism where agents directly report their private preferences $\hat{\theta}$ to a center, which then calculates the outcome using $f$.
- **Strategy-Proofness:** A mechanism is strategy-proof (or Dominant Strategy Incentive Compatible - DSIC) if reporting true preferences is a dominant strategy for every agent.
- **Gibbard-Satterthwaite Theorem:** This is an impossibility result stating that for any SCF with at least 3 possible outcomes and an unrestricted domain of preferences, the only strategy-proof mechanisms are dictatorial (where one agent determines the outcome).

To circumvent impossibility results like Gibbard-Satterthwaite, mechanism design often utilizes **transfers** (payments) to align individual incentives with social goals.
- **Quasi-Linear Utility:** Agents are assumed to have utilities that are linear in money. An agent's utility is their valuation of the outcome minus the transfer payment: $u_i(x, \theta) = v_i(x, \theta) + t_i(\theta)$.
- **Groves Mechanisms:** A class of mechanisms designed to be efficient and strategy-proof.
	- **Rule:** The mechanism selects the outcome that maximizes social welfare.
	- (TODO: I leave this for later)


