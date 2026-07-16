### Disclaimer

The following are some loose thoughts I had with respect to automated theorem proving. They are in no way worked out or concrete. Since the concept is so abstract, it is almost hard for me to distinguish between whether I am saying absolute nonsense, or am actually on to something. Consider it "food for thought"

### Ramble

To me, automated theorem proving (ATP) seems like a really fascinating problem. And determining how to tackle the problem is almost philosophical. The following is a collection of ideas, concepts and questions I believe would be relevant for tackling the problem.

My first argument, is that in order to have a good theorem prover, you must have a system that is capable of some kind of open-ended discovery. Sure, you can have solver that can repeatedly apply existing rules in a direct attempt to solve the problem at hand, but in many cases showing something directly is significantly more difficult than showing something else first, and using these results to solve the primary problem. This idea of needing to find useful building blocks, is the core of what I believe is important.

Furthermore, I notice that the field of mathematics is historically biased for concepts that are more natural to humans. For example, a preference for real numbers over complex numbers, and Euclidean geometry over other systems of geometry. This is of course useful, because it is significantly easier to make progress in a domain that feels natural since we can use out intuition, but "unnatural" systems have been shown to be incredibly important aswell. Intuitively, I believe our system should not inherit these biases, or have any biases of its own, and instead be capable of functioning across all mathematical worlds. We essentially want the reward hacking behaviour of the agent to work in our favor. The solution may be weird, and unnatural, but as long as the proof it generates is valid, we are satisfied.

Next, I argue that in order to do this efficiently the system must be free to make many, extremely fundamental decisions, and not be constrained by a specific mathematical framework. They should be able to create new definitions and theorems, and approach the problem from an entirely different perspective. Of course, this comes with the risk of a horribly large action space. So, some intelligent compromise must be found here. I feel like this problem relates to the intuition behind category theory.

A painfully apparent question is as follows: what even is mathematics? and how would you define mathematical progress? 

With regard to the definitions of mathematics, it should not be tied to a set of axioms, nor should it be tied to some rules of logic. We *could* start with the assumptions these systems will do mathematics in similar ways we do. After all, these systems will be able to benefit from all the progress we have already made. But this would lose the flexibility  and inherit the bias we talked about previously.

With respect to the idea of mathematical progress, I believe some idea of compression is relevant. The idea of effective abstractions, like Poincare's quote "mathematics is the art of giving the same name to different things". It is the idea of building a knowledge base of mathematical truths that are widely applicable (can be applied to many things), yet are not redundant (we already have some other statement that can applied in many of the same scenarios to derive the same conclusions). I feel like this idea is similar to conflict analysis in constraint solvers or mathematical optimization. In which case, the agent is expected to either be driven directly or indirectly to determine the most general form of each mathematical statement it discovers. Whenever it notices 1+2 = 2+1 and 2+3 = 3+2, it should start wondering whether this holds true for all x and y. 

This leads me to another idea that I stumbled upon recently, in many cases where symmetries may exist, this does not have to lead to an explosion of the search space. Ideally the system itself should be capable of acknowledge the symmetry effectively collapsing it. 

Another question is how to represent this mathematical knowledge. How would it be stored in memory? How would it be (de)serialized? How would it be displayed (using what symbols)?

### Prompt and Response

To get some direction, I then sent this ramble to Claude, and added the following prompt:

> I think almost the hardest part of the problem is even defining what the problem is. I am still stuck at "what is mathematics". Could we maybe attempt a high level, yet concrete definition of both "the game", and "what constitutes improvement". Think long and deep about this question. What are existing attempts with respect to this problem? Where did they differ from my intuition, how where they similar?

