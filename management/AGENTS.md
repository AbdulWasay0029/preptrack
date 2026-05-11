# PrepTrack — Agent Management Guide
> This file is for Abdul Wasay (owner) and Claude (lead developer/manager).
> Every agent working on this project must receive the correct briefing file before starting.
> Claude maintains this file. Do not edit manually.

---

## Agent Roster

| Agent | Role | What it does | When to use |
|-------|------|-------------|-------------|
| Claude (claude.ai) | Lead developer / Manager | Architecture, documentation, Notion updates, code review, agent coordination, product decisions | Always. Every session starts and ends here. |
| Antigravity | Builder | Full-stack code generation, bug fixes, feature implementation | When code needs to be written or fixed |
| Stitch | Designer | UI mockups, component designs, design system | When new pages or components need designing before coding |
| Google AI Studio | Data generator | Generating question datasets in SQL format | When expanding question database |
| ChatGPT | Secondary advisor | Alternative opinions, documentation drafts | Optional, secondary use only |

---

## How Every Session Works

### Starting a session with any agent:

1. **Come to Claude first.** Tell Claude what you want to do.
2. Claude decides which agent handles it and generates the correct briefing file.
3. You paste the briefing file into that agent as the first message.
4. Agent does the work.
5. Agent updates HANDOFF.md at the end of the session.
6. You bring HANDOFF.md back to Claude.
7. Claude updates Notion and tells you what's next.

### Never:
- Start an agent session without a briefing from Claude
- Let an agent make architectural decisions
- Skip the HANDOFF.md update at end of session
- Let two agents work on the same files simultaneously

---

## What Each Agent Receives

### Antigravity receives:
- HANDOFF.md (always, as first message)
- Specific task brief from Claude (what to build, exact files, conventions)
- Never: product decisions, architecture changes, pricing changes

### Stitch receives:
- STITCH_BRIEF.md (design brief for the specific page/component)
- Never: the codebase, HANDOFF.md, technical details

### Google AI Studio receives:
- DATA_GENERATION_PROMPT.md (exact prompt for question generation)
- Never: the codebase

---

## Claude's Responsibilities (Lead Developer)

1. **Notion** — Update after every session. Log what was built, what broke, what's next.
2. **HANDOFF.md** — Review every HANDOFF before passing to Antigravity. Flag stale info.
3. **Architecture** — All architectural decisions go through Claude. Antigravity implements, never decides.
4. **Agent briefings** — Generate briefing files for every agent session.
5. **Product decisions** — Product pivots, feature priority, pricing — all through Claude.
6. **Code review** — When Antigravity finishes a session, Claude reviews the session log for bugs or regressions introduced.
7. **Quality gate** — Before any feature is called "done," Claude reviews the HANDOFF and confirms it matches what was asked.

---

## Current Project State

**Product:** PrepTrack v2 — AI-powered interview readiness platform
**Live URL:** https://preptrack-hazel.vercel.app
**Bot:** @PrepTrackBot
**Repo:** https://github.com/AbdulWasay0029/preptrack
**Hosting:** Render (backend + bot) + Vercel (web) + Neon PostgreSQL

**What's built:** Bot, web dashboard, 384 questions, adaptive engine, landing page, Razorpay flow
**What's being built next:** Phase 1 — Diagnostic Assessment (see PREPTRACK_V2_AGENT_PLAN.md)

**Current phase:** v2 pivot — moving from question sender to AI interview coach

---

## Notion Structure

Workspace: PrepTrack — Project Workspace
Pages:
- 📋 Product (original vision — superseded by v2)
- 🎯 Pivoted Product Vision (v2) — current vision
- 🗺️ PrepTrack v2 Roadmap — current roadmap
- 🔬 Research
- 🎨 Design
- ⚙️ Engineering
- 📊 Metrics
- 📅 Week Log
- 📐 Product Decisions & Architecture
- 📌 Task Tracker (database)
- Session logs (one page per session)

Claude updates Notion after every session. Session logs are append-only — never rewrite history.
