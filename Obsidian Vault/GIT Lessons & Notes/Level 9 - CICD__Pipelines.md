---
title: "Level 9 — CI/CD & Pipelines"
tags: [git, github, level-9]
---

# Level 9 — CI/CD & Pipelines

*Automating the boring, critical checks*

> [!abstract] Summary
> CI/CD sounds intimidating but it's just automation: a checklist of steps that run automatically every time code changes, so humans don't have to remember to do them manually.

---

## CI vs CD, in plain English

| Continuous Integration (CI) | Continuous Delivery / Deployment (CD) |
| --- | --- |
| Every time someone pushes code, it's automatically built and tested — catching problems within minutes instead of weeks. | Automatically prepares (Delivery) or directly ships (Deployment) code to an environment once it passes CI. |
| **Use:** "Does this change actually work, and does it break anything else?" | **Use:** "Now that it's verified, get it in front of users." |

A pipeline is the full sequence of automated steps. A workflow is GitHub Actions' name for a pipeline definition. A job is a group of steps that run together; a step is one individual action, like "run tests". A runner is the actual machine that executes the job. An artifact is a file produced by the pipeline (like a built app) that gets passed to later steps.

---

## The interactive pipeline

Below is a realistic pipeline, using GitHub Actions as the example. Click each stage to see the exact command it runs and what happens if it fails.

> [!info] Interactive Widget (original book only): **CI/CD Simulation**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

A pipeline is not magic — it's simply a sequence of automated tasks, run in order, that stop as soon as one of them fails.

**Diagram — A failed test blocks everything after it**

BUILD — ✓ passed
TEST — ✗ failed
DEPLOY — ⏸ blocked

> [!warning] Common Mistake
> "If CI passes, the code must be perfect." CI only checks what it was configured to check. It catches the bugs its tests were written for — nothing more.

> [!tip] Best Practice
> Keep pipelines fast. A CI run that takes 45 minutes gets ignored or worked around. Fast feedback (under a few minutes) keeps developers actually paying attention to it.

> [!question]- Quiz
> **Q1. The TEST stage fails. What should typically happen to the DEPLOY stage?**
>
> ◻️ It runs anyway
> ✅ It is blocked / skipped
> ◻️ It deploys a random older version
> ◻️ It emails the whole company
>
> *Explanation:* Pipelines are sequential gates — a failure at one stage should block later stages, especially deployment, so broken code never reaches real users.
>
> **Q2. What is a "runner" in CI/CD?**
>
> ◻️ A type of test
> ✅ The machine that actually executes the pipeline's steps
> ◻️ A GitHub employee
> ◻️ A kind of Git branch
>
> *Explanation:* A runner is the compute environment (often a temporary virtual machine) that GitHub Actions spins up to actually execute your workflow's steps.
>

---

[[Level 8 - Environments|← Previous: Environments]] | [[Git Learning Book - Index|Index]] | [[Level 10 - Deployment|Next: Deployment →]]
