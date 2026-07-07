
To me, automated theorem proving seems like a really fascinating problem. And determining how to tackle the problem is almost philosophical. The following is a collection of ideas, concepts and questions I believe would be relevant for tackling the problem.

I notice two core questions: what is mathematics? and how would you define mathematical progress?

My first argument, is that in order to have a good theorem prover, you must have a system that is capable of some kind of open-ended discovery. Sure, you can have solver that can repeatedly apply existing rules in a direct attempt to solve the problem at hand, but in many cases showing something directly is significantly more difficult than showing something else first, and using these results to solve the primary problem. This idea of needing to find useful building blocks, is the core of what I believe is important.

Furthermore, I notice that the field of mathematics is historically biased for concepts that are more natural to humans. For example, a preference for real numbers over complex numbers, and Euclidean geometry over other systems of geometry. This is of course useful, because it is significantly easier to make progress in a domain that feels natural since we can use out intuition, but "unnatural" systems have been shown to be incredible important aswell. Intuitively, I believe our system should not inherit these biases, or have any biases of its own, and instead be capable of functioning across all mathematical worlds. We essentially want the reward hacking behaviour of the agent to work in our favor. The solution may be weird, and unnatural, but as long as the proof it generates is valid, we are satisfied.

Next, I argue that in order to do this efficiently the system must be free to make many, extremely fundamental decisions, and not be constrained by a specific mathematical framework. They should be able to create new definitions and theorems, and approach the problem from an entirely different perspective and problems and solutions between these perspectives. Of course, this comes with the problem of a horribly large action space, so at the same time, the fundamental system should be powerful. 



Instead, we analyze the behaviour of these agents in mathematical situations where they may build things from the ground up. 

Next, I argue that in order to do this efficiently


 Ideally, we have a system that is capable of 

attempt 1:
- alphabet: what symbols exist?
- grammar: how may these symbols be combined to create a statement that is valid?
- rules of inference: 
- 




