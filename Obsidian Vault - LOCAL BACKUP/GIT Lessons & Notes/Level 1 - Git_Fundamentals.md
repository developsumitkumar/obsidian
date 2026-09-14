---
title: "Level 1 — Git Fundamentals"
tags: [git, github, level-1]
---

# Level 1 — Git Fundamentals

*The three-zone mental model*

> [!abstract] Summary
> This is the single most important level in the whole book. Once you can see the working directory, staging area, and repository as three separate places a file can be, every future Git command becomes predictable.

---

## What is Git, really?

Git is a program that watches a project folder and lets you save labeled snapshots of it over time, called commits. It runs entirely on your computer — no internet required.

> [!example] Analogy
> Git is like a very disciplined save system in a video game. Instead of one "Save" slot that overwrites itself, you get unlimited save points, each with a note describing what happened, and you can jump back to any of them.

```bash
git --version
```
*Checks whether Git is installed and which version you have. This is usually the first command you run on a new machine, purely to confirm Git exists.*

```bash
git config --global user.name "Your Name"
```
*Tells Git who you are, so every commit you make is labeled with your name. This is a one-time setup per computer.*

```bash
git config --global user.email "you@example.com"
```
*Same idea, but for your email address. GitHub also uses this to match your commits to your GitHub account.*

> [!warning] Common Mistake
> Skipping git config and wondering why every commit says "unknown author". Git needs to be told who you are before it will label commits properly.

> [!question] Try It Yourself
> If you have Git installed, open a terminal and run git --version. If you don't, that's fine — everything in this book can be learned visually first, and installed later.

---

## The three zones: Working Directory, Staging Area, Repository

Every file in a Git project can sit in one of three places. Understanding these three places is 80% of understanding Git.

> [!example] Analogy
> Think of moving furniture into a house. The Working Directory is the room where you are actively arranging furniture. The Staging Area is the doorway where you've picked which pieces are ready to bring in. The Repository is the permanent room where furniture is placed and recorded — done.

**Diagram — The three zones of Git**

<svg viewBox="0 0 720 190" width="100%" style="max-width:680px;display:block;margin:0 auto;">
          <g font-size="12">
            <rect x="10" y="30" width="200" height="110" rx="10" fill="var(--bg-elev-1)" stroke="var(--amber)"/>
            <text x="110" y="20" text-anchor="middle" fill="var(--amber)" font-weight="700">WORKING DIRECTORY</text>
            <text x="110" y="90" text-anchor="middle" dim="1">Files you</text>
            <text x="110" y="106" text-anchor="middle">are editing now</text>

            <rect x="260" y="30" width="200" height="110" rx="10" fill="var(--bg-elev-1)" stroke="var(--accent)"/>
            <text x="360" y="20" text-anchor="middle" fill="var(--accent)" font-weight="700">STAGING AREA</text>
            <text x="360" y="90" text-anchor="middle">Files marked</text>
            <text x="360" y="106" text-anchor="middle">"include next commit"</text>

            <rect x="510" y="30" width="200" height="110" rx="10" fill="var(--bg-elev-1)" stroke="var(--green)"/>
            <text x="610" y="20" text-anchor="middle" fill="var(--green)" font-weight="700">REPOSITORY (.git)</text>
            <text x="610" y="90" text-anchor="middle">Permanent history</text>
            <text x="610" y="106" text-anchor="middle">of commits</text>

            <text x="235" y="90" text-anchor="middle" fill="var(--text-faint)" font-family="var(--mono)" font-size="11">git add →</text>
            <text x="485" y="90" text-anchor="middle" fill="var(--text-faint)" font-family="var(--mono)" font-size="11">git commit →</text>
          </g>
        </svg>

A change always flows left to right: you edit a file (working directory), you choose it with git add (staging area), then you save it permanently with git commit (repository). Nothing skips a step.

> [!info] Interactive Widget (original book only): **Git Zones (Working Dir / Staging / Repo) Interactive Diagram**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

```bash
git init
```
*Turns an ordinary folder into a Git repository by creating a hidden .git folder inside it. That hidden folder is where all history will live from now on.*

**Diagram — What changes on disk after git init**

`my-project/ → my-project/.git/  ← history storage created here`

> [!warning] Common Mistake
> Thinking git add uploads your file somewhere. It does not — it only marks the file as "ready to be committed" inside your own computer. Nothing leaves your machine yet.

> [!tip] Best Practice
> Run git status often. It tells you exactly which zone every file is currently in, which removes almost all the guesswork while you're learning.

> [!question] Try It Yourself
> Use the interactive diagram above: click "Modify File", then "git add", then "git commit". Watch the file move through all three zones. Then click "Modify Again" and notice a fresh, independent change appears.

> [!question]- Quiz
> **Q1. You just ran git add on a file. Has that file been sent to GitHub?**
>
> ◻️ Yes, it is now on GitHub
> ✅ No — it is only in the local staging area
> ◻️ No — it was deleted
> ◻️ Yes, but only the file name
>
> *Explanation:* git add never contacts the internet. It only moves a change from the Working Directory into the local Staging Area, inside your own .git folder.
>
> **Q2. What creates the hidden .git folder that stores your project's history?**
>
> ◻️ git commit
> ◻️ git status
> ✅ git init
> ◻️ git add
>
> *Explanation:* git init is a one-time command per project that creates the .git folder — the actual database of history for that project.
>

---

[[Level 0 - Before_Git|← Previous: Before Git]] | [[Git Learning Book - Index|Index]] | [[Level 2 - GitHub__Repositories|Next: GitHub & Repositories →]]
