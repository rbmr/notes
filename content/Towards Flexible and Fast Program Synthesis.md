---
tags:
  - projects
draft: false
---
In preparation for my master thesis I needed to be come familiar with the existing tools the thesis will build upon. This document covers: the Julia language, the Herb.jl framework, the BART constraint solver, and the PHALCON synthesizer. It is about methodology only: how each piece works and why it is designed that way. Experiments, related work and results are left out on purpose.

### The Problem

- **Program synthesis** is the task of automatically finding a program that satisfies a specification.
- In **inductive program synthesis** (IPS), also called programming by example, the specification is a list of input-output examples. A task is a tuple $(X, Y^*, G)$, where $X = (x_1, \dots, x_n)$ are the inputs, $Y^* = (y_1^*, \dots, y_n^*)$ the target outputs, and $G$ a grammar that defines which programs are allowed.
- A program $f$ **solves** the task when $f(x_i) = y_i^*$ for every example $i$.

A running example used throughout this note:

| Input $x$ | Target output $y^*$ |
| --- | --- |
| `"John Doe"` | `"J Doe"` |
| `"Mayur Naik"` | `"M Naik"` |
| `"Nimit Singh"` | `"N Singh"` |

A solution is "take the first character of $x$, then everything from the first space onwards". Finding it means searching through the programs of $G$, and the number of programs grows exponentially with their size. Everything below is about making that search smaller or smarter.

