---
tags:
  - projects
---

I'd been noticing two things about LLMs for a while, and only recently started to see how they connect.

The first is that LLMs get remarkably effective once you pair them with some rigid form of verification, or more generally, once the burden of proof is on their side. That can mean running the code they wrote to see whether it does what it should and passes the tests. It can also mean asking for a Lean proof, or some other certificate that's (relatively) easy to check.

The second is one of the bigger risks of using them. LLMs produce output that looks really good at first glance, and they produce a lot of it. That combination is a big part of why so many people who review PRs are overwhelmed right now, or starting to review less thoroughly.

The first idea turns out to be a pretty good answer to the second. You don't try to understand everything the model wrote. You think of a few ways to test it instead. You can even give the model those tests up front and let it deliver the proof you need to determine everything is correct.

### Example

State-of-the-art [[Constraint Solving|constraint solvers]] ran into the same problem. They keep getting more complex and harder to verify, so people stopped trusting the solver directly. They ask it to also output a proof or certificate for its answer. Checking that certificate is much simpler than checking the solver. So the checker is what gets studied rigorously, and in some cases formally verified. The solver is then free to be as clever as it wants, since we know (when) we can trust the output.

### How Do You Design the Tests?

Okay sure, but designing these tests is a question of its own, and not guaranteed to be easier than just implementing it directly. Furthermore, testing can show the presence of bugs, but not their absence (Dijkstra). Any test of the form "does this input produce the output I expect" can miss things.

A checker is already a lot stronger, since it validates every output instead of a handful of samples. But it has costs. Firstly, the checker and the proof generation are extra logic you have to maintain, but more importantly, running a checker on every result can hurt performance a lot. It's also a bit strange when you think about it. An algorithm is either correct or it isn't, so checking every result after the fact is a lot of redundant work. It's like shipping the test suite inside the product and having it inspect each output as it is given.

What you actually want is to show that the program always computes what you expect (assuming your hardware isn't malfunctioning). "What you expect" should be defined rigorously, but in a way a person can still understand. That's formal verification. The main reason it isn't done more often is that writing these proofs is extremely tedious, especially for code that already seems trivially correct. But tedium matters a lot less when an AI is doing the actual implementing.

### Review the Spec, Not the Implementation

So I think the reviewer's job shifts. The main thing to review becomes the specification. You trust that the implementation sticks to it because there's a proof that says so.

This won't fit everywhere. For frontends or CRUD APIs, the spec would be about as complex as the code, and performance usually isn't the bottleneck, its the formal spec itself. There I think we keep using the high-level languages and frameworks we have today. Python and modern web frameworks already sit close to the limit of what's both human-readable and exactly specified, so the code more or less is the spec.

A side thought: once we no longer need to read the implementation, because we trust that it matches the spec, I expect implementations to become practically alien. They'll also be a lot faster than anything humans have written. Performance-critical code has always paid a readability tax, and that tax would go away. Programming languages currently trade control against ease of use along a Pareto frontier. If you only ever read the spec, that trade-off mostly disappears and you get both.

### Are LLMs the Right Tool for This?

The obvious next question is whether current AIs are even well suited to this. I don't think they are. LLMs are just the first machines that can reason flexibly enough to do mathematics and write proofs a computer can check rigorously. They already beat most humans at it, maybe all of us, but I still think they're far from the best possible design for the job.

(TODO: maybe add something about deriving this spec, and how its difficult on its own since humans are generally incapable of exactly specifying what they want. Its the reward hacking, "be careful what you wish for", etc. And the main things that seems to work well in practice: agile and ci/cd)