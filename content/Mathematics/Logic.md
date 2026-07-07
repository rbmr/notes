We humans use natural language when we speak, such as Dutch or English. But natural languages are ambiguous and often vague. In mathematics, we use logic.

### Propositions

- A **proposition** is a statement which is either true (1), or false (0).
- A **propositional variable** is a variable that has not assumed either value. Propositional variables are usually denoted using lower case letters (e.g., $p$ and $q$).
- A **logical operator** (or **logical connective**) is a symbol used to create new propositions from existing propositions.
- A **compound proposition** is a proposition made up out of simpler propositions using logical operators.
- A **situation** is a specific assignment of truth values to all propositional variables contained within a compound proposition.
- A **truth table** is a table that shows the truth values of one or more compound propositions for each possible situation.
- A compound proposition is said to be a:
	- **tautology** if it is true for all situations.
	- **contradiction** if it is false for all situations.
	- **contingency** if it is neither a tautology nor a contradiction.

### Some Logical Operators

The following six logical operators are most common:

|**Name**|**Operator**|**Pronunciation**|**Description**|
|---|---|---|---|
|**Negation**|$\neg p$| "not $p$" |True if $p$ is false, and false otherwise.|
|**Conjunction**|$p \land q$| "$p$ and $q$" |True if $p$ and $q$ are both true, and false otherwise.|
|**Disjunction**|$p \lor q$| "$p$ or $q$"|True if at least one of $p$ or $q$ is true.|
|**Implication** or **Conditional**|$p \rightarrow q$| "$p$ implies $q$" or "if $p$ then $q$" |False only if $p$ is true and $q$ is false.|
|**Biconditional**|$p \leftrightarrow q$| "$p$ if and only if $q$" |True only if $p$ and $q$ have the same truth value.|
|**Exclusive** or|$p \oplus q$| "either $p$ or $q$"|True only if $p$ and $q$ have different truth values.|

These correspond to the following truth table:

| $p$ | $q$ | $\neg p$ | $p \land q$ | $p \lor q$ | $p \rightarrow q$ | $p \leftrightarrow q$ | $p \oplus q$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $0$ | $0$ | $1$ | $0$ | $0$ | $1$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $0$ | $1$ | $1$ | $0$ | $1$ |
| $1$ | $0$ | $0$ | $0$ | $1$ | $0$ | $0$ | $1$ |
| $1$ | $1$ | $0$ | $1$ | $1$ | $1$ | $1$ | $0$ |

Suppose we have the implication $p \rightarrow q$, then
- $p$ is called the **hypothesis** or **antecedent**
- $q$ is called the **conclusion** or **consequent**
- If the implication holds,
	- $p$ is **sufficient** for $q$. That is, if $p$ is true that is sufficient to also make $q$ true.
	- $q$ is **necessary** for $p$. That is, without $q$ being true, it is impossible for $p$ to be true.
- its **contrapositive** is $\neg q \rightarrow \neg p$. 
- its **converse** is $q \rightarrow p$. 
- its **inverse** is $\neg p \rightarrow \neg q$. 

In many fields, it is common to use arithmetic symbols to represent logical operations, which is called **Arithmetic Notation**. This is based on the idea that if we treat **True as 1** and **False as 0**, logical operations behave very much like standard multiplication and addition.

- Conjunction (AND) is the Product. The proposition $p \land q$ is written as $p \cdot q$ (or simply $pq$). 
- Disjunction (OR) is Sum. The proposition $p \lor q$ is written as $p + q$.
	- Following the definition of disjunction, $1+1=1$.
- Negation (NOT) is an Overbar: The proposition $\neg p$ is written as $\bar{p}$.

| $p$ | $q$ | $\bar{p}$ | $p \cdot q$ | $p + q$ |
| --- | --- | --- | --- |  --- |
| $0$ | $0$ | $1$ | $0$ | $0$ |
| $0$ | $1$ | $1$ | $0$ | $1$ |
| $1$ | $0$ | $0$ | $0$ | $1$ |
| $1$ | $1$ | $0$ | $1$ | $1$ |

