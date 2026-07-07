The following are some notes on my thought process behind choosing a master thesis.

### Background

I started my university studies with a bachelor in Computer Science and Engineering at Delft University of Technology. 

However, during my third year I started having doubts about my direction:
1. with the rise of AI, too many junior software engineers, and a shitty economy, I started to doubt that there was enough demand for computer scientists when I would start working full-time, specifically juniors.
2. I also noticed my relationship with programming was sometimes quite obsessive. I had significant trouble with letting go of the things I was working on, even when I realized I didn't have the time, it didn't bring me joy anymore, or that whatever I was trying wasn't going to work. 
These doubts combined made me quite anxious about the future. 

To not put my eggs in one basket, I decided to spread out. I did my bachelors thesis on applying Reinforcement Learning to Algorithmic Trading, which I really liked (reference: https://repository.tudelft.nl/record/uuid:82e0d46c-a1f4-46c9-aaa6-fbdcd8a81012). I then planned on doing a master in Econometrics and Management Science at Erasmus School of Economics which would start with a pre-master. However, I heard from a friend (Finn van Oosterhout) that it was possible to enroll for two masters instead of one at no additional cost. Since I already had a hard time deciding, I enrolled for both Data Science and Artificial Intelligence Technology (DSAIT) at the TUDelft and the pre-master in Econometrics at Erasmus School of Economics. Finn did the same.

During this first year I pursued both masters with the idea that I would drop either one when I determined whichever I found more interesting. However, now nearing the end of the last quarter/block of the first year, I have just followed both in their entirety (getting a lot of exemptions for the pre-master in Rotterdam, and resitting a couple courses during the summer). I have learnt a lot, in content, as well as about my interests.

This year of essentially following a double master has been intense but will no longer be feasible during my thesis year. Therefore, the plan is now is to finish my master in Delft, and follow it with a single year master in Analytics and Operations Research In Logistics in Rotterdam.

### My Interests and Current Perspective

I have come to view mathematics as the field of starting with assumptions, and applying the rules of logic to derive or show certain conclusions. Since these assumptions are largely arbitrary, there exist infinitely many "mathematical words". Generally, in university we only study existing mathematical worlds that have been discovered, and are deemed "useful". We are tested on whether we understand it, and can apply it. Although I thought some of the formulas were really cool, this caused a lot of mathematics to feel the same to me. It feels more like studying art, rather than creating it yourself. The raw skill of a mathematician is taught relatively little: this is the idea of being able to show or derive more complex properties yourself. This is understandable since most of the mathematics used in practice is already discovered, and discovering or showing novel, and useful properties is becoming increasingly difficult. Furthermore, pure mathematics seems like an avenue that can be increasingly automated. Consequently, pursuing the raw skill of mathematics seems high effort, low reward. It is in the intelligent application of existing mathematics, where most of the value seems to be found.

Another perspective I have become interested in is the importance of intelligent abstraction. The idea of solving a problem once, and re-using it many times, combined with the idea that these interfaces work both ways. You can build something relying upon an interface, or you can build something implementing an interface. In both cases, you are abstracting away the details of that which relates to it. This concept of abstraction seems to exist in both mathematics and software development. The core idea then becomes how to build the most intelligent abstractions. Those that can be applied broadly, but are not applied so broadly that you lose relevant details to solve a problem (efficiently). This feels related to Poincare's quote that "Mathematics is the art of giving the same name to different things".

Another clear pattern I have become interested in is the idea of the model and solve paradigm. That is:
1. you have some problem you want to solve. 
2. you think about how to describe it formally. 
3. you apply standardized algorithms or mathematics to solve the formalized problem.
4. you convert the solution back in terms of the original problem

I see this as closely related to the idea of finding the best abstractions. Model your problem incorrectly (by excessive reduction), and the solution will not be valid, model it too exactly and your solution will be impossible to find (assuming your problem is difficult). We then have the same two sides of abstraction again. For the modeler the question becomes how to formalize the problem in a way that the solution remains valid, yet possible to find. For the solver the question becomes where to draw the line on the allowed models, allow any model and the solver becomes too complex, and allow only really simple models and the solver cannot be applied in any practical sense.

Then with the advent of Large Language Models, it seems like we already have a strong candidate for the problem of *defining* models. Large Language Models seem extraordinarily good at two things: understanding language (reading and writing natural language), aswell as storing and being able to directly apply a lot of the knowledge gathered by humans over time. This makes them prime candidates for understanding the real-world problems humans may face, aswell as being easy for humans to interact with, contrary to the extremely literal nature of the computers generally. What large language models are NOT good at however is properly applying the rules of logic, or doing calculations efficiently, this is where you want to lean in to the computer's specialty of dumb calculations.

Consequently, the part that remains is the "solving" in model+solve. This is the idea of understanding how to properly use, and analyze existing solvers, aswell as working on improving these solvers specifically. 

This is where it seems most of my interest lies. 

Specifically, in designing algorithms for solving the problems that:
1. cannot be solved directly: in the case of problems like image recognition, where it is too difficult how to explain how to solve the problem, so instead you explain how to learn how to solve the problem (i.e. you use machine learning).
2. cannot be solved efficiently: in the case of problems like constraint solvers, where you can define relatively easily how to solve the problem, but doing so efficiently is prone to take an enormous amount of time to do with any computer. Most interesting are the problems where combinations of mathematical insight, and intelligent compromises lead to a significant amount of performance improvement. 

With exception of problems where the solution is to just get more data and throw a larger model at it.

### Favourite Courses

Here is a list of courses I found interesting from the TUDelft:
- Basically all the mathematics courses
- Algorithms and Data Structures
- Algorithm Design
- Automata, Computability and Complexity
- Functional Programming
- Machine Learning
- Algorithms for NP-Hard problems
- Probabilistic AI and Reasoning
- Modeling and Problem Solving
- Constraint Solving
- Evolutionary Algorithms

My favorite courses from Erasmus were the mathematics courses, but also Simulation. Simulation was really about model + solve aswell, or more specifically about how to sample from difficult distributions, estimate parameters that cannot be determined analytically, and interpreting the validity of the results.

What seems to be the theme in my interests? Its just the most exact parts of computer science. Using advanced algorithms and mathematics to make intelligent decisions.

### Noteworthy Projects

The following are some projects I did outside university or work (which is all proprietary) that I would like to also share.

During my bachelor thesis I tried computing the optimal trading strategy (assuming perfect lookahead) using dynamic programming, to use this to define the objective for the model. The optimal trading strategy computation went well, but the trading went poorly due to a lack of informative features. I wrote more info here: [[DP-Optimal Trading]].

To keep in touch with an old friend we regularly played Wordle. At some point I decided to try and determine the optimal strategy. It turned out this was quite difficult due to the massive search space. I ended up applying branch and bound search, dynamic programming, concepts from information theory, and the relationship between POMDP's and MPD's. I wrote more info here: [[Wordle]].

The third project is this site. Previously, most of the things I studied felt very loosely related, however this academic year I really noticed the puzzle pieces started falling together. To capture the things I have learnt, inside and outside of university, I started making and organizing notes in obsidian, and upload them here. More info here [[site/index|index]]. 