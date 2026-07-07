Short informal summary on set theory.

### Sets

- A set $S$ is an unordered collection of distinct elements (also called members).
	- $x$ is an element of set $S$ is denoted as $x \in S$.
	- $x$ is not an element of set $S$ is denoted as $x \notin S$.
- Two sets are equal if they have precisely the same elements. This is also called the **axiom of extensionality**. It can be written as:
	$$
	A = B \iff \forall x(x \in A \leftrightarrow x \in B)
	$$
- The **empty** set $\emptyset$ is the set that contains no elements. This set is unique.
- The **universal** set $U$ is the set containing all elements for a specific context. This context is called the domain of discourse.
- A **singleton** is a set with exactly one element.

### Set Notation

- **Roster notation** is a method of defining a set by listing its elements between braces, separated by commas. 
	- Examples: $\{2, 3, 5\}$ denotes the set containing the first 3 prime numbers, $\{\}$ denotes the empty set, and $\{42\}$ denotes a singleton containing only the element $42$. 
	- When specifying a set, all that matters is whether each potential element is in the set or not. Consequently, a set does not change if elements are repeated or arranged in a different order.
		- Example: $\{1, 2, 3, 4\} = \{4, 2, 1, 3\} = \{4, 2, 4, 3, 1, 3\}$
- **Set builder notation** is a method to define a set by describing the properties that members must satisfy, rather than listing the elements.
	- Notation: $\{x \mid P(x)\}$
	- The set of all elements $x$  for which the predicate $P(x)$ is true.
	- Example: $\{x \in \mathbb{N} \mid \exists k \in \mathbb{N} (x = 2k)\}$ defines the set of even natural numbers.

### Subsets and Supersets

- A set $A$ is a **subset** of set $B$ (denoted $A \subseteq B$) if every element in $A$ is also an element of $B$.  The set $A$ is a **proper subset** of $B$  (denoted $A \subset B$) if $A$ is a subset of $B$ but $A \neq B$.
- A set $B$ is a **superset** of set $A$ (denoted $B \supseteq A$) if $A$ is a subset of set $B$. The set $B$ is a **proper superset** of $A$ (denoted $B \supset A$) if $A$ is a proper subset of $B$.
- The power set of $A$ is the set of all possible subsets of $A$:
	$$
	\mathcal{P}(A)=\{x \mid x \subseteq A\}
	$$

### Basic Set Operations 

|**Definition**|**Formula**|**Diagram**|
|---|---|---|
|The **union** of sets $A$ and $B$ is the set of all elements that are in $A$, in $B$, or in both.|$A \cup B = \{x \mid x \in A \text{ or } x \in B\}$|![[venn-union.svg]]|
|The **intersection** of sets $A$ and $B$ is the set of all elements that are in both $A$ and $B$.|$A \cap B = \{x \mid x \in A \text{ and } x \in B\}$|![[venn-intersection.svg]]|
|The **difference** of sets $A$ and $B$ is the set of elements that are in $A$ but not in $B$.|$A \setminus B = \{x \mid x \in A \text{ and } x \notin B\}$|![[venn-difference.svg]]|
|The **symmetric difference** of sets $A$ and $B$ is the set of elements in either $A$ or $B$, but not in their intersection.|$A \Delta B = (A \cup B) \setminus (A \cap B)$|![[venn-symdiff.svg]]|
|The **complement** of set $A$ is the set of all elements in the universal set $U$ that are not in $A$.|$A^c = \{x \mid x \in U \text{ and } x \notin A\}$|![[venn-complement.svg]]|

Some properties of the the basic set operations are as follows:
- **Commutative Laws:** The order doesn't matter for union or intersection.
    - $A \cup B = B \cup A$
    - $A \cap B = B \cap A$
- **Associative Laws:** The grouping doesn't matter for union or intersection.
    - $(A \cup B) \cup C = A \cup (B \cup C)$
    - $(A \cap B) \cap C = A \cap (B \cap C)$
- **Distributive Laws:** Union and intersection can be "distributed" over each other.
    - $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$
    - $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$
- **De Morgan's Laws:** These describe how to find the complement of a union or intersection.
    - $(A \cup B)^c = A^c \cap B^c$ 
    - $(A \cap B)^c = A^c \cup B^c$

The basic set operations, union, intersection, and complement are analogous to the logical operators OR ($\lor$), AND ($\land$), and NOT ($\neg$) respectively. 

### Ordered collections

- A tuple is an ordered collection of elements.
	- Unlike sets: may contain duplicates, and order matters.
	- An ordered **pair** is a tuple of 2 elements.
	- An **n-tuple** is a tuple of $n$ elements.
- Cartesian product ($A \times B$) is the set of all possible ordered pairs where the first element is from $A$ and the second is from $B$. 
	$$
	A \times B = \{(a, b) \mid a \in A \land b \in B\}
	$$
- The $n$-th power of a set $A$, denoted $A^n$, is the set of all $n$-tuples of elements from $A$.
	$$
	A^n = \underbrace{A \times A \times \dots \times A}_{n \text{ times}} = \{(a_1, a_2, \dots, a_n) \mid a_i \in A \text{ for } i = 1, \dots, n\}
	$$

### Relations

- A relation on sets $A$ and $B$ is a subset of the Cartesian product $A \times B$.
- A binary relation on $A$ is a subset of $A \times A$.
	- Notation: We often write $a R b$ to mean $(a,b) \in R$ (e.g., $x \le y$).
- Properties of binary relations:
	- Reflexive: $\forall a \in A, aRa$
	- Symmetric: $\forall a, b \in A, a R b \to b R a$
	- Antisymmetric: $\forall a, b \in A, (a R b \land b R a) \to a = b$
	- Transitive: $\forall a, b, c \in A, (a R b \land b R c) \to a R c$
- If a relation is reflexive, symmetric, and transitive, it is an equivalence relation.
- If a relation is reflexive, anti-symmetric, and transitive, it is a partial order.

### Functions

- A **function** $f$ from set $A$ to set $B$ (denoted $f: A \to B$) is a relation where every input corresponds to exactly one output.
	- **Domain:** The set $A$ of all possible inputs.
	- **Codomain:** The set $B$ of all allowed outputs.
	- **Range (or Image):** The set $\{f(a) \mid a \in A\}$ of all actual possible outputs.
- For a relation to be a function, it must be total and well-defined.
	- **Total:** Every input has at least one output.
		- For every $a \in A$, there is some $b \in B$ such that $(a, b) \in f$. 
	- **Well-defined:** Every input has at most one output.
		- If $(a, b) \in f$ and $(a, c) \in f$, then $b = c$. 
- A function may be classified based on its outputs.
	- **Injective (One-to-One):** Every output corresponds to at most one input. 
		- $\forall x, y \in A, f(x) = f(y) \implies x = y$
	- **Surjective (Onto):** Every output corresponds to at least one input. 
		- $\forall b \in B, \exists a \in A \text{ such that } f(a) = b$
	- **Bijective (One-to-One Correspondence):** Both Injective and Surjective.
		- An inverse function $f^{-1}$ exists if and only if $f$ is bijective.
