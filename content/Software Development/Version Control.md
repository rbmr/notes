Software tends to evolves over time, the question remains, how will we manage it while it does?

### Version Control Systems

Core definitions from [wikipedia](https://en.wikipedia.org/wiki/Version_control):

- **Version control** is the software engineering practice of controlling, organizing, and tracking different versions in history of computer files - primarily source code text files, but generally any type of file.
- A **version control system** (**VCS**) is a software tool that automates version control.

We will focus on **Git** the VCS released by Linus Torvalds in 2005, [of which the name has no clear meaning](https://github.com/git/git/blob/e83c5163316f89bfbde7d9ab23ca2e25604af290/README).

### Basic Git Guide

A high-level overview of the most common Git terminology:

- A **repository** (or **repo** in short) is a directory of which the history is tracked by Git. 
- A **commit** is an immutable snapshot of the entire project at a point in time, identified by a hash of its contents, metadata (author, timestamp, message), and a pointer to its parent commit(s). Because each commit points back to its parent, the full history of commits forms a directed acyclic graph.
- A **branch** is just a lightweight, movable pointer to a commit. `HEAD` is a special pointer tracking whichever commit/branch is currently checked out.
- **Merging** integrates the changes from one branch into another by creating a commit with two parents called a **merge commit**. 
	- If the source branch has no conflicting changes with the target branch, the merge commit can be created, if not, we have a **merge conflict**, which must be resolved by hand before the merge can complete.
- **Rebasing** also integrates changes, but by rewriting history instead of combining it.  It replays the source branch's commits on top of the target branch, producing new commits rather than a merge commit. This keeps history linear and easier to read, at the cost of rewriting your commits' identities.
	- Common rule: Never rebase commits that other people have already built on top of. Since rebasing changes commit hashes, doing so on shared history forces everyone else to reconcile their own copies later.
- **Pull-Requests** (also called **Merge Requests**) are requests for a project maintainer to review and integrate your changes into another branch. 
- **Issues** are essentially to-do items for the repository, used to track known bugs and requested features. An issue typically has a title, description, labels, and assignees, and can be referenced directly from a commit or pull request to automatically close it once merged. 
- Issues and pull-requests are not features specific to Git, but rather the platforms that operate around it such as GitHub and GitLab.

Video Explanation:
<iframe width="560" height="315" src="https://www.youtube.com/embed/Ala6PHlYjmw?si=YNXQnDGgHev0KFwK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### Semantic Versioning

**Semantic Versioning** (**SemVer**) is a specification for structuring version numbers so they communicate the meaning of a change. A version takes the form `MAJOR.MINOR.PATCH` (e.g. `2.4.1`):
- **MAJOR**: incremented for incompatible, breaking changes.
- **MINOR**: incremented for backward-compatible new functionality.
- **PATCH**: incremented for backward-compatible bug fixes.

A pre-release label may be appended to mark a version as unstable (e.g. `1.0.0-alpha.1`), and build metadata may be appended after a `+` (e.g. `1.0.0+20231001`) without affecting how the version is ranked. By adhering to this contract, dependency managers can safely automate MINOR/PATCH updates, while flagging MAJOR changes for manual review. 

See the [official specification](https://semver.org/) for the full details.

### Conventional Commits

**Conventional Commits** is a specification for writing commit messages in a structured, machine-readable format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

where:
- `<type>` is one of the following:
	- `fix:` patches a bug (corresponds to PATCH in SemVer).
	- `feat:` introduces a new feature (corresponds to MINOR in SemVer).
	- `BREAKING CHANGE:` introduces a breaking change (corresponds to MAJOR in SemVer). One can also trigger a breaking change by adding a `!` after the type. For example, `fix!: <message>` introduces a breaking fix.
	- types other than `fix:`, `feat:`, and `BREAKING CHANGE:` are allowed. For example: `build:`, `chore:`, `ci:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, each of which dont lead to version bump at all.
- `<optional scope>` provides some additional contextual information and is contained within parentheses, e.g., for a new feature for the parser, you could write a commit as: `feat(parser): add ability to parse arrays`.
- `<description>` a brief description of the changes made in the commit.

Reference: [https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)

### Branch naming

Branch names should be descriptive, lowercase, and use hyphens to separate words. To maintain traceability with the issue tracker and consistency with commit messages, generally use the following format: `<type>/[<issue-number>-]<short-description>`
- `<type>`: Use the same types defined in our commit message conventions (e.g., `feat`, `fix`, `docs`, `chore`, `refactor`).
- `<issue-number>` (Optional) a reference to the corresponding issue by its identifier.
- `<short-description>`: A brief, hyphen-separated description of the branch's purpose, generally not more than 4 words.

**Examples:**
- `feat/142-user-authentication`
- `fix/89-navbar-alignment`
- `docs/update-readme-instructions`

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