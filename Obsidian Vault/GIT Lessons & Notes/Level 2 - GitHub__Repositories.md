---
title: "Level 2 — GitHub & Repositories"
tags: [git, github, level-2]
---

# Level 2 — GitHub & Repositories

*Taking your project online*

> [!abstract] Summary
> Your Git repository so far only exists on your computer. This level connects it to GitHub, so it can be backed up, shared, and worked on by other people.

---

## Local vs remote repositories

A repository (or "repo") is just a project folder whose history Git is tracking. So far you've only seen local repositories — ones that live on your machine. GitHub lets you host a remote repository: the same history, stored on a server, reachable over the internet.

**Diagram — Pushing local history up to GitHub**

`LOCAL COMPUTER — Project → GITHUB — Remote Repository`

**Diagram — Pulling remote history back down**

`GITHUB — Remote Repository → LOCAL COMPUTER — Project`

A "remote" is simply a saved address that points to a repository somewhere else — usually on GitHub. By convention, the main remote is named origin.

```bash
git remote -v
```
*Lists the remotes your local repository knows about, and the URLs they point to. Freshly cloned projects usually already have one remote called origin.*

```bash
git remote add origin https://github.com/you/project.git
```
*Connects your local repository to a GitHub repository, naming that connection "origin". After this, git push and git pull know where to go.*

> [!warning] Common Mistake
> "origin" is a magic keyword. It isn't — it's just the conventional name. You could name a remote anything, but almost every tutorial and tool assumes origin, so it's best to stick with it.

---

## clone vs fork, fetch vs pull, push

| git clone | Fork |
| --- | --- |
| Downloads a full copy of a remote repository — including its entire history — onto your computer, and automatically sets it as "origin". | A GitHub-only concept: creates your own copy of someone else's repository under your account on GitHub, before you even clone anything. |
| **Use:** Starting fresh on a project that already exists on GitHub. | **Use:** Contributing to a project you don't have write access to. |

```bash
git clone https://github.com/someone/project.git
```
*Copies the whole repository — files and history — into a new folder on your machine, ready to work in immediately.*

| git fetch | git pull |
| --- | --- |
| Downloads new information from the remote (new commits, branches) but does NOT change your working files. It just updates Git's knowledge of what's on GitHub. | Does a git fetch, and then immediately merges those new changes into your current branch. Your files update right away. |
| **Use:** Checking what changed remotely before deciding what to do. | **Use:** You want to be up to date, right now, with minimal steps. |

**Diagram — fetch vs pull**

| git fetch | git pull |
| --- | --- |
| GitHub → your Git's memory of GitHubYour files: unchanged | GitHub → your Git's memory + your filesfetch, then merge, automatically |

```bash
git push
```
*Uploads your local commits to the remote repository (GitHub), so others — and GitHub itself — can see them.*

> [!tip] Best Practice
> When you're not sure what changed remotely, git fetch first and inspect, rather than git pull blindly. It's a safe, read-only look before you touch your files.

> [!info] Interactive Widget (original book only): **Clone → Edit → Push Interactive Walkthrough**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

> [!question]- Quiz
> **Q1. Which command updates Git's knowledge of the remote WITHOUT changing your working files?**
>
> ◻️ git pull
> ◻️ git push
> ✅ git fetch
> ◻️ git clone
>
> *Explanation:* git fetch only downloads information. Your files stay exactly as they were until you decide to merge that information in (which is what git pull does automatically).
>

---

[[Level 1 - Git_Fundamentals|← Previous: Git Fundamentals]] | [[Git Learning Book - Index|Index]] | [[Level 3 - Branches|Next: Branches →]]
