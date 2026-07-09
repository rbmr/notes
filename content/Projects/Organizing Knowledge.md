Why is organizing knowledge so difficult?

### Introduction

I believe the difficulty in organizing knowledge comes down to discrepancy between how we store knowledge, versus how we consume it. Specifically, **knowledge itself is associative, but we consume it linearly**.

When we read an article or a book, we generally read it from top to bottom, in the order decided upon by the author. Frequently, this information is further organized through nested categorization. This suggests some strict hierarchy. In some cases, this works perfectly well, for example a manual, or a story which are both examples influenced by chronology. But things break apart when the connections between parts of the content become more complex.

My favorite example for this conflict is in the difference between books on Systemic Anatomy versus Regional Anatomy. Systemic Anatomy organizes anatomy by biological function first, and region (physical proximity) second. Regional anatomy organizes our knowledge by physical proximity first, and biological function second.  This shows two books containing largely the same knowledge can be drastically different based solely on the organization of knowledge within. Both approaches are equally valid, it just depends where the author wants the emphasis to lie. 

### Formalization

Lets attempt to generalize this issue. Most fundamentally we are looking for the ideal path to traverse the graph of knowledge on a specific subject. 

1. Suppose we start with the entire domain of knowledge. First we need to decide what is and what is not relevant for the piece of content we are trying to write. This issue is largely resolved using a strong definition of the goal you are trying to accomplish. If it doesn't suit the goal, we dont include it.
2. Next, assuming we want some form of categorization, we run into the issue of division. Any subject can only be in one section at once. We want related subjects to be close together (high cohesion), whereas unrelated subjects may be further apart (loose coupling). You can view this as removing edges in the graph of knowledge such that we lose some minimal amount of connectedness. 
3. Finally, we tackle the question of ordering. Ideally knowledge should follow a topological ordering, meaning no idea is explained without having first explained the other ideas it relies upon. This is difficult as associative knowledge frequently contains cycles. In such cases the author needs to break these cycles such that there is some place to start. On top of this, this topological ordering is also likely to conflict with categorization, requiring the author to find a balance between the two.

### Preserving the Graph

We made the critical assumption that the linear order of content always must be decided, or that those who read it must strictly adhere to it. This is of course not true. Rather, one may visualize it as a spectrum. On the one side we have a strictly determined ordering of all content within a source, where everything is intended to be read from top to bottom. On the other side, one may defer this decision, preserving the graph-like structure, and allowing a reader to navigate it themselves. 

An example of resources that fall on the latter end of the scale are encyclopedias, including Wikipedia. We make some larger collection of smaller entries and leave them unordered (or ordered by something other than content, such as alphabetically for faster lookup). Each entry then contains references to other entries. If the user needs more context on these related entries they look them up.

**Hypertext Theory** became the digital version of this approach. In this framework, knowledge is broken down into **nodes** (individual units of information) and **edges** (the relationships between these pieces of information). Readers then traverse these edges based on the information they deem most relevant.

However, this freedom introduces a new cognitive burden: **The Navigation Problem**. Without an author-defined linear path, the reader must constantly decide which edge to follow, often leading to "cognitive overhead" or the feeling of losing oversight. 

One way to improve upon this is using **progressive disclosure**, an interaction design pattern where an explanation of details is deferred until it is requested. In the context of the navigation problem it is implemented as a hover effect. Here, hovering over a link shows a small window with the first paragraph of the referenced article. This allows the writer to preserve the single source of truth yet limits navigational overhead since the reader doesn't need to leave the page. 

Consequently, the solution lies somewhere in between having some canonical path, and an immense graph of atomic nodes.

### Uniqueness

Instead of expecting the reader to click a link, or scroll back/forward a few chapters in order to understand some details they have forgotten or have never learnt, you could also repeat the details that are most essential to the topic at hand. However, this introduces the issue of duplicate information. 

This raises the following tradeoff: do we want knowledge to be unique across the collection of information, or do we allow some duplicate information such that people can read a section or node as a largely standalone item? For every transition from the former to the latter, you are essentially substituting a reference to an article by a simplification of its content, and maybe its nested references.

### Views

The most intuitive approach to deal with all of these trade-offs is to separate the storage from the presentation. The knowledge is stored as a graph, containing nearly no duplication, and the presentation consists of **views** upon this knowledge. For example:

1. We can see a large language model (LLM) as one of the more dynamic ways to generate such a view, with the knowledge base in this case being the internet. They come with two immediate issues: First, LLMs are probabilistic, and consequently make mistakes (hallucinates, misinterprets sources, etc), and second, the knowledge base is the whole internet (including *Reddit*) instead of some highly verified and controlled source of truth. 
2. Another arguably simpler way is using **tags**. Tags, have the property of being many to many, whereas categories are 1 to many. This way we can group content based on any dimension we see fit. To get back to our example of anatomy, we can group an article on the heart based on the region (say the thoracic cavity), *and* the system (the cardiovascular system), allowing us to dynamically switch between the two.
3. Instead of generating views on demand one could curate them aswell. An example of this are the many [Wikipedia articles containing lists](https://en.wikipedia.org/wiki/Wikipedia:Contents/Lists): such as lists of important people with a specific name, or incidents in a specific field, or a events in a given year.
