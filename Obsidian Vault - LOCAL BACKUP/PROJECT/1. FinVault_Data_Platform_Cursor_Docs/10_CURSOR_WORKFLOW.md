# Cursor Workflow

Use this workflow for the entire project.

## Step 1 — Master Context

Give Cursor the master project specification and ensure it understands:

- project objective
- architecture
- technology roles
- phases
- AI rules

## Step 2 — Phase 0

Give Cursor `01_PHASE_0_FOUNDATION.md`.

Do not ask it to build later phases.

Review the result.

## Step 3 — Phase 1

Give Cursor `02_PHASE_1_APPLICATION.md`.

Review:

- database
- API structure
- frontend
- code quality

Only continue when the foundation works.

## Step 4 — Phase 2

Give Cursor `03_PHASE_2_INGESTION.md`.

Test with valid and intentionally invalid CSV files.

## Step 5 — Phase 3

Give Cursor `04_PHASE_3_PYSPARK_LOCAL.md`.

Run the pipeline locally and inspect outputs.

## Step 6 — Phase 4

Give Cursor `05_PHASE_4_AZURE_STORAGE.md`.

Configure Azure carefully and never expose credentials.

## Step 7 — Phase 5

Give Cursor `06_PHASE_5_DATABRICKS.md`.

This is the major Data Engineering phase.

Verify actual Databricks/PySpark execution.

## Step 8 — Phase 6

Give Cursor `07_PHASE_6_ANALYTICS.md`.

Connect Gold datasets to the application dashboard.

## Step 9 — Phase 7

Give Cursor `08_PHASE_7_POLISH.md`.

Add Docker, tests, logging and final documentation.

---

# Important Cursor Prompt Pattern

At the beginning of every phase, tell Cursor:

> Read PROJECT_PLAN.md, AI_RULES.md and the relevant phase document before making changes. Implement only this phase. Do not start future phases.

At the end:

> Run relevant tests, update documentation and PROJECT_PLAN.md, summarize what changed, and stop.

---

# If Cursor starts becoming too ambitious

Use:

> STOP. You are implementing functionality from a future phase. Revert/avoid the future-phase work and continue only with the current phase requirements.
