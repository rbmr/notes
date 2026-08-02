### 1. A Brief History of The Computer

#### Human Computers

Historically, a "computer" wasn't a machine, it was a job title. It referred to people (often women) who performed complex mathematical calculations by hand.

While effective, this manual approach had inherent limitations. Humans are slow, prone to fatigue, and inconsistent. As the demand for complex calculation grew, it outpaced the reliability and speed of human processing.

#### Boolean Algebra

Formal logic and mathematics, exist independently of humans. Mathematical truths like $1+1=2$ are consistent, regardless of the agent processing them. The goal became to transfer this execution from biological systems to mechanical ones.

Humans naturally favor Base-10 (decimal) systems, likely due to having ten fingers. However, in the 17th and 19th centuries, mathematicians Gottfried Wilhelm Leibniz and George Boole demonstrated that Base-10 is arbitrary.

Boole developed **Boolean Algebra**, a system proving that complex logic could be fully represented using only two states (Base-2, also known as Binary), and three fundamental operators: AND, OR, and NOT. But at the time, this was pure theory, a mathematical curiosity with no physical application.

#### Mechanical Computers

The transition from theory to reality occurred in 1937, when Claude Shannon realized that electrical circuits could physically embody Boolean logic.
- Boolean Logic: True / False
- Electrical Circuit: Closed (Flowing Current) / Open (No current)

This insight led to the adoption of Binary for machine computing. Binary was chosen over decimal not for simplicity, but for reliability. In an electrical system, distinguishing between ten different voltage levels (0-9) is prone to error due to signal noise. Distinguishing between "On" and "Off" is robust and precise.

#### Origin of Programming

Early electronic computers were powerful but rigid. They were "fixed-program" machines, meaning the logic was hard-wired into the circuitry. Changing a calculation required physically rewiring the machine.

The pivotal evolution was the move to the **Stored-Program Architecture** (often associated with John von Neumann). Here, the memory stores both the data to be processed and the instructions (algorithms) on how to process it. The processor then fetches from memory and executes them.

This separation establishes the fundamental dichotomy of the field:
- **Hardware:** The physical machinery (circuits, transistors, memory). It is governed by the laws of physics and provides the raw capability to compute.
- **Software:** The non-physical instructions and algorithms. It is governed by the laws of logic. It directs the hardware on which switches to flip and in what order.

Software Engineering became the discipline of defining these logical instructions.

### 2. Software Engineering is Recursive 

#### Abstractions all the way down.

The field of software engineering faces an immediate problem of scale. A modern processor contains billions of transistors. Manually managing these individual states to create a complex program is practically impossible.

To manage this complexity, software engineering employs a recursive algorithm of **Decomposition** and **Abstraction**.

The process begins with a high-level intent. We view this intent as the root problem to be solved. If the problem is too complex to solve directly, we decompose it into smaller sub-problems. We repeat this decomposition until we reach a sub-problem that can be solved directly. 

As we solve each sub-problem, we encapsulate the solution through abstraction. We separate the **What** (the Interface) from the **How** (the Implementation). The user interacts with the interface and receives a result, ignorant to the internal complexity. 

#### The Abstraction Trade-off

This encapsulation demands a fundamental trade-off: for every layer of simplicity we gain, we sacrifice granular control. By constraining the interface, we voluntarily surrender the freedom to manipulate the precise details of the underlying implementation.

These abstractions are necessary due to human cognitive limitations. Psychological research, specifically **Miller’s Law**, suggests that human working memory is limited to holding approximately $7 \pm 2$ items at a time. Abstracting away the implementation, frees mental resources for higher-level logic.

#### Dependency Graphs

This recursive layering of abstractions can be visualized using a **Dependency Graph**. In this model, every component (a programming language, a module, class, or function) is represented as a **node**. Each node consists of an internal implementation hidden behind a public interface. We then use **edges** to represent the reliance of one component upon another.

In a well-designed system, this graph typically takes the form of a **Directed Acyclic Graph (DAG)**. "Directed" means the dependencies flow in one direction at a time. "Acyclic" means there are no loops. Component A cannot depend on Component B if Component B eventually depends back on Component A. Without this acyclic property, the recursion breaks, leading to "circular dependencies" that make the system impossible to test, reason about, or decompose.

#### Law of Leaky Abstractions

The recursive model of decomposition and abstraction rests on the idealized assumption that the abstraction is perfect. That once a sub-problem is solved, the person using the solution never needs to look inside. 

In practice, this ideal is impossible to maintain. This phenomenon is known as the **Law of Leaky Abstractions** (coined by Joel Spolsky), which states: "All non-trivial abstractions, to some degree, are leaky." When an abstraction fails, due to bugs or inefficiency, the encapsulation breaks, forcing the engineer to descend into the low-level implementation they intended to ignore.