### Boolean Algebra

- Two compound propositions $P$ and $Q$ are **logically equivalent** if and only if the proposition $P \leftrightarrow Q$ is a tautology. $P$ is logically equivalent to $Q$ is denoted as $P \equiv Q$ (or alternatively $P \iff Q$, or $P \Leftrightarrow Q$).
- One compound proposition $P$ **logically implies** another compound proposition $Q$ if and only if the proposition $P \rightarrow Q$ is a tautology. $P$ logically implies $Q$ is denoted as $P \implies Q$.
- Logical implication and logical equivalence can be shown in one of two ways:
	1. brute force: checking all possible assignments of truth values.
	2. boolean algebra: chaining a series of implications and/or equivalences together.
- **Substitution Law**: Suppose $P$ and $Q$ are any propositions such that $P \equiv Q$. Suppose $R$ is any compound proposition in which $P$ occurs as a sub-proposition. Let $R'$ be the proposition obtained by substituting $Q$ for that occurrence of $P$ in $R$. Then $R \equiv R'$.

### Some Logical Equivalences

Here is a list of some logical equivalences, you can verify them easily using a truth table. Note many of these follow trivially from the others. 

|**Law**|**Logical Equivalence**|
|---|---|
|Double Negation|$\neg(\neg p) \equiv p$|
|Biconditional|$p \leftrightarrow q \equiv (p \rightarrow q) \land (q \rightarrow p) \equiv (p \land q) \lor (\neg p \land \neg q)$|
|Exclusive Or|$p \oplus q \equiv \neg(p \leftrightarrow q) \equiv p \leftrightarrow \neg q \equiv \neg p \leftrightarrow q$|
|Material Implication|$p \rightarrow q \equiv (\neg p) \lor q$|
|Contrapositive|$p \rightarrow q \equiv (\neg q) \rightarrow (\neg p)$|
|Negation of a Conditional|$\neg(p \rightarrow q) \equiv p \land \neg q$|
|Reductio ad Absurdum|$p \rightarrow \mathbb{F} \equiv \neg p$|
|Exportation Law|$(p \land q) \rightarrow r \equiv p \rightarrow (q \rightarrow r)$|
|Principle of Explosion|$\mathbb{F} \rightarrow q \equiv T$|

For any compound proposition $S$ involving only the operators $\land$, $\lor$, and the constants $\mathbb{T}$ (true) and $\mathbb{F}$ (false), its **dual**, denoted as $S^*$, is formed by swapping $\lor$ for $\land$, and $\mathbb{T}$ for $\mathbb{F}$ and vice-versa. The **principle of duality** states that if two propositions are logically equivalent ($P \equiv Q$) then their duals are also logically equivalent ($P^* \equiv Q^*$).

|**Dual Law**|**Conjunction ($\land$)**|**Disjunction ($\lor$)**|
|---|---|---|
|Complement|$p \land \neg p \equiv \mathbb{F}$|$p \lor \neg p \equiv \mathbb{T}$|
|Domination|$p \land \mathbb{F} \equiv \mathbb{F}$|$p \lor \mathbb{T} \equiv \mathbb{T}$|
|Identity|$p \land \mathbb{T} \equiv p$|$p \lor \mathbb{F} \equiv p$|
|Idempotent|$p \land p \equiv p$|$p \lor p \equiv p$|
|Commutative|$p \land q \equiv q \land p$|$p \lor q \equiv q \lor p$|
|Associative|$(p \land q) \land r \equiv p \land (q \land r)$|$(p \lor q) \lor r \equiv p \lor (q \lor r)$|
|Distributive|$p \land (q \lor r) \equiv (p \land q) \lor (p \land r)$|$p \lor (q \land r) \equiv (p \lor q) \land (p \lor r)$|
|DeMorgan's|$\neg(p \land q) \equiv (\neg p) \lor (\neg q)$|$\neg(p \lor q) \equiv (\neg p) \land (\neg q)$|
|Absorption|$p \land (p \lor q) \equiv p$|$p \lor (p \land q) \equiv p$|
|Elimination|$(p \lor q) \land (p \lor \neg q) \equiv p$|$(p \land q) \lor (p \land \neg q) \equiv p$|