Note that the examples underdetermine the answer. A program that hard-codes three `if` branches also fits. Synthesizers deal with this by preferring small programs (a form of Occam's razor), which is one reason most of them enumerate programs from small to large.

### Julia

Herb is written in Julia. A few language features explain most of its design.

- **Just-in-time compilation.** Julia compiles each function to native code the first time it is called with a given combination of argument types. Code is as fast as C once compiled, but the first call is slow. This is why a Julia session spends a long time "precompiling" packages, and why benchmarks always include a warm-up run.
- **Multiple dispatch.** A function can have many methods, and Julia picks the method based on the types of *all* arguments, not only the first. Herb uses this as its extension mechanism. A new search strategy is a new type, plus methods of existing functions for that type. Nothing else in the framework has to change.
- **Code is data.** Julia code can be represented as a value of type `Expr`, and a name as a `Symbol` (written `:x`). A program found by Herb can be converted to an `Expr` and then evaluated or compiled like any other Julia code.
- **Macros** transform code before it is compiled. Herb's `@csgrammar` macro reads Julia-like syntax and turns it into a grammar object.

### Herb.jl

**Herb.jl** is a framework for program synthesis developed in the PONY lab at TU Delft. It is split into packages that each own one concept.

| Package | What it provides |
| --- | --- |
| `HerbCore` | The program representation: `RuleNode`, `Hole`, `UniformHole` |
| `HerbGrammar` | Grammars and the `@csgrammar` macro |
| `HerbSpecification` | Specifications: `IOExample`, `Problem` |
| `HerbInterpret` | Running programs on inputs |
| `HerbConstraints` | Constraints and the BART solver |
| `HerbSearch` | Search strategies (program iterators) and the `synth` loop |

#### Grammars

A grammar is a list of **production rules**. Each rule has a left-hand side, a **type** (also called a nonterminal), and a right-hand side that may contain other types as **child types**.

```julia
g = @csgrammar begin
    Number = 0 | 2 | 4 | 6 | 8
    Number = x
    Number = Number + Number
    Number = Number - Number
    Number = Number * Number
end
```

The `|` is shorthand for several rules with the same type, so this grammar has 9 rules. Rules are numbered in order: rule 6 is `x`, rule 7 is `Number + Number`. A **terminal** rule has no children. `x` is special: it refers to the input of an example.

#### Programs as trees

A program is an **abstract syntax tree** whose nodes are rule indices. `RuleNode(7, [RuleNode(6), RuleNode(2)])` means "rule 7 applied to rule 6 and rule 2", which is `x + 2`. Storing indices instead of text makes programs cheap to build, compare and hash.

A **hole** is a node whose rule is not decided yet. Herb stores a hole as a domain: a bit vector with one entry per rule, marking which rules may still go there. A tree with holes is a **partial program**, and it stands for the set of all programs obtained by filling its holes. Search is the process of filling holes.

#### Specifications

```julia
examples = [IOExample(Dict(:x => x), 4x + 6) for x in 1:5]
problem = Problem("example", examples)
```

Each input is a dictionary from variable names (symbols) to values. The `:x` in the dictionary has to match the `x` in the grammar.

#### Search

Every search strategy is a **program iterator**: an object that yields programs one at a time.

```julia
iterator = BFSIterator(g, :Number, max_depth = 5)
for program in iterator
    # program is a RuleNode
end
```

`BFSIterator` enumerates programs breadth-first, from small to large. Other iterators enumerate depth-first, bottom-up, by priority, at random, or by genetic search. The function `synth(problem, iterator)` runs the standard loop: take the next program, run it on every example, stop when all outputs match.

Because iterators share one interface, a new synthesizer is written as a new iterator type, and the `synth` loop, interpreters, benchmarks and constraints all keep working. PHALCON is implemented this way.

#### Interpreting programs

To check a candidate, Herb converts it to an `Expr` and evaluates it with the example's inputs substituted. Evaluating a generic `Expr` is slow. `HerbInterpret` can instead generate a specialized interpreter function for a grammar (`make_interpreter`), which Julia then compiles to native code once. Since a synthesizer evaluates millions of programs, this is where much of the runtime goes.

### BART: Constraints on Program Shape

Most programs in a grammar are useless. Some are **redundant**: `x + 2` and `2 + x` behave the same, and `1 * x` behaves like `x`. Others are **irrelevant**: a program that never uses `x` cannot generalize. Running such programs wastes time. **BART** (implemented in `HerbConstraints`) lets you state rules about the *shape* of programs and enforces them while the search fills holes, so these programs are never generated at all.

BART's key design choice is that constraints are purely syntactic. It never needs to know what `+` means, only what the tree looks like. The specification is about behaviour and requires running a program. Constraints are about the tree and can be checked without running anything. This is what makes them cheap, and also what limits them.

#### The constraint language

A constraint is an operator applied to a **template**, a tree pattern built from three kinds of nodes:

- A **value node** matches exactly one rule, such as `*`.
- A **domain node** matches any rule from a set, such as `{+, *}`. One constraint can then cover several operators.
- A **variable node**, such as `:a`, matches any subtree. If the same variable occurs twice, both places must hold the same subtree.

There are four operators:

| Constraint | Meaning |
| --- | --- |
| `Forbidden(t)` | No subtree matches $t$ |
| `Contains(t)` | At least one subtree matches $t$ |
| `Unique(t)` | Exactly one subtree matches $t$ |
| `Ordered(t, order)` | Wherever $t$ matches, its variables appear in a fixed order |

Examples, for the grammar above extended with the constant `1` and an `if`:

- `Forbidden(1 * :a)` removes multiplication by one on the left.
- `Ordered({+, *}(:a, :b), [:a, :b])` keeps only one of `a + b` and `b + a`, by requiring $a \leq b$ in a fixed total order on trees. This is **symmetry breaking**.
- `Contains(x)` removes every program that ignores the input.
- `Forbidden(if :c then :a else :a)` removes conditionals with two identical branches.

#### Uniform trees

A [[Constraint Solving|constraint solver]] needs a fixed set of variables, each with a domain of values. Program search does not have one. Filling a hole with `+` creates two new holes, while filling it with `x` creates none, so the set of variables changes with every decision.

BART fixes this by splitting the search into pieces that *do* have a fixed shape.

- A **uniform hole** is a hole whose remaining rules all have the same number of children with the same child types. Whichever rule is picked, the shape of the tree stays the same.
- A **uniform tree** is a tree containing only fixed nodes and uniform holes. Inside a uniform tree, every hole is an ordinary constraint variable whose domain is a set of rules.

For example, `{+, *}({1, x}, {1, x})` is a uniform tree: whatever is chosen, it is a binary operator over two leaves. It stands for $2 \cdot 2 \cdot 2 = 8$ programs. `{+, x}(...)` is not uniform, because `+` has two children and `x` has none.

#### Two solvers

- The **generic solver** (`GenericSolver`) handles trees that are not uniform yet. When the search reaches a non-uniform hole, it splits the hole's rules into groups with the same shape, and creates one branch per group. Each branch is a uniform hole.
- The **uniform solver** (`UniformSolver`) takes one uniform tree and enumerates all its programs with standard constraint programming: pick a hole, try a rule, propagate to a fixpoint, and backtrack. Domains are stored in a form that can be restored cheaply on backtracking.

A search strategy talks to the solver through only three operations: `remove!` (remove a rule from a hole), `remove_all_but!` (keep only some rules), and `substitute!` (replace a subtree). This narrow interface is why the same constraints work under top-down, bottom-up and stochastic search.

#### Propagation

A constraint on the whole grammar is turned into **local constraints**: one copy at every node where its template could match. A local constraint only wakes up when a hole it depends on changes, and switches itself off once it can no longer be violated. Matching a template against a partial tree has three outcomes.

1. The match **fails**: no completion can match, so the constraint switches off.
2. The match **succeeds unconditionally**: every completion violates the constraint, so the branch is dead.
3. The match **succeeds conditionally**: it depends on holes that are not filled yet. If a single rule removal prevents the match, the propagator makes that removal. Otherwise it waits.

A trace on the uniform tree `{+, *}({1, x}, {1, x})` with the three constraints `Forbidden(1 * :a)`, `Ordered({+, *}(:a, :b))` and `Contains(x)`, using the order $1 < x$:

1. At the start, the forbidden pattern needs the root to be `*` *and* the left child to be `1`. That depends on two holes, so nothing can be deduced yet.
2. Choose root `+`. The forbidden pattern can no longer match and switches off. Choose left `1`. Now only the right child can contain `x`, so `Contains` forces right to `x`. Result: `1 + x`.
3. Backtrack and choose left `x`. `Ordered` requires left $\leq$ right, so `1` is removed from the right hole. Result: `x + x`.
4. Backtrack and choose root `*`. The forbidden pattern now depends on one hole only, so `1` is removed from the left hole, leaving `x`. `Ordered` then forces right to `x`. Result: `x * x`.

Of the 8 programs, only `1 + x`, `x + x` and `x * x` are ever produced. The other five are never built, which is the difference between propagation and generating every program and checking it afterwards.

#### What BART does not do

BART enforces constraints, but it does not invent them. Every constraint is written by a human or imported from elsewhere. Constraints are also task-independent: they encode knowledge about a grammar, not about the examples of one task. Generating constraints automatically for a specific task is left as future work in the BART paper.

### PHALCON: Learning Guidance per Task

Hand-written guidance has a cost. Learned heuristics such as those in BUSTLE or CrossBeam are trained on many tasks from one domain, so they work well on string manipulation and not at all elsewhere. Distance measures such as Levenshtein distance only make sense for one output type. **PHALCON** (Stef Rasing, 2026) instead builds its guidance from the task it is solving, using nothing but the task's own grammar and examples. The paper calls this **task-level adaptation**.

#### Properties

- A **property** is a function $\pi : X \times \tau^{(o)} \to U_\pi$ that extracts one aspect of an output $y$ for input $x$, where $\tau^{(o)}$ is the output type and $U_\pi$ any type whose values can be compared for equality. Examples: the length of $y$, the first character of $y$, whether $y$ contains a space, whether $y$ occurs in $x$.
- Applied to every example, a property gives the **property-value vector** $\pi(X, Y) = [\pi(x_1, y_1), \dots, \pi(x_n, y_n)]$.
- A program $f$ with outputs $Y_f = [f(x_1), \dots, f(x_n)]$ **satisfies** $\pi$ when $\pi(X, Y_f) = \pi(X, Y^*)$.
- For a set of properties $\Pi$, the **agreement set** $A(\Pi)$ is the set of programs in $G$ that satisfy every property in $\Pi$.

For the running example, $\pi(x, y) = \text{length}(y)$ has target vector $[5, 6, 7]$, and $\pi(x, y) = \text{index}(y, 1)$ has target vector `[J, M, N]`. The constant program `" "` satisfies neither.

A property is a weaker version of the specification. Satisfying $\pi_{\text{exact}}(x, y) = y$ means solving the task. Satisfying "the first character is right" is a step towards it, and it is much easier to reach.

#### Generating candidate properties

PHALCON does not use a hand-made list of properties. It takes the task grammar $G$ and adds one new terminal $y$, which stands for the output being inspected:

$$
G_\pi = G \cup \{ y : \tau^{(o)} \}
$$

Every well-typed expression of $G_\pi$ that contains $y$ is a candidate property. PHALCON enumerates them bottom-up up to a maximum size (the number of operators, so constants are free), and stores each one's target vector $\pi(X, Y^*)$. For a string grammar this produces properties like `length(y)`, `index(y, 1)` and `contains(x, y)` automatically, and for a bit-vector grammar it produces bit-vector properties. The result is a finite set $\Pi_{\text{candidate}}$.

#### Measuring how informative a property is

The program space is infinite, so PHALCON measures properties against a finite **sample** of programs $F$.

- The **agreement rate** of $\Pi$ is the fraction of sampled programs that satisfy all of it:
$$
\alpha_F(\Pi) = \frac{|A(\Pi) \cap F|}{|F|}
$$
- The **information** of $\Pi$ is the negative log-likelihood of agreeing by chance:
$$
I_F(\Pi) = -\log_2 \alpha_F(\Pi)
$$

A property that almost every program satisfies tells you nothing. A property that few programs satisfy tells you a lot. A property that *no* sampled program satisfies is useless as guidance, because nothing can make progress towards it ($\pi_{\text{exact}}$ is the extreme case), so selected properties must have $\alpha_F > 0$.

#### Conditional sampling

The central idea is to sample from the right region. A random sample of programs is mostly unrelated to the task, so properties chosen against it separate the target from nonsense, not from almost-right programs. PHALCON therefore alternates:

1. **Sample** programs from the current agreement set $A(\Pi_t)$, the programs that already satisfy everything selected so far.
2. **Select** the candidate property with the smallest nonzero agreement rate on that sample, and add it: $\Pi_{t+1} = \Pi_t \cup \{\pi_t\}$.

Each round asks "among the programs that look right so far, what still distinguishes them from the target?" In the running example, a first round might select `index(y, 1)`, so outputs must start with the right letter. Among programs that do, outputs like `"Joh "` and `"J "` remain, and a second round might select `indexOf(y, " ")`, so the space must also be in the right place.

The paper gives an idealized argument for why this helps. One unconditional sample of $N$ programs yields at most $\log_2 N$ bits, since the rarest property has agreement rate $1/N$. Splitting the same $N$ programs into $N/B$ conditional batches of size $B$ yields up to $\frac{N}{B} \log_2 B$ bits, which grows linearly in $N$ instead of logarithmically. For $N = 100$: one batch gives about 6.6 bits, five batches of 20 give about 21.6 bits. This is an upper bound, not a guarantee.

#### Sampling with genetic programming

To sample from $A(\Pi_t)$, PHALCON uses **genetic programming** (GP). GP keeps a population of complete programs, creates new candidates by **crossover** (combining subtrees of two parents) and **mutation** (changing one program), and keeps the best ones by a cost function. PHALCON's cost is the number of property disagreements, counted per example:

$$
\text{cost}_\Pi(f) = \sum_{\pi \in \Pi} \sum_{i=1}^{n} \mathbb{1}\left[\pi(x_i, f(x_i)) \neq \pi(x_i, y_i^*)\right]
$$

Counting per example gives partial credit: a program that gets the first letter right on two of three examples scores better than one that gets none right. A cost of zero means $f \in A(\Pi)$. Two more design choices:

- **Output diversity.** No two programs in the population may produce the same output vector, so the sample is not filled with copies of the same behaviour.
- **Termination.** A GP run stops when it finds an exact solution (PHALCON returns it), when the whole population has cost zero (it is now a sample of $A(\Pi_t)$), or after a fixed number of generations without improvement (the population is then used anyway, as evidence of what is still wrong).

#### The full loop

1. Generate $\Pi_{\text{candidate}}$ from $G_\pi$ and set $\Pi_0 = \emptyset$.
2. Run GP with cost $\text{cost}_{\Pi_t}$. If it finds an exact solution, return it.
3. Otherwise select a property from the final population and add it to $\Pi_t$.
4. Repeat until a maximum number of properties is reached, then do one final GP run.

With $\Pi_0 = \emptyset$ every program has cost zero, so the first population is simply a random sample.

#### Where BART and PHALCON meet

PHALCON's properties are only checked by running *complete* programs. It never uses them to prune *partial* programs during search, which is what BART is good at. BART, in turn, only enforces constraints that a human wrote. Turning a learned property into something that prunes partial programs requires knowing how each operator affects the property (for example, that the first character of `concat(a, b)` is the first character of `a` when `a` is nonempty), which is exactly the semantic knowledge BART chose not to need. That gap is where my thesis starts.