Claude responded with:
```markdown
This is a great set of notes, and you're right that the definitional question is the hard core. Let me take a real run at it. The trap in "what is mathematics?" is looking for an _essence_. For system-building you don't need an essence, you need an _interface_ — and I'll argue every workable answer splits into two layers with completely different characters: a **validity layer**, which must be fixed, tiny, and sound; and a **value layer**, which must be learned, negotiable, and growing. Almost all of your intuitions live in the value layer. Almost all of the field's success lives in the validity layer. That mismatch explains most of the history.

### The game

Here's the most concrete definition I can defend.

Fix a checker **V**: a small trusted program taking (substrate S, assumptions Γ, statement s, derivation d) and returning accept/reject. This is the _only_ ground truth in the entire system. Crucially, every fact is stored as a conditional — "Γ ⊢_S s" — never as bare truth. That one move dissolves your worry about being tied to axioms: axioms stop being commitments and become _coordinates_. The parallel postulate isn't believed or disbelieved; the library just contains theorems from worlds with it and worlds without, plus translations between worlds — and an interpretation of one theory inside another is itself a checkable object. This is exactly how reverse mathematics treats axioms (things to calibrate against, mapping which theorems need which strength), how Hamkins's set-theoretic multiverse treats universes, how topos theory treats logics (every topos carries its own internal, generally intuitionistic, logic), and it's what Goguen and Burstall's _institutions_ formalize outright: a mathematics of logical systems and the morphisms between them. On the engineering side, Dedukti (a λΠ-calculus-modulo framework) was built as precisely this kind of interlingua for proofs from different systems.

Then the game state is a library **L**: definitions, conditional theorems with proof terms, conjectures, translations, plus the learned policies themselves. The moves are five: **prove** (spend compute closing a goal), **conjecture** (emit new goals), **define/refactor** (introduce an abstraction and rewrite the library through it, re-checked by V), **translate** (build interpretations between substrates), and **extend** (adopt a new substrate or axiom set — a new world, tracked as such). Optionally split the agent into two roles, conjecturer and prover — and note this contacts a genuine tradition: in Lorenzen's dialogue games and Hintikka's game semantics, mathematical truth literally _is defined_ as the existence of a winning strategy for the Verifier. Lakatos's _Proofs and Refutations_ is the other license here: he portrays mathematics as a game between prover and counterexample-finder in which _definitions themselves are moves_ (concept-stretching, monster-barring). That's the philosophical warrant for making your "create new definitions" a first-class action rather than a preprocessing step.

One historical anchor: the game framing is Hilbert's own — formalism describes mathematics as a formula game. But Gödel showed no single fixed game exhausts mathematics: any consistent effective system leaves truths unreachable. Turing (ordinal logics) and later Feferman (transfinite progressions of theories) then studied the _meta-game_ of extending games. So your instinct that the agent must be free to make "extremely fundamental decisions" isn't a nice-to-have — it's forced by incompleteness. The action-space explosion you fear is the price of that theorem, and compression (below) is the only tamer I know: game-changing moves survive only if they pay for themselves.

### Improvement

First, the split that organizes everything: **validity is a gate, not a metric**. Because V is sound, the reward channel for "is this a proof" cannot be hacked — that is the precise content of your "reward hacking works in our favor," and it's the real reason mathematics is uniquely RL-friendly among all domains. (Caveat in one clause: kernels have bugs, and shortcuts like reflection/native evaluation widen the trusted base — so keep V tiny.) What _can_ be hacked is everything else: what to prove, what corpus to compress, how to rate difficulty. Validity is Goodhart-proof; value is Goodhart-bait. Every famous failure in this lineage — AM's drift being the canonical case — was a value failure, never a validity failure.

I'd operationalize value along three axes, all needed because each is gameable alone.

**Reach.** Fix a task distribution D and budget c; score the measure of goals from D provable within c. This is what current systems optimize (miniF2F, competition sets). It's concrete and meaningful, exactly as human-biased as you fear, and it saturates. Improvement = growth of the reachable set per unit compute.

**Compression.** Total description length of the library plus the proofs of an anchored corpus: MDL(L) + Σᵢ len(proofᵢ | L). A new definition or lemma is admitted iff it strictly decreases this total. Notice this makes your "widely applicable yet non-redundant" criterion _exactly_ precise: applicability = number of use sites × savings per site; redundancy = the case where those savings are already captured by existing items, so the candidate can't reduce the total — it's subsumed. Poincaré's "same name to different things" becomes an accounting identity. And this isn't hypothetical: DreamCoder (Ellis et al., 2021) and its successor compression engines run precisely this objective over program libraries, rediscovering things like list combinators from scratch; Schmidhuber's compression-progress theory proposes the _first derivative_ of compression as the interestingness signal itself; Chaitin's slogan that a theory is a program shorter than the data it explains is the same idea at foundational scale. Crucially, proof theory says abstraction is not cosmetic bookkeeping: cut elimination — mechanically removing lemma use — has non-elementary worst-case blowup (Statman and Orevkov, 1979; towers of exponentials), and Boolos's "curious inference" exhibits a statement with a one-page proof via a higher-order definition whose definition-free first-order proof couldn't fit in the physical universe. Lemmas change the complexity class of proof search. Your building-blocks argument is, quite literally, a theorem.

**Transfer.** Performance on held-out worlds: substrates, logics, and domains never trained on. You cannot verify the _absence_ of bias, but you can measure whether competence survives translation into constructive logic, finite geometries, p-adic worlds. This is the only honest operationalization of your anti-bias desideratum.

Plus one dynamic signal: **frontier motion** — the rate at which the conjecturer's zone of "provable at roughly 50%" moves outward, measured by an Elo-style rating over problems. This is the POET / unsupervised-environment-design pattern, and Minimo (Poesia et al., 2024) implements it for mathematics at small scale: a conjecturer and prover jointly trained _from axioms alone_, with difficulty targeting and hindsight relabeling.

A mapping you might enjoy: reach and compression are precisely Gowers's "two cultures" — problem-solvers and theory-builders — turned into loss functions. Hardy's criteria from the _Apology_ decompose the same way: "generality" ≈ call-site count, "depth" ≈ distance in the derivation DAG (equivalently, how much a result compresses what sits above it), "unexpectedness" ≈ Bayesian surprise, which is just compression progress. Colton's HR system hand-coded these as "applicability," "novelty," "surprisingness" decades ago. Human mathematics never had to write down the weighting between the two cultures; your system must, and that weight vector _is_ an executable philosophy of mathematics.

The honest caveats: compression is gameable through corpus choice and through the description language. The invariance theorem says language choice costs only an additive constant — but the constant is where everything interesting lives, and that is exactly the AM lesson. Lenat and Brown's own postmortem ("Why AM and EURISKO Appear to Work") concluded AM succeeded largely because Lisp's syntax was accidentally dense in mathematical concepts, and stalled when discovery outran the representation. Two design consequences: the representation must itself be _inside_ the game as a refactorable object, and the corpus must be anchored — a human seed corpus plus the self-generated frontier — so the system can neither navel-gaze nor merely imitate.

### Existing attempts, mapped against your notes

**Classical ATP and proof assistants.** The game here is fixed-substrate derivation search. Your conflict-analysis analogy is better than you may realize: CDCL _is_ lemma learning. The clause distilled from each conflict is a small lemma, retained if it prunes elsewhere, deleted when unused — modern clause-management policies (activity, LBD scoring) are literally an applicability-versus-redundancy economy, and first-order provers run the same economy via derived clauses and subsumption; MIP solvers do it as no-good learning and cutting planes. What this whole family lacks is your move three: they learn lemmas in a fixed language but never new _concepts_. Adjacent and underrated: theory-exploration systems (QuickSpec, Hipster, TheSy) that conjecture equational lemmas by empirical testing and then prove them — and the formal engine behind your "1+2=2+1, 2+3=3+2 ⇒ ∀x,y" step exists and has a name: anti-unification, Plotkin's least general generalization (1970). The leap from generalization to proof then usually needs induction, which is its own lineage — Bundy's proof planning and rippling — notable because it abstracts proof _strategies_ rather than statements, a second axis of abstraction your notes don't yet distinguish.

**The ML provers.** AlphaGeometry's entire trick is a neural proposer of auxiliary constructions bolted onto a complete-but-blind symbolic engine — "show something else first," learned. AlphaProof is AlphaZero-style RL against Lean's kernel over roughly a million autoformalized problems, and the 2025 natural-language systems reached IMO-gold performance without a kernel at all. Strongly aligned with your first intuition; opposed to nearly everything else in your notes: fixed substrate (Lean plus Mathlib, which is a monument of specifically human, classical, real-analysis-flavored taste), value defined as reach on human benchmarks, little persistent cross-problem library growth, no cross-world transfer. They are validity-layer triumphs wearing a borrowed value layer.

**The discovery lineage — your actual ancestors.** AM (1976): open-ended concept formation under hand-coded interestingness; rediscovered primes, conjectured Goldbach, died of value drift and representation exhaustion. HR and Graffiti: explicit interestingness measures and conjecture generation good enough to produce publishable graph theory. Modern descendants: DreamCoder (compression-driven library growth), Voyager (a growing skill library as abstractions in an open world), FunSearch and AlphaEvolve (evolutionary program search that produced genuinely new constructions for open problems — cap sets, matrix multiplication — and here is your "weird but valid" clause cashed out: the discovered programs are alien, and nobody minds, because they verify). And Minimo, closest of all, as described above — essentially a small-scale existence proof of your architecture that nobody has scaled. Relative to the benchmark-chasing line, this direction is strikingly underpopulated.

**Foundations, for your category-theory and all-worlds instincts.** Structuralism — Benacerraf's "What Numbers Could Not Be" — says mathematical objects are nothing but positions in structures, the philosophical form of "work up to isomorphism." Universal properties hand you something operational: a _checkable criterion for a good definition_ (characterized by a universal property ≈ canonical, maximally general — the formal version of your "most general form of each statement"). Univalence in homotopy type theory turns Poincaré's quote into an axiom: equivalent structures are identical, and transport along equivalences is primitive — prove once, hold everywhere. And here is my one real pushback on your notes: you write that mathematics should be tied neither to axioms _nor to rules of logic_. Axioms, yes, fully — the conditional-theorem move above handles it. But with no fixed logical point at all there is no checker, and without a checker you get AM's drift with extra steps. The resolution isn't "no logic"; it's pushing the fixed point down as far as it will go — the smallest meta-logic in which logics themselves are objects (LF, Isabelle/Pure, Dedukti, institutions).

**Symmetry.** The machinery exists at every scale: symmetry-breaking predicates in SAT/CSP (Crawford et al.), canonical forms (nauty), e-graphs and equality saturation collapsing equal terms into single nodes, WLOG as a formal tactic (Harrison, 2009), quotient types, transport in HoTT. But the deeper point is that your symmetry intuition and your compression intuition are the _same_ intuition: a symmetry is precisely a compression opportunity — state the orbit once, prove one representative, transport to the rest. Under an MDL objective you don't need a separate symmetry drive; recognizing a symmetry is among the highest-yield compressions available, so it falls out. (It even predicts the order of discovery: cheap-to-state, frequently-used symmetries first — which roughly matches how human mathematics acquired its dualities.)

**Representation.** Separate content from presentation. Content: proof terms over de Bruijn-style syntax, content-addressed — the hash of a normal form as identity, as Unison does for code — plausibly stored in an e-graph so the store itself collapses known equalities. Serialization: this is what Dedukti exists for. Display: notation is a codec, not substance — a learned rendering where good notation means short codes for frequent idioms, i.e., Huffman coding over your own corpus, i.e., compression yet again. And the AM warning applies at full force here: representation is a prior, arguably the largest one in the whole system, so it must be revisable inside the game rather than frozen outside it.

### The assembled definition

**The game:** over a fixed minimal checker, a growing library of conditional theorems spanning many substrates, with five move types — prove, conjecture, define/refactor, translate, extend — optionally split into conjecturer and prover roles playing against each other's frontier.

**Improvement:** reach on an anchored distribution per unit compute, plus reduction in the description length of library-and-proofs (abstractions admitted iff they pay for themselves), plus transfer to held-out worlds, with frontier motion as the running diagnostic.

Where I'd amend your notes: replace "no biases" with "no _frozen_ biases" — no-free-lunch makes the former incoherent, since the substrate, the description language, and the anchor corpus are all bias; the achievable goal is bias that is explicit, minimal, and editable by the system itself. Replace "not tied to rules of logic" with "tied only to a meta-logic small enough to hold all the logics." And consider keeping the human corpus not as a constraint but as an _anchor_: it is a few millennia of pre-paid compression, and a system that discards it must buy all of it back.

You asked what mathematics is. The honest answer this design gives is deflationary but, I think, exactly what you need: mathematics-as-implemented is _whatever survives the checker, weighted by whatever survives the compressor_. The philosophical question doesn't get answered — it gets turned into an explicit, criticizable, tunable object. Which is more than human mathematics ever had.
```

