---
tags:
  - projects
---

Most fundamentally, algorithms are a series of instructions used to perform some deterministic calculation. The goal of testing algorithms is to verify their behavior. Crucially, testing only makes sense if the tests are easier to understand than the algorithm itself. You want some kind of asymmetry. The tests should validate *what* the algorithm does, but *how* it does it is up to the algorithm, and the latter may be significantly more complex than the former.

### Testing by Example

The most basic and standard form of testing is simply providing inputs to your algorithm and verifying the outputs are as expected. This can already be quite useful, but it is still limited. As Dijkstra put it, "testing can be used to show the presence of bugs, but never to show their absence". If a test fails (and the test is correct), you know the code contains a bug. If no test fails, you only know that no test was capable of finding a bug. You don't know that none exists.

You can pick inputs that cover all lines or branches of your algorithm (code coverage), or you can use an algorithm to try a broad range of inputs looking for one that produces an unexpected output (fuzzing), but these techniques still share the same limitation.

### When the Right Answer Is Unknown

Sometimes this kind of testing isn't even possible, because the "right" answer is unknown and cannot be determined. Examples are [[Constraint Solving|constraint solvers]] and other highly optimized pieces of code meant to find a solution to a computationally difficult problem (see my [wordle-opt](https://github.com/rbmr/wordle-opt) repository). If the problem is large enough, computing the solution with a simple algorithm is computationally infeasible. A couple of options are most common:

1. Ask someone or something else to find the solution independently (differential testing). If they get the same solution, yours is more likely to be right. Good as a validation, but often not possible in practice.
2. Record the solutions your (possibly less optimized) code has found previously, and assert that new optimizations don't change these outputs (snapshot testing).
3. Determine a necessary property of the algorithm, and verify that property directly using multiple executions of the algorithm (metamorphic testing). Common examples are verifying that $\sin(x + 2\pi) = \sin(x)$, or that adding a constraint to a constraint satisfaction problem must yield a subset of the feasible solutions of the original problem.
4. Finally, there is proof logging, where the algorithm outputs a certificate (or proof) in addition to its output. This certificate can then be validated by a much simpler, thoroughly analyzed checker. If the checker accepts the certificate, you know the output is correct.

All of these have their own downsides and limitations again, the common denominator being that each of them requires the algorithm to be executed. But the algorithm is deterministic, so its correctness is a property of the code, not of any particular run. Once an algorithm has been shown to be correct, the tests become obsolete (until you change it again).

### Formal Verification

The holy grail of "testing" then becomes formal verification. Formal verification is the process of proving or disproving that a system is correct with respect to a formal mathematical specification ([wikipedia](https://en.wikipedia.org/wiki/Formal_verification)). The specification is the "what", the algorithm is the "how", and the proof shows that the algorithm matches the specification. Proof checkers exist that can rigorously verify a proof, as long as it is written in a specific format. The main issue with formal verification is the difficulty of actually writing these proofs, which is exactly what these otherwise extremely verbose AI systems can help with (see [[Burden of proof]]).

Once finding the proofs and writing the algorithms is solved, you only need to focus on the specification. The future becomes test-driven development, but actually practical.
