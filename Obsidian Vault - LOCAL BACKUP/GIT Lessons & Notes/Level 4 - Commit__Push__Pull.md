---
title: "Level 4 — Commit / Push / Pull"
tags: [git, github, level-4]
---

# Level 4 — Commit / Push / Pull

*The daily pipeline*

> [!abstract] Summary
> You've seen these commands separately. Now see them as one continuous pipeline, and use the interactive command buttons to feel exactly what changes — and what doesn't — at each step.

---

## From a changed file to GitHub

**Diagram — The full local → remote pipeline**

`FILE CHANGED → git add ↓ → STAGING AREA → LOCAL HISTORY → GITHUB`

```bash
git status
```
*Shows the current state: which files are modified, which are staged, and which branch you're on. This is your map — run it constantly.*

```bash
git add login.js
```
*Moves login.js from "changed" into the staging area. Only staged changes get included in the next commit.*

```bash
git commit -m "Add login validation"
```
*Saves everything currently staged as a new, permanent point in your local history, labeled with that message.*

```bash
git push
```
*Uploads any local commits that GitHub doesn't have yet, to the remote repository.*

> [!info] Interactive Widget (original book only): **CI/CD Pipeline Visualizer**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

> [!warning] Common Mistake
> Believing git commit sends your code to GitHub. It doesn't — a commit is 100% local until you explicitly run git push.

---

## Bringing changes back down

The reverse direction matters just as much, especially once other people are pushing to the same repository.

| git fetch | git pull |
| --- | --- |
| GitHub → Git's local memory of GitHub. Look, don't touch. | Fetch, then automatically merge those changes into your current branch. Your files update. |
| **Use:** "What has changed remotely, before I decide anything?" | **Use:** "Bring me fully up to date, right now." |

```bash
git fetch
```
*Updates your local knowledge of the remote branches without touching your working files.*

```bash
git pull
```
*Fetches and immediately merges. If you have local uncommitted changes that conflict, Git will stop and ask you to resolve that first.*

> [!tip] Best Practice
> Pull (or at least fetch) before you start working each day, and again right before you push. It keeps your branch close to what everyone else sees.

> [!question]- Quiz
> **Q1. Put these in the correct order: git commit, git add, git push, edit a file.**
>
> ✅ edit file → git add → git commit → git push
> ◻️ git add → edit file → git push → git commit
> ◻️ git push → git commit → git add → edit file
> ◻️ git commit → git add → edit file → git push
>
> *Explanation:* You always change a file first, stage it (git add), save a snapshot locally (git commit), then optionally share it (git push).
>

---

[[Level 3 - Branches|← Previous: Branches]] | [[Git Learning Book - Index|Index]] | [[Level 5 - Pull_Requests|Next: Pull Requests →]]
