# PrepTrack — Project Management Files
> This folder contains all management, briefing, and instruction files.
> Maintained by Claude (lead developer/manager).
> Last updated: 2026-05-11

---

## Files in This Folder

| File | Purpose | Who uses it |
|------|---------|-------------|
| AGENTS.md | How agents are managed, session flow, responsibilities | Abdul + Claude |
| PREPTRACK_V2_AGENT_PLAN.md | Full technical plan for v2 build | Antigravity |
| STITCH_BRIEF.md | Design brief for all v2 pages | Stitch |
| DATA_GENERATION.md | How to expand question database | Google AI Studio |
| NOTION_INSTRUCTIONS.md | Rules for Notion documentation | Claude |
| HANDOFF.md (in repo root) | Live state of codebase for Antigravity | Antigravity |

---

## How to Start Any Work Session

### If you want to build something:
1. Tell Claude what you want
2. Claude generates a task brief
3. Paste HANDOFF.md + task brief into Antigravity
4. Antigravity builds
5. Bring updated HANDOFF.md back to Claude

### If you want new designs:
1. Tell Claude which page needs designing
2. Claude generates a Stitch brief (or points to STITCH_BRIEF.md)
3. Paste into Stitch
4. Bring the HTML output back to Claude
5. Claude gives Antigravity instructions to convert to JSX

### If you want more questions in the database:
1. Open DATA_GENERATION.md
2. Follow steps 1-4 for the company you want
3. Run the SQL on Neon
4. Tell Claude what was added so Notion gets updated

### If you want a product or architecture decision:
1. Talk to Claude. Always.
2. Claude documents the decision in Notion

---

## Current Build Priority

Phase 0 (complete): v1 stable — bot, web, database, deployment
Phase 1 (current): Diagnostic Assessment
Phase 2 (next): Pattern Curriculum
Phase 3 (upcoming): AI Mock Interview
Phase 4 (upcoming): Readiness Dashboard

Full details in PREPTRACK_V2_AGENT_PLAN.md

---

## Important Links

- Repo: https://github.com/AbdulWasay0029/preptrack
- Live web: https://preptrack-hazel.vercel.app
- Bot: @PrepTrackBot (Telegram)
- Notion workspace: PrepTrack — Project Workspace
- Render dashboard: render.com (backend + bot services)
- Vercel dashboard: vercel.com (web)
- Neon dashboard: console.neon.tech (database)