### Normal Forms

- A set of logical operators is **functionally complete** if and only if all formulas in propositional logic can be rewritten to an equivalent form that uses only operators from the set. 
	- The sets $\{\neg, \lor\}$ and $\{ \neg, \land \}$ are functionally complete.
- A **literal** is a single propositional variable ($p$) or its negation ($\neg p$).

|**Feature**|**Disjunctive Normal Form (DNF)**|**Conjunctive Normal Form (CNF)**|
|---|---|---|
|**Building Block**|Conjunctive Clause (Minterm): Literals connected by AND ($\land$).|Disjunctive Clause (Maxterm): Literals connected by OR ($\lor$).|
|**Definition**|A disjunction of conjunctions (ORs of ANDs).|A conjunction of disjunctions (ANDs of ORs).|
|**Structure**|$(C_1) \lor (C_2) \lor \dots \lor (C_n)$|$(D_1) \land (D_2) \land \dots \land (D_n)$|
|**From Truth Table**|Take every row where the output is TRUE (1). For each such row, create a Minterm where literals are $p$ (if true) or $\neg p$ (if false).|Take each row where the output is FALSE (0). For each such row, create a Maxterm where literals are $\neg p$ (if true) or $p$ (if false).|

- **Canonical (Full) Form**: every clause contains every variable in the proposition exactly once. This is form is unique for every truth table.
- **Simplified Form**: clauses are combined as much as possible.
- There are 3 main ways to convert a proposition from canonical to simplified form:
	- Boolean Algebra: repeatedly apply the aforementioned rules of boolean algebra, specifically absorption and elimination.
	- Karnaugh-Maps (K-maps): visual method for finding the simplified form when trying to do so by hand, only really applicable for 2-4 variables. ([More info](https://en.wikipedia.org/wiki/Karnaugh_map))
	- Quine-McCluskey Algorithm: algorithm for finding the simplified form designed to be efficient for computer algorithms. Although it is more practical than K-maps, it also has a limited range of use as the runtime grows exponentially with the number of variables. ([More info](https://en.wikipedia.org/wiki/Quine%E2%80%93McCluskey_algorithm)) 

### Predicate Logic

- **Entity:** An individual object, person, or concept within a logic system (e.g., "Socrates" or "The Moon") that can be named and discussed.
- **Domain of Discourse:** The specific set or "universe" of all possible entities that a logic statement is currently considering. 
- **Predicate:** A property or relation that results in a true or false value when applied to an entity. A predicate is a called an $n$-place predicate if it accepts $n$ entities  (e.g., in "The Moon is round," "is round" is a one-place predicate).

| |**Universal Quantifier**|**Existential Quantifier**|
|---|---|---|
|Definition|The **universal quantifier** $\forall xP(x)$ indicates that a predicate $P(x)$ holds true for every single entity $x$ within the domain of discourse.|The **existential quantifier** $\exists xP(x)$ indicates that the predicate $P(x)$ holds true for at least one entity $x$ within the domain of discourse.|
|DeMorgan's|$\neg \forall x P(x) \equiv \exists x \neg P(x)$|$\neg \exists x P(x) \equiv \forall x \neg P(x)$|
|Logical Connective|$P(x_1) \land P(x_2) \land \dots \land P(x_n)$|$P(x_1) \lor P(x_2) \lor \dots \lor P(x_n)$|

- **Constant:** A symbol that represents a specific, fixed entity from the domain of discourse (e.g., $s$ for "Socrates" or $2$ for the number two).
- **Variable:** A symbol (usually $x, y, z$) that acts as a placeholder for any entity in the domain. A variable is **bound** if it is within the scope of a quantifier, and **free** otherwise. For example in $P(x) \land \exists y Q(y)$, the $x$ is **free** (its value is unspecified), while $y$ is **bound** (it is a value from the domain of discourse).
- An **Open Formula** (sometimes called a **Compound Predicate**) is a logical expression that contains at least one **free variable**. It is "open" because its truth value cannot be determined until you either bind the variables with quantifiers or substitute them with specific constants. For example, if $P(x)$ is "x is a philosopher" and $S(x)$ is "x is Greek," the open formula $P(x) \land S(x)$ represents the compound predicate "x is a Greek philosopher."

### Deduction

Definitions

- A **premise** is a proposition that is known to be true or has been accepted to be true for the sake of argument.
- A **conclusion** is a proposition that can be deduced logically from the premises.
- An **argument** is a claim that a certain conclusion follows logically from a given set of premises. 
	- An argument is considered a **valid argument** if its conclusion follows logically from the premises in all cases where the premises are true. 
	- An argument is considered **sound** if it is valid and the premises are actually true in reality.
- A **formal proof** is a sequence of propositions that demonstrates an argument's validity, where the final proposition is the conclusion and every preceding step is either a premise or follows by logical deduction from previous propositions.

Rules of Deduction

- **Modus ponens**: If a conditional statement $p \rightarrow q$ is true, and the premise $p$ is true, one can logically deduce the conclusion $q$.
- **Modus tollens**: A closely related deductive rule stating that from the conditional premise $p \rightarrow q$ and the premise $\neg q$, one can logically deduce $\neg p$.
- **Law of syllogism**: A rule of deduction that chains implications together; specifically, from the premises $p \rightarrow q$ and $q \rightarrow r$, one can logically deduce $p \rightarrow r$.

Logical Fallacies 

- A **logical fallacy** is an error in reasoning that renders an argument invalid. In formal logic, these often occur when someone treats a conditional statement as if its converse or inverse were also true.
- **Affirming the Consequent:** This fallacy occurs when one assumes that because the conclusion ($q$) is true, the hypothesis ($p$) must also be true.
	- **Form:** $(p \rightarrow q) \land q \implies p$ (This is **invalid**).
- **Denying the Antecedent:** This fallacy occurs when one assumes that because the hypothesis ($p$) is false, the conclusion ($q$) must also be false.
	- **Form:** $(p \rightarrow q) \land \neg p \implies \neg q$ (This is **invalid**).

### Proofs

- **Proof by generalization**: Used to prove universal statements of the form $\forall x P(x)$ by letting $x$ be an arbitrary, unspecified entity in the domain of discourse and proving that $P(x)$ holds true for it. Because $x$ is entirely arbitrary, no facts beyond the assumed hypotheses are used, proving the statement applies to the entire domain.
- **Existence proof (or counterexample)**: Used to prove a statement of the form $\exists x P(x)$ by finding a specific example, or entity $a$, for which $P(a)$ is true. When this technique is used to prove that a universal statement $\forall x P(x)$ is false, the example is called a **counterexample**, which effectively proves the equivalent existential statement $\exists x(\neg P(x))$.
- **Proof by contrapositive**: Indirectly proves $p \rightarrow q$ by directly proving its logically equivalent contrapositive statement, $\neg q \rightarrow \neg p$.
- **Proof by division into cases:** Proves a universal claim by partitioning the domain into distinct logical cases and independently demonstrating that the claim holds for each individual case.
- **Proof by contradiction:** Proves a proposition to be true, by first assuming it to be false and applying valid rules of logic to derive a contradiction, typically of the form $q\wedge\neg q$.
	- Because applying valid logic to true statements yields only true statements, deriving a falsehood proves that the initial assumption must be false.
- **Proof by (Structural) Induction** is a proof technique used to prove that a property $P(x)$ holds for all elements of a recursively defined set (such as strings, trees, logical formulas, or the set of all natural numbers). The proof consists of two steps:
	1. **Basis Step:** Show that the property $P(x)$ holds for all "base" elements specified in the recursive definition (the elements used to start the set).
	2. **Recursive Step:** Assume the property $P(x)$ holds for existing elements (the **inductive hypothesis**). Show that if you use the recursive rules to create a new element $x'$ from those existing elements, the property $P(x')$ still holds.