### Conclusion

I then asked Claude to write a summary with the following prompt:

> In an ironic fashion. How would we reduce the core insights we may derive from this conversation to form a conclusion? The question was, "how would we tackle automated theorem proving". Provide me with a bulleted list of core ideas in proper order (such that each idea follows logically upon the other ideas) that shall form the conclusion.

Claude responded with:
```markdown
Fittingly, the conclusion should be subjected to its own criterion: admitted only if it pays for itself. Here is the chain:

- **Refuse the essence question; build an interface.** "What is mathematics?" is unanswerable as metaphysics but tractable as engineering: specify only what the system must _check_ and what it must _maximize_.
    
- **The interface splits into two layers of opposite character.** A validity layer that is fixed, tiny, and sound; a value layer that is learned, negotiable, and growing. Historically, nearly every success (ATP, Lean, AlphaProof) lives in the first layer, and nearly every failure (AM's drift) was a failure of the second.
    
- **Validity: one minimal checker, all facts stored as conditionals (Γ ⊢_S s).** Axioms thereby become coordinates rather than commitments, and "functioning across all mathematical worlds" stops being a philosophy and becomes a database schema — worlds plus checkable translations between them.
    
- **A sound checker makes the proof channel unhackable.** This is the precise cash value of "reward hacking works in our favor," and it is why mathematics is uniquely suited to RL among all domains: weird-but-valid is acceptable by construction.
    
- **Incompleteness forces open-endedness.** No fixed game exhausts mathematics (Gödel), so the agent must own game-changing moves — define/refactor, translate, extend — alongside prove and conjecture. Open-ended discovery is not a design preference; it is imposed by theorem.
    
- **Those moves detonate the action space; compression is the tamer.** Score the library by total description length of definitions plus proofs, and admit an abstraction iff it strictly reduces the total. "Widely applicable yet non-redundant" becomes an accounting identity rather than a slogan.
    
- **Compression is load-bearing, not cosmetic.** Cut elimination shows that removing lemma-use blows proofs up non-elementarily, so good abstractions change the complexity class of search itself — the building-blocks intuition is literally a theorem.
    
- **One objective then unifies the scattered intuitions.** Generalization is anti-unification that pays; symmetry is orbit-collapse that pays (prove one representative, transport the rest); notation is Huffman coding over your own corpus; interestingness is compression _progress_. No separate modules needed.
    
- **But value remains Goodhart-bait, so no single metric may rule.** Combine reach (anchored task distribution per unit compute), compression (of an anchored corpus), and transfer (held-out worlds), with frontier motion from conjecturer–prover self-play as the running diagnostic.
    
- **Zero bias is incoherent; editable bias is the target.** No-free-lunch makes "no biases" impossible — substrate, language, and corpus all are bias — so the achievable goal is bias that is explicit, minimal, and revisable, which forces the representation itself inside the game as a refactorable object (the AM lesson).
    
- **The human corpus enters as an anchor, not a constraint.** It is millennia of pre-paid compression: the system may refactor it freely but should not be made to repurchase it, and it simultaneously guards against both navel-gazing and mere imitation.
    
- **Therefore: the answer to "what is mathematics" is deflationary and executable.** Build the five-move game over a minimal checker, scored by reach + compression + transfer; mathematics-as-implemented is whatever survives the checker, weighted by whatever survives the compressor. The definitional question is never answered — it is turned into a tunable, criticizable object, which is more than human mathematics ever had.
    

Twelve bullets from several thousand words: a compression ratio the system itself would be asked to justify.
```

### Next Steps

To tackle this problem further, I would probably need to add more and better examples for each of these specific details. Work out the ideas, and including better references to existing approaches, and where they worked and didn't. It would also be nice to think about proper benchmarks to evaluate progress. Of course, we can ask it to prove existing theorems, or more interestingly, we can ask it to prove a statement where we would normally apply the existing theorem, and see if it discovers that theorem on its own.

