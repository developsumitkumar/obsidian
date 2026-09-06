---
title: "Level 7 — Team Workflow"
tags: [git, github, level-7]
---

# Level 7 — Team Workflow

*Many developers, one repository*

> [!abstract] Summary
> Individually, each command is simple. This level shows how a team of developers uses them together, day to day, without chaos.

---

## Everyone branches off main

**Diagram — Three developers, three branches, one main**

`main → feature/login (Dev A) → feature/payment (Dev B) → bugfix/cart (Dev C)`

Each person works in isolation on their own branch. When ready, they open a PR, it gets reviewed, automated checks run, and only then does it merge into main.

**Diagram — Every branch goes through the same gate**

`Pull Request → Review → CI checks → Merge into main`

Protected branches are a GitHub setting that literally blocks anyone — even the repository owner — from pushing directly to main. Every change must go through a reviewed, checked Pull Request instead.

---

## The habits that make teamwork actually work

Naming: use a consistent prefix like feature/, bugfix/, or hotfix/, followed by a short description — feature/login-page, bugfix/cart-total.

Commit messages: describe what changed and why, in the imperative mood — "Add login validation", not "changes" or "stuff".

Keeping branches updated: regularly merge or rebase main into your branch so it doesn't drift too far and cause a painful conflict later.

> [!tip] Best Practice
> Small PRs, clear descriptions, and responding to review comments promptly are the three habits that make a team's Git workflow feel smooth instead of stressful.

> [!warning] Common Mistake
> Pushing directly to main "just this once" to save time. This is exactly what protected branches and PR review exist to prevent — one untested change can break the whole team's work.

> [!info] Interactive Widget (original book only): **Team Workflow Simulator**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

> [!question]- Quiz
> **Q1. What is a "protected branch" for?**
>
> ◻️ To hide the branch from other developers
> ✅ To prevent direct pushes, forcing changes through review + checks
> ◻️ To make the branch read-only forever
> ◻️ To automatically delete old commits
>
> *Explanation:* A protected branch (usually main) requires every change to go through a Pull Request with review and checks — nobody can push straight to it, which keeps it stable.
>

---

[[Level 6 - Merge__Conflicts|← Previous: Merge & Conflicts]] | [[Git Learning Book - Index|Index]] | [[Level 8 - Environments|Next: Environments →]]