This leads to a paradoxical truth in Software Engineering: To competently use a high-level tool, you must implicitly understand the low-level complexity it attempts to hide.

### 3. Programming Languages

#### The Semantic Gap

The most fundamental abstraction becomes the **Programming Language**, responsible for translating human intent into machine execution.

This translation highlights a fundamental friction (Semantic Gap): 
- **Human communication is high-context and ambiguous.** We rely on nuance, shared cultural assumptions, and inference. 
- **Machine execution is low-context and absolute.** The machine has no intuition. It does not know why it is computing, it only knows what it has been instructed to do.

From this perspective, Software Engineering becomes the discipline of collapsing human ambiguity into machine precision.

#### Levels of Languages

To bridge this gap, languages are organized by their proximity to the hardware. **Low-level languages** (like Assembly) offer granular control over memory and processor cycles but require verbose, explicit instructions. **High-level languages** prioritize human readability and conceptual density, sacrificing raw execution speed and fine-grained control.

#### Bugs are Human Error

This creates the concept of the **"Bug."** Generally, a bug is often viewed as a mechanical failure, but in software a bug is rarely a mechanical error. The machine almost always executes the code exactly as written. Instead, a bug is a translation error. It is a consequence of the difference between the mental model of the engineer (the Intent) and the actual logic written.

### 4. Modules and Encapsulation

#### Functions and Modules

The most granular unit of abstraction is the **function**. A mathematical ideal brought into engineering: an input goes in, a transformation occurs, and an output emerges. By naming a function, we name a behavior, allowing us to reference the "What" without the "How."

When we group related functions and structures together, we create a **Module**. This is the physical manifestation of encapsulation. It creates a perimeter that protects the internal logic from the outside world, exposing only what is strictly necessary.

#### Cohesion and Coupling

The quality of a module is measured by two opposing forces: Cohesion and Coupling.
- **Cohesion** refers to how closely related the responsibilities inside a single module are. High cohesion is the goal, it implies that a module does "one thing" and does it well.
- **Coupling** refers to the degree of interdependence between modules. High coupling means that changing one module requires changing three others. We want Loose Coupling: to ensure that modules are as independent as possible, connected only by thin, well-defined interfaces.

Consequently, the ideal system should be composed of highly cohesive modules that are loosely coupled to one another.

#### Solve once, use many.

The **DRY (Don’t Repeat Yourself)** principle asserts that every piece of knowledge within a system must have a single, unambiguous representation. This establishes a **Single Source of Truth**, ensuring that any logical change only needs to be made in one place. Beyond simplifying maintenance, DRY encourages reusability, consequently focusing engineering effort on the quality and reliability of a single solution rather than many different implementations of the same thing.

**Standardization** extends the principles of encapsulation and interfaces beyond the boundaries of a single program to the entire industry. By adhering to universal protocols and formats, such as **HTTP** for communication, **JSON** for data exchange, or **ISO/IEEE** standards, engineers create a predictable contract between disparate systems. These standards ensure that a module developed by one organization can reliably interact with a module developed by another, regardless of their internal languages or architectures, and without the need for custom translation logic.

### 5. Evolution of Software

#### Managing Change

A primary distinction between software engineering and other engineering disciplines is the ease with which the product can be modified. Software is rarely static, it is updated frequently to address new requirements, hardware changes, or security concerns. However, constant modification introduces complexity. Without proper management, systems can become difficult to maintain.

#### Technical Debt

A significant portion of software engineering is not to write new code, but to read and modify existing code. Therefore software must be designed not just to work once, but to be modifiable.

When developing software, engineers often face a choice between the most robust solution (long-term) and the fastest one (short-term). Choosing the latter creates **Technical Debt** (coined by Ward Cunningham). The "interest" on this debt is the extra time required to work with that messy code in the future. 

**Refactoring** is the process of restructuring existing code, without changing its external behaviour. This allows developer to improve readability, reduce complexity, and ensure the system remains malleable.

#### Version Control

**Version control systems (VCS)** are software tools that track, manage, and record changes to source code over time, enabling multiple developers to collaborate, compare, and revert files to previous states. The industry standard is **Git**.

Git records the project's history through **Commits**, which are snapshots of the codebase at specific points in time. This allows engineers to review history or revert the system to a previous state if necessary.

To facilitate collaboration, Git uses **Branching** and **Merging**:
- **Branching** allows a developer to work on a specific feature or fix in isolation from the main codebase.
- **Merging** is the process of integrating that work back into the main project.

This workflow enables multiple developers to work on the same system simultaneously with minimal conflict.

### 6. Managing Dependencies

#### The Software Supply Chain

Modern software is rarely written from scratch. Instead, it is built upon a recursive stack of third-party libraries, tools and packages. This network of dependencies is also known as the **Software Supply Chain**. 

