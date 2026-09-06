---
title: "Level 11 — Git Best Practices"
tags: [git, github, level-11]
---

# Level 11 — Git Best Practices

*Habits that scale*

> [!abstract] Summary
> A highly practical, no-fluff checklist covering commits, branches, PRs, repository hygiene, and — critically — security.

---

## Commits, branches, and PRs

| Bad commit message | Good commit message |
| --- | --- |
| "changes" / "fixed stuff" — tells future-you nothing about what happened or why. | "Add login validation" / "Fix null response handling in API client" — describes the change clearly. |
| **Use:** Never. | **Use:** Every commit. |

Keep commits small and focused on one logical change. A 2,000-line commit titled "misc" is nearly impossible to review or safely revert.

Branch naming — pick a simple, consistent convention: main, feature/*, bugfix/*, hotfix/*. Example names: feature/login-page, feature/payment-api, bugfix/order-total, hotfix/auth-timeout.

For most teams, this simple convention is enough. Avoid adopting an elaborate branching model (like full Git Flow with dozens of long-lived branch types) unless your project genuinely needs that complexity — it usually just adds overhead.

Pull Request habits: keep PRs small, write a clear title, explain why (not just what) in the description, add screenshots for visual changes, link the related issue, and respond to review comments instead of ignoring them.

---

## Repository hygiene and security

A healthy repository usually includes: a README explaining what the project is and how to run it, a .gitignore listing files Git should never track, a CONTRIBUTING.md if others will submit changes, and a LICENSE if the project is public.

> [!info] Interactive Widget (original book only): **.gitignore Interactive Builder**
> This was an interactive JS widget in the original HTML book and isn't reproduced here — refer back to the original `index.html` if you want to use it.

> [!warning] Common Mistake
> CRITICAL SECURITY RULE — Never commit passwords, API keys, access tokens, or production secrets. Example of what NOT to put in a tracked file: API_KEY=123456789. Use environment variables and a secret manager instead — they stay out of your Git history entirely.

**Diagram — Where secrets should actually live**

`Environment Variables → Secret Manager → Application (at runtime)`

Important: if a secret is accidentally committed, simply deleting it from the latest version of the file is NOT enough. Git keeps full history — that secret still exists in an old commit and can be found there. Recovering from a leaked secret means rotating (changing) the actual credential, and separately, scrubbing it from history if required.

> [!tip] Best Practice
> Treat any committed secret as compromised the moment it's pushed, even briefly. Rotate it immediately rather than assuming a quick fix or a force-push fully erased it everywhere.

> [!question]- Quiz
> **Q1. You accidentally committed and pushed an API key, then deleted it in your next commit. Is the key still safe?**
>
> ◻️ Yes, deleting it fixed everything
> ✅ No — it still exists in the earlier commit's history and should be rotated
> ◻️ Yes, as long as you didn't push again
> ◻️ No, but only for 24 hours
>
> *Explanation:* Git keeps full history by default. The key is still retrievable from the old commit. The only safe response is to rotate (invalidate and replace) the actual credential.
>

---

[[Level 10 - Deployment|← Previous: Deployment]] | [[Git Learning Book - Index|Index]] | [[Level 12 - Real-World_Developer_Workflow|Next: Real-World Developer Workflow →]]
