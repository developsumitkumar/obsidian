---
title: "Level 3 — Branches"
tags: [git, github, level-3]
---

# Level 3 — Branches

*The most important idea in Git*

> [!abstract] Summary
> Branches let you build something new without touching the version everyone depends on. This level includes the big interactive branch visualizer — spend real time here.

---

## Why branches exist

> [!example] Analogy
> main is the main road everyone drives on. A feature branch is a side road you build off of it, to test something, without putting traffic on the main road at risk. When your side road works well, you connect it back to the main road (merge).

Without branches, everyone would have to edit the exact same version of the code at the exact same time — one mistake and it breaks for everyone. Branches let each person, or each feature, live in its own isolated timeline until it's ready.

> [!warning] Common Mistake
> "A branch is a copy of the whole project." It is not a duplicate folder — it's a lightweight, movable pointer to a specific commit. Creating a branch is nearly instant and doesn't duplicate your files on disk.

```bash
git branch
```
*Lists all branches in your local repository, and marks which one you're currently on with an asterisk.*

```bash
git branch feature/login
```
*Creates a new branch named feature/login, pointing at your current commit. You are NOT switched to it yet — you're still on your original branch.*

```bash
git switch feature/login
```
*Switches your working directory to the feature/login branch. Modern Git recommends git switch for this — it's clearer and safer than the older, overloaded git checkout.*

```bash
git switch -c feature/login
```
*A shortcut that creates the branch AND switches to it in one step — the version you'll use most often day to day.*

You will see older tutorials use git checkout feature/login instead. That still works, but git checkout has historically done too many different jobs (switching branches, restoring files, and more), which made it a common source of mistakes. Modern Git split it into two clearer commands:

| git switch | git restore |
| --- | --- |
| Switches between branches. That's its only job. | Restores files to a previous state, discarding local changes to them. |
| **Use:** "I want to move to a different branch." | **Use:** "I want to undo my edits to this one file." |

---

## The branch visualizer

This is the big one. Use the visualizer below to create branches, commit to them, switch between them, and merge them back — and watch the graph update in real time.

> [!info] Interactive Widget (original book only): **Branch Visualizer**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

```bash
git merge feature/login
```
*Run while on main, this brings the commits from feature/login into main. If main hasn't changed since the branch was created, this is a simple "fast-forward". If it has, Git creates a merge commit joining both histories.*

```bash
git branch -d feature/login
```
*Deletes the feature/login branch once you no longer need it (usually right after merging). The commits themselves are safe — they now live on main too.*

> [!tip] Best Practice
> Delete branches after merging them. A repository with hundreds of old, merged branches becomes confusing to navigate — GitHub even offers a button to auto-delete branches after merge.

Scenario: You need to build a login feature while another developer works on payment, at the same time, without stepping on each other.

> [!question] Try It Yourself
> In the visualizer above: create a branch called feature/login, add a commit to it, then create a second branch called feature/payment from main and add a commit there too. Notice both branches can exist and grow independently.

> [!question]- Quiz
> **Q1. Two developers need to build unrelated features at the same time without breaking main. What should they do?**
>
> ◻️ Both edit main directly, carefully
> ✅ Each creates their own branch off main
> ◻️ One of them waits until the other finishes
> ◻️ Delete main and start over
>
> *Explanation:* Separate branches let each person work in isolation. Neither one can accidentally break what the other is doing, and main stays stable the whole time.
>
> **Q2. What does creating a branch actually do under the hood?**
>
> ◻️ Duplicates every file into a new folder
> ✅ Creates a lightweight pointer to a commit
> ◻️ Uploads a copy to GitHub automatically
> ◻️ Deletes the previous branch
>
> *Explanation:* A branch is just a movable label pointing at a commit — which is why creating one is nearly instant, even on huge projects.
>

---

[[Level 2 - GitHub__Repositories|← Previous: GitHub & Repositories]] | [[Git Learning Book - Index|Index]] | [[Level 4 - Commit__Push__Pull|Next: Commit / Push / Pull →]]
