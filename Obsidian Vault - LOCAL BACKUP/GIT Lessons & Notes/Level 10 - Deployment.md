---
title: "Level 10 — Deployment"
tags: [git, github, level-10]
---

# Level 10 — Deployment

*From source code to a live server*

> [!abstract] Summary
> This level connects the dots: how source code becomes a running application users can actually reach, and what happens when a deployment goes wrong.

---

## Build, artifact, deploy

**Diagram — From source to a running app**

`Source Code → Artifact (a packaged, ready-to-run bundle) → Server / Cloud Hosting → Live Application`

A build transforms your raw source code into something a computer can actually run — compiling, bundling, minifying. An artifact is the result: a packaged file (or set of files) that's ready to deploy. Deployment is the act of placing that artifact onto a server so it starts running and becomes reachable.

A release is a specific, labeled version of your artifact that got deployed — useful for tracking exactly what's live at any moment, and for rolling back if needed.

---

## Rollback: the undo button for production

**Diagram — Rolling back a bad deployment**

`Version 10 → Production → Version 9 → Production`

A rollback replaces a broken live version with the last known-good one, usually within minutes. This is why keeping clean, labeled release history matters — you need something safe to roll back to.

> [!tip] Best Practice
> Always know how to roll back before you deploy forward. A fast, reliable rollback plan turns a production incident from a crisis into a five-minute fix.

> [!warning] Common Mistake
> "Deploying is basically the same as merging a PR." Merging changes your source code's history. Deploying is the separate act of getting that code actually running somewhere users can reach — they often happen automatically together, but they are not the same event.

> [!question]- Quiz
> **Q1. Production is broken after a deployment. What's usually the fastest fix?**
>
> ◻️ Rewrite the feature from scratch
> ✅ Roll back to the previous known-good version
> ◻️ Wait for the next scheduled deploy
> ◻️ Turn off the server permanently
>
> *Explanation:* A rollback restores the last stable version almost immediately, buying time to properly fix and re-deploy the actual bug without users suffering in the meantime.
>

---

[[Level 9 - CICD__Pipelines|← Previous: CI/CD & Pipelines]] | [[Git Learning Book - Index|Index]] | [[Level 11 - Git_Best_Practices|Next: Git Best Practices →]]
