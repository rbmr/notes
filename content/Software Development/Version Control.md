Software tends to evolves over time, the question remains, how will we manage it while it does?

### Version Control Systems

Core definitions from [wikipedia](https://en.wikipedia.org/wiki/Version_control):

- **Version control** is the software engineering practice of controlling, organizing, and tracking different versions in history of computer files - primarily source code text files, but generally any type of file.
- A **version control system** (**VCS**) is a software tool that automates version control.

We will focus on **Git** the VCS released by Linus Torvalds in 2005, [of which the name has no clear meaning](https://github.com/git/git/blob/e83c5163316f89bfbde7d9ab23ca2e25604af290/README).

### Basic Git Guide

TODO: write basic Git Guide: repository, commits, branches, merging, and rebasing. 

TODO: also include "issues" as a way to track known bugs, and possible features. Basically a todo list for your repository.

Video Explanation:
<iframe width="560" height="315" src="https://www.youtube.com/embed/Ala6PHlYjmw?si=YNXQnDGgHev0KFwK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Semantic Versioning

TODO: Explain Semantic Versioning, link to their official specs.

### Conventional Commits

TODO: explain conventional commits

### Branch Naming

TODO: explain branch naming conventions

### Collaboration

Suppose you are collaborating on a project, then your code will need to be reviewed by other people, and you will need to review the code created by other people. Consequently, your code should not only meet the specifications set out by the issue, it should also be reviewable.

A couple rules of thumb:
- Commit: a commit message is a single sentence, and the change made in the commit should be understandable using the commit message alone.
- Pull Request (PR): a collection of _related_ commits. If the commits are not related, you put them in separate PRs. PRs should always be reviewed by someone else before they are merged into master.

Collaboration: Agents
- Suppose you are using coding agent to help you code, and someone else will need to review your code, then it is common courtesy to review all changes the agent makes yourself as well.
- The following is a list of example rules:
	- The agent may make changes, and stage them, but only the user may commit and push these changes. This allows the user to review the changes before they are committed to version control.
	- The agent may never take credit for a change, this may lead to the false assumption that the resulting code was unverified by the user, which it was not. 
	- The agent may suggest names for commits and PRs when code changes are finalized.
	- An exception to the rule of "no commits" is when the user needs help with git operations. Such as when rebasing, cherry picking or merging changes, because in this case all changes were already reviewed.