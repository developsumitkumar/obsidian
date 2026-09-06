---
title: "Level 5 — Pull Requests"
tags: [git, github, level-5]
---

# Level 5 — Pull Requests

*Where code gets reviewed*

> [!abstract] Summary
> A Pull Request (PR) is GitHub's way of proposing "please merge my branch into yours" — and giving other people a chance to review it first. This is how real teams keep main safe.

---

## What a Pull Request actually is

A Pull Request is not a Git concept — it's a GitHub (and GitLab/Bitbucket) feature built on top of Git. It represents a request to merge one branch into another, with a space attached for discussion, comments, and approval before it happens.

| A commit | A Pull Request |
| --- | --- |
| One saved snapshot of changes. Silent, no discussion attached. | A proposal containing one or more commits from a branch, opened for review before merging. |
| **Use:** The unit of history. | **Use:** The unit of collaboration and review. |

**Diagram — The Pull Request workflow**

`Developer creates branch → commits → pushes → Open Pull Request → Reviewer reviews → Changes requested → developer updates → pushes again → Approved → Merge → main`

PRs exist because merging straight into main with no review is risky. A second set of eyes catches bugs, design issues, and typos before they reach everyone else.

> [!warning] Common Mistake
> "A branch and a Pull Request are the same thing." A branch is just where the commits live. The Pull Request is the conversation and review process wrapped around merging that branch.

---

## The simulated PR screen

Below is a simplified simulation of what a GitHub Pull Request page looks like: a diff of the changes, review comments, and buttons to approve, request changes, or merge.

> [!info] Interactive Widget (original book only): **Pull Request Simulator**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

> [!tip] Best Practice
> Keep PRs small. A PR that changes 30 files is exhausting to review carefully, so real bugs slip through. A focused PR that does one thing gets reviewed properly — and merged faster.

> [!question]- Quiz
> **Q1. A reviewer clicks "Request changes" on your Pull Request. What should you do?**
>
> ◻️ Close the PR and give up
> ✅ Push new commits addressing the feedback — the PR updates automatically
> ◻️ Open a brand new PR
> ◻️ Merge anyway
>
> *Explanation:* Pushing more commits to the same branch automatically updates the same open PR — no need to open a new one. The reviewer then re-reviews the new changes.
>

---

[[Level 4 - Commit__Push__Pull|← Previous: Commit / Push / Pull]] | [[Git Learning Book - Index|Index]] | [[Level 6 - Merge__Conflicts|Next: Merge & Conflicts →]]
