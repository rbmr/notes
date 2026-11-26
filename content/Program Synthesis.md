---
tags:
  - computer-science/program-synthesis
draft: true
---
### Intro

The goal of **program synthesis** is to find a program that matches some specification. The process of finding such a program is called **synthesis**, and the program that finds such a program is called a **synthesizer**. The open question in program synthesis is how to synthesize programs efficiently, and flexibly. In this document we look into building the fundamentals of program synthesis from the ground up. 

### Syntax and semantics

A programming language has two sides:

- Its **syntax** is the form of programs: which strings count as valid programs, and how these strings are structured.
- Its **semantics** is the meaning of programs: what they compute when they are run.

The two are defined separately. The expressions $x + x$ and $2 \times x$ differ in syntax, but under the usual meaning of $+$ and $\times$ they have the same semantics: both double $x$. Conversely, the same syntax can be given different semantics: `7 / 2` evaluates to $3$ in C and to $3.5$ in Python 3.

We focus on syntax first, and semantics second.

### Formal languages

- An **alphabet** $\Sigma$ is a finite set of symbols.
- A **string** over $\Sigma$ is a finite sequence of symbols from $\Sigma$. The set of all such strings is denoted $\Sigma^*$.
- A **formal language** is any subset $L \subseteq \Sigma^*$.

Viewed syntactically, a programming language is a formal language: the set of strings the compiler accepts. This set is usually infinite, so we need a finite object that describes it.

### Context-free grammars

A **context-free grammar** (**CFG**) is a tuple $G=(N, \Sigma, R, S)$ where:

- $N$ is a finite set of **nonterminals**, which are names for syntactic categories.
- $\Sigma$ is a finite set of **terminals**, disjoint from $N$.
- $R \subseteq N \times (N \cup \Sigma)^*$ is a finite set of **production rules**, written $A \to \beta$.
- $S \in N$ is the **start symbol**.

Let $\alpha, \gamma \in (N \cup \Sigma)^*$ and let $A \to \beta$ be a rule in $R$. Then $\alpha A \gamma$ **yields** $\alpha \beta \gamma$ in one **derivation step**, denoted as $\alpha A \gamma \Rightarrow \alpha \beta \gamma$. Note that applying the rule $A \to \beta$ does not depend on the context $\alpha$ and $\gamma$ around it. This is why the grammar is called context-free. The right-hand side $\beta$ may contain any mix of terminals and nonterminals, including $A$ itself, and it may be the empty string $\varepsilon$.

We say $\alpha$ **derives** $\beta$, written $\alpha \Rightarrow^* \beta$, if $\beta$ can be reached from $\alpha$ in zero or more steps. Formally, $\alpha$ derives $\beta$ if there exist some strings $\alpha_0, \alpha_1, \dots, \alpha_n$ with $n \geq 0$ such that:
$$
\alpha = \alpha_0 \Rightarrow \alpha_1 \Rightarrow \dots \Rightarrow \alpha_n = \beta
$$

Such a sequence of derivation steps is called a **derivation**. A derivation is called a **leftmost derivation** if every step replaces the leftmost nonterminal. The definition of a rightmost derivation follows similarly.

The **language** of a grammar $G$ is the set of all strings of terminals that can be derived from the start symbol: $L(G) = \{ w \in \Sigma^* \mid S \Rightarrow^* w \}$. A language $L \subseteq \Sigma^*$ is a **context-free language** if $L = L(G)$ for some context-free grammar $G$.

> [!note]
> Other classes of grammars and languages exist, such as **regular languages** (described by regular expressions), **context-sensitive languages**, and **Turing-recognizable languages**. This document does not cover these languages, since program synthesis is mostly built on top of context-free grammars.

### Parse Trees

A **parse tree** of $G$ is a finite rooted tree, with ordered children and a label on every node, such that:

- The root is labelled $S$.
- Every inner node is labelled with a nonterminal $A \in N$. If its children are labelled $X_1, \dots, X_k$ from left to right, with $k \geq 1$, then $A \to X_1 \dots X_k$ is a rule in $R$. A rule $A \to \varepsilon$ gives a single child labelled $\varepsilon$.
- Every leaf is labelled with a terminal in $\Sigma$, or with $\varepsilon$.

The **yield** of a parse tree is the string obtained by concatenating its leaf labels from left to right. A string $w \in \Sigma^*$ is in $L(G)$ exactly when some parse tree has yield $w$. A parse tree records which rules were applied where, but not in which order. Several derivations can therefore share one tree, while each tree corresponds to exactly one leftmost derivation.

A string $w$ is **ambiguous** in $G$ if there are two different parse trees with yield $w$, or equivalently two different leftmost derivations of $w$. A grammar is **ambiguous** if at least one string in $L(G)$ is ambiguous in it.

For example, take the grammar $E \to E + E \mid E \times E \mid x \mid 1$ with start symbol $E$. It is ambiguous, because the string $x + 1 \times x$ has two different leftmost derivations:

| Read as $x + (1 \times x)$ | Read as $(x + 1) \times x$ |
| --- | --- |
| $E$ | $E$ |
| $\Rightarrow E + E$ | $\Rightarrow E \times E$ |
| $\Rightarrow x + E$ | $\Rightarrow E + E \times E$ |
| $\Rightarrow x + E \times E$ | $\Rightarrow x + E \times E$ |
| $\Rightarrow x + 1 \times E$ | $\Rightarrow x + 1 \times E$ |
| $\Rightarrow x + 1 \times x$ | $\Rightarrow x + 1 \times x$ |

The corresponding parse trees have the same yield, but a different shape:

%%
Maintainer note for the parse tree diagram below.

Preferences:
- A tree is most readable if edges exit the bottom of each node and enter the top of the next.
- Every leaf has its own column on one bottom row, so the leaves read left to right as the string.
- The two trees sit side by side, in the same order as the columns of the table above.
- One exception is fine: Quartz (Mermaid) shows the outer edges of a root node leaving from its sides.

Obsidian and Quartz render this with different layout engines (Pele and Mermaid), so check changes in both.

What we do to make it work:
- A flowchart without subgraphs. In Obsidian, block-beta drew edges into the sides of nodes.
- Longer arrows (--->, ---->) push all leaves down to the bottom row.
- The odd order of node declarations and edges is deliberate. It was found by testing both engines, and reordering lines may shuffle the leaves.
- The titles are borderless nodes linked to the roots with invisible edges (~~~).
%%

```mermaid
flowchart TD
    t["x + (1 × x)"]
    u["(x + 1) × x"]
    b3["E"]
    b7["x"]
    a9["x"]
    a7["E"]
    a6["×"]
    a1["E"]
    b1["E"]
    b --> b1
    b ----> b2["×"]
    b --> b3
    b1 --> b4["E"]
    b1 ---> b5["#43;"]
    b1 --> b6["E"]
    b4 --> b7
    b6 --> b8["1"]
    b3 ---> b9["x"]
    a --> a1
    a ----> a2["#43;"]
    a --> a3["E"]
    a1 ---> a4["x"]
    a3 --> a5["E"]
    a3 ---> a6
    a3 --> a7
    a5 --> a8["1"]
    a7 --> a9
    t ~~~ a["E"]
    u ~~~ b["E"]
    style t fill:none,stroke:none
    style u fill:none,stroke:none
```

These two readings compute different things. So the string is not the right object to attach meaning to. The tree is.

### Programs as trees

Synthesis therefore works directly on trees, and skips strings, parentheses and operator precedence altogether.

A **regular tree grammar** is a tuple $G = (N, F, R, S)$ where:

