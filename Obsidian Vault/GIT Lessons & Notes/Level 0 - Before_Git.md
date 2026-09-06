---
title: "Level 0 — Before Git"
tags: [git, github, level-0]
---

# Level 0 — Before Git

*Why version control exists*

> [!abstract] Summary
> Before you learn a single Git command, you need to feel the problem Git solves. This level has no commands — just the pain of working without one.

---

## The "final-final-v2" problem

Imagine you are writing code for a school project. Every time you make a big change, you are scared of breaking something that used to work — so you save a new copy of the whole folder.

**Diagram — Life without version control**

`project-v1 → project-v2 → project-final → project-final-2 → project-final-new → project-final-really-final`

This feels safe, but it is actually chaos. Which folder is the real one? What exactly changed between project-final and project-final-2? Nobody remembers. If two people work on the project, this gets even worse — copies get overwritten by email or shared drives.

> [!warning] Common Mistake
> "I'll just keep folder copies to be safe." — This works for a day. It completely falls apart once a project has more than a few changes, or more than one person.

A version control system fixes this by tracking every meaningful change inside one project folder, instead of duplicating the whole folder over and over.

**Diagram — The same project, tracked by Git instead of copied**

`Project → Commit 1 — "Initial setup" → Commit 2 — "Add login form" → Commit 3 — "Fix validation bug" → Commit 4 — "Add tests"`

> [!note] Remember
> - One project folder, one history — no duplicate folders.
> - Every meaningful change is recorded as a step you can return to.
> - This recorded history is called version control.

---

## Version Control, Git, and GitHub are three different things

These three words get used interchangeably by beginners, but they mean different things and mixing them up causes real confusion later.

| Version Control | Git |
| --- | --- |
| A general idea: keep a history of changes to files so you can review, compare, and undo them. It's a concept, not a tool. | A specific, free program that implements version control. It runs on your computer and manages the history of a project folder. |
| **Use:** The "what" and "why" behind tracking changes. | **Use:** The tool you actually run: git init, git commit, git log… |

And then there is GitHub, which is a completely different kind of thing.

**Diagram — Git vs GitHub — not the same thing**

| Git | GitHub |
| --- | --- |
| A program installed on your computer. It tracks history locally. Works completely offline. Think: the notebook itself. | A website that hosts copies of Git repositories online, so people can share and collaborate on them. Think: a shared cloud drive built specifically for Git notebooks, plus tools like Pull Requests, Issues, and CI/CD. |

You could use Git for years without ever touching GitHub — many developers do, using private servers instead. GitHub is simply the most popular place to host Git repositories and collaborate around them.

> [!warning] Common Mistake
> "GitHub is Git." — False. Git is the tool. GitHub is one company's website for hosting projects that use Git. GitLab and Bitbucket are competitors that also host Git repositories.

> [!note] Remember
> - Version control = the concept
> - Git = the tool that implements it, on your machine
> - GitHub = a website that hosts Git projects online + adds collaboration features

> [!question] Try It Yourself
> Say out loud (or write down) one sentence explaining the difference between Git and GitHub in your own words, without looking back at this page.

---

[[Git Learning Book - Index|Index]] | [[Level 1 - Git_Fundamentals|Next: Git Fundamentals →]]