While this reuse accelerates development, it introduces a significant **risk vector**. Because a single application may transitively depend on thousands of external modules, a security vulnerability or malicious injection in one obscure library can compromise the entire system. This necessitates a shift in perspective: the engineer is no longer just a creator of logic, but a curator of a complex, evolving web of external trust.

#### Versioning

To manage this supply chain, systems require a rigorous approach to **Versioning**. Without it, a minor update in a third-party component could introduce "breaking changes" that compromise the integrity of the entire system, a phenomenon often referred to as **Dependency Hell**.

To communicate the nature of changes between versions, the industry has standardized on **Semantic Versioning (SemVer)**. Version numbers are expressed in a three-part format: `MAJOR.MINOR.PATCH`.

- **MAJOR:** Incremented when making incompatible API changes.
- **MINOR:** Incremented when adding functionality in a backward-compatible manner.
- **PATCH:** Incremented when making backward-compatible bug fixes.

By adhering to this contract, an engineer can safely automate updates for patches and minor features while being alerted to major changes that require manual intervention and testing.

The move toward automation extends to how developers document their work. **Conventional Commits** is a specification for adding human and machine-readable meaning to commit messages. By following a structured format, such as `type(scope): description`, teams can use tools to automatically determine the next version number and generate comprehensive changelogs. For example, a commit starting with `feat:` signals a MINOR version bump, while `fix:` signals a PATCH.

#### Dependency Management

To ensure a system is reproducible across different machines, engineers use **Dependency Management** tools. These tools rely on two critical files:

- **The Manifest:** This file lists the high-level requirements of the project. It defines what the project needs and usually specifies version ranges. It is optimized for human readability and flexibility.
- **The Lock File:** Because version ranges in a manifest can resolve to different actual versions over time, the Lock File provides an absolute snapshot. It records the exact version and cryptographic hash of every library and transitive dependency in the tree.

By committing the Lock File to version control, engineers ensure **Deterministic Installs**. This aims to guarantee that "it works on my machine" translates to "it works on every machine," as every environment will resolve the dependency graph to the exact same bits.

#### Containerization

Despite lock files, dependency management is often imperfect. A program depends not only on its libraries but also on the underlying **Environment**: the operating system kernel, system-level C libraries, and specific hardware configurations. 

To solve this, software engineering introduced **Containerization** (most notably through **Docker**). If a function encapsulates logic, and a module encapsulates related functions, a **Container** encapsulates the entire operating environment.

By "packaging" the environment itself, engineers move from **Deterministic Installs** to **Deterministic Execution**. The container acts as a standardized box, as long as the host machine can run the container engine, the code inside will behave exactly the same way, regardless of the underlying hardware. 

### Other Concepts

TODO: I still want to discuss the following concepts. I would probably go through each of these concepts, and determine where in the article they would fit best, either in an existing section, or in a section to be written.
- Development, Operations, and DevOps.
- Automated Testing Pyramid.
- Continuous Integration / Continuous Development (CI/CD)
- Monitoring and Observability
- Platform Engineering
- Application programming interface (API)
- rest vs graphql vs gRPC (RPC)
- Cloud computing:
	- How a data center is built and scaled, from the individual machines, to racks, to clusters, to data centers, to regions, to the cloud as a whole.
	- Degrees of control
		- Self-Hosting, 
		- Directly access machines in the cloud, 
		- virtual machines (multiple machines in a single machine, consequently the "machine" is independent of the actual machine and can therefore be scaled)
		- serverlessness (only provide code, completely forget the machine)
	- Scalability (Horizontal, Vertical, Autoscaling)
	- Execution Life-cycles (Always-on, Long-running, Short-running)
	- Execution Triggers (Manual, Schedule (Cron), Webhooks/API (Request-Response), Event-driven, Continuous)
	- Infrastructure as Code (IaC)
	- Container Orchestration
	- Availability: how likely is an outage to lead to unavailability?
	- Durability: how likely are we to lose data?
	- Virtual Networks
- Security
	- authentication vs authorization
	- 
- Storage:
	- unorganized, large files, 
	- organized, databases (relational vs nosql)
	- caches
- Software in business:
	- Price is determined by supply and demand.
	- Supply is influenced by difficulty.
	- Difficulty may be divided into (1) how hard the solution is to find, and (2) how hard the solution is to apply.  
	- Uniqueness of software in being essentially free to copy and distribute (extremely easy to apply), just creating the first is one is difficult (hard to find).
	- Introduce open-source vs closed-source, explain the trade-off.
	- Include mental model of the world not being zero sum, and innovation contributes to creating a bigger cake.

- Explain the following feeling aswell:
<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/LvW1HTSLPEk?si=kiN2k4rnEsQPA6F8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>