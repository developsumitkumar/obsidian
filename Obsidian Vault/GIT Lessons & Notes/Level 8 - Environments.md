---
title: "Level 8 — Environments"
tags: [git, github, level-8]
---

# Level 8 — Environments

*Development, Staging, Production*

> [!abstract] Summary
> Merging code into main is not the same as showing it to real users. This level explains the safety net of environments that sits between "it works on my machine" and "it works for everyone".

---

## Why we don't deploy straight to real users

> [!example] Analogy
> A restaurant kitchen doesn't serve a brand-new dish straight to customers. It's tested in a test kitchen first, then prepared properly in the real kitchen, and only then served. Software works the same way: Development → Staging → Production.

**Diagram — The environment ladder**

`Developer Laptop → Development → Staging → Production`

| Development | Staging |
| --- | --- |
| Where developers actively build and experiment. Frequently broken — that's expected. | A near-identical copy of production, used to test that everything really works before real users see it. |
| **Use:** Day-to-day coding. | **Use:** Final check before release. |

| Production |
| --- |
| The real, live application that actual users depend on. Changes here must be stable. |
| **Use:** What the world sees. |

---

## Same code, different configuration

Usually the code is nearly identical across environments — what changes is configuration: which database it talks to, which API address it uses, which secrets it has access to.

**Diagram — Same app, different API address per environment**

`Development API — api-dev.example.com → Staging API — api-stage.example.com → Production API — api.example.com`

These per-environment values are called environment variables. Sensitive ones — passwords, tokens, API keys — are called secrets, and are kept out of the code entirely, injected at runtime by a secret manager.

> [!warning] Common Mistake
> "Production is just another folder on the server." It's not — production usually has its own database, its own secrets, tighter access control, and real consequences if something breaks.

> [!tip] Best Practice
> Never hard-code a production URL, password, or key directly into your source code. Use environment variables so the same code behaves correctly wherever it runs.

> [!question]- Quiz
> **Q1. What usually differs the most between staging and production?**
>
> ◻️ The programming language
> ✅ Configuration — like API URLs, databases, and secrets
> ◻️ The company that owns the code
> ◻️ Nothing — they must be code-identical
>
> *Explanation:* The code is typically the same or nearly the same. What changes is configuration: which database, which API endpoints, which secrets are active.
>

---

[[Level 7 - Team_Workflow|← Previous: Team Workflow]] | [[Git Learning Book - Index|Index]] | [[Level 9 - CICD__Pipelines|Next: CI/CD & Pipelines →]]