- $N$ is a finite set of nonterminals, which here act as **types**.
- $F$ is a finite set of **function symbols**, each with a fixed number of arguments called its **arity**. Symbols of arity $0$ are constants and variables (the difference becomes relevant only when we consider semantics).
- $R$ is a finite set of rules of the form $A \to f(A_1, \dots, A_k)$, with $A, A_1, \dots, A_k \in N$ and $f \in F$ of arity $k$.
- $S \in N$ is the start symbol.

The **terms** of type $A$, written $T_G(A)$, are the smallest sets such that:
$$
(A \to f(A_1, \dots, A_k)) \in R \ \land\ t_1 \in T_G(A_1) \land \dots \land t_k \in T_G(A_k) \implies f(t_1, \dots, t_k) \in T_G(A)
$$
Where:
- $(A \to f(A_1, \dots, A_k)) \in R$ says that the grammar has a rule that builds a term of type $A$ from the function symbol $f$ and $k$ arguments of types $A_1, \dots, A_k$.
- $t_1 \in T_G(A_1) \land \dots \land t_k \in T_G(A_k)$ says that we already have a term of the required type for every argument.
- $f(t_1, \dots, t_k) \in T_G(A)$ is the conclusion: the tree with root $f$ and subtrees $t_1, \dots, t_k$ is a term of type $A$.
- We ask for the smallest sets (one set for each nonterminal) because the implication only says which trees must be included. Larger sets that also contain trees no rule can build may satisfy the implication aswell. In the smallest sets, a tree is included only if the rules require it.

For $k = 0$ the premise about subterms is empty, which gives the base case of this recursive definition. A **program** is a term $t \in T_G(S)$, and the **program space** is the whole set $T_G(S)$.

A term can be drawn as a **program tree**, a finite rooted tree with ordered children. The tree of $f(t_1, \dots, t_k)$ has a root labelled $f$, and its $i$-th child is the root of the tree of $t_i$. A symbol of arity $0$ is therefore a single leaf. Unlike in a parse tree, the inner nodes are labelled with function symbols, and there are no nonterminals or brackets. Such a tree is also called an **abstract syntax tree** (**AST**).

For example, this is the tree of $\text{add}(x, \text{mul}(1, x))$, the program that corresponds to the parse tree of $x + (1 \times x)$ shown earlier. It has 5 nodes, whereas the parse tree has 10.

%%
Maintainer note for the program tree (AST) diagram below.

Preferences: all children of a node are on the same row, and edges exit the bottom of a node and enter the top of the next. Unlike the parse trees above, leaves are not forced onto one bottom row, so use plain arrows (-->). Quartz showing a root's outer edges leaving from its sides is fine. Check changes in both Obsidian and Quartz.
%%

```mermaid
flowchart TD
    n["add"] --> l["x"]
    n --> m["mul"]
    m --> o["1"]
    m --> r["x"]
```

We can also construct these smallest sets in rounds, starting from nothing:

$$
T^{0}(A) = \emptyset, \qquad T^{h+1}(A) = \{ f(t_1, \dots, t_k) \mid (A \to f(A_1, \dots, A_k)) \in R,\ t_i \in T^{h}(A_i) \}
$$

Then $T^h(A)$ contains exactly the programs of type $A$ with height at most $h$, and $T_G(A) = \bigcup_{h} T^h(A)$. In words, every program is built from smaller programs in finitely many steps. This gives us **structural induction**: to prove something about all programs, prove it for $f(t_1, \dots, t_k)$ assuming it holds for $t_1, \dots, t_k$.

The running example of this note is the following grammar, with start symbol $E$ (integer expressions) and a second type $B$ (conditions):

$$
\begin{aligned}
E &\to x \mid y \mid 0 \mid 1 \mid \text{add}(E, E) \mid \text{sub}(E, E) \mid \text{mul}(E, E) \mid \text{ite}(B, E, E) \\
B &\to \text{le}(E, E)
\end{aligned}
$$

Here $\text{ite}$ stands for "if then else" and $\text{le}$ for "less than or equal". The types rule out nonsense such as $\text{add}(\text{le}(x, y), 1)$.

