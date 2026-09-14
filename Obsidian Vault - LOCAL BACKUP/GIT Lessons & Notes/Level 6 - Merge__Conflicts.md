---
title: "Level 6 — Merge & Conflicts"
tags: [git, github, level-6]
---

# Level 6 — Merge & Conflicts

*When two changes collide*

> [!abstract] Summary
> Merging is usually invisible and automatic. Sometimes it isn't — this level shows exactly what a conflict looks like and how to resolve one, step by step.

---

## Fast-forward merge vs merge commit

| Fast-forward merge | Merge commit |
| --- | --- |
| main hasn't moved since your branch started. Git just slides main's pointer forward to your latest commit — no new commit needed. | main moved forward too while you worked. Git creates a new commit that joins both histories together. |
| **Use:** Simple, linear history. Most small features. | **Use:** Preserves the fact that two lines of work happened in parallel. |

Both are completely normal outcomes of git merge — you don't choose between them manually, Git decides based on whether the histories diverged.

---

## Why conflicts happen, and how to resolve one

A merge conflict happens when two branches changed the exact same lines of the exact same file in different ways, and Git can't automatically decide which version is correct.

**Diagram — Two branches, one disagreement**

| main | feature/button |
| --- | --- |
|  |  |

When you try to merge feature/button into main, Git can't know which color you actually want, so it stops and marks the file with conflict markers:

> [!info] Interactive Widget (original book only): **Merge Conflict Simulator**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

Resolution steps: open the conflicted file → understand both changes → decide the final code → remove the <<<<<<<, =======, >>>>>>> markers → save → git add the file → git commit to finish the merge.

```bash
git add login.js
```
*After you've manually fixed the file and removed the conflict markers, this tells Git "this file's conflict is resolved".*

```bash
git commit
```
*Finishes the merge by creating the merge commit. Git usually pre-fills a sensible commit message for you here.*

> [!warning] Common Mistake
> Panicking and deleting one side entirely without reading it. Conflicts are not errors — they're Git asking a question. Read both versions before choosing.

> [!tip] Best Practice
> Pull main into your branch often while you work. Small, frequent merges create small, easy conflicts. Waiting weeks creates huge, painful ones.

> [!question]- Quiz
> **Q1. Why does a merge conflict happen?**
>
> ◻️ Git is broken
> ✅ Two branches changed the same lines differently, and Git can't choose for you
> ◻️ You forgot to git push
> ◻️ The internet disconnected
>
> *Explanation:* Git can merge non-overlapping changes automatically. It only asks for your help when the same lines were changed in two different ways.
>

---

[[Level 5 - Pull_Requests|← Previous: Pull Requests]] | [[Git Learning Book - Index|Index]] | [[Level 7 - Team_Workflow|Next: Team Workflow →]]
