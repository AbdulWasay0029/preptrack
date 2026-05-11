# PrepTrack — Notion Update Instructions
> Every agent that touches this project must follow these rules.
> Claude enforces this. Do not skip.

---

## The Rule

Every session that produces a code change, design decision, or product decision must be logged in Notion.

Claude handles all Notion updates. Agents do NOT update Notion directly.
Agents update HANDOFF.md. Claude reads HANDOFF.md and updates Notion.

---

## What Gets Logged (Every Session)

At minimum, every session log must contain:

1. Date and agent name
2. What was built or changed (file by file if significant)
3. What was broken or introduced as a bug
4. What was fixed
5. What's still pending or blocked
6. Any decisions made (architectural, product, design)

## What Does NOT Get Logged

- Emotional context ("user was frustrated")
- Speculation ("this might work better if...")
- Duplicate information already in HANDOFF.md

---

## Notion Page Types

### Session Logs (append only)
One page per session. Never edit a past session log.
Title format: `YYYY-MM-DD — [Description]`
Example: `2026-05-11 — Diagnostic Assessment Build`

### Living Documents (update in place)
- ⚙️ Engineering — update when stack or architecture changes
- 📐 Product Decisions & Architecture — update when decisions are made
- 🗺️ PrepTrack v2 Roadmap — update when phases complete or change
- 📊 Metrics — update weekly with real numbers

### Never Rewrite
- Session logs
- Past decisions
- Bug logs

---

## How Claude Updates Notion

After Abdul brings HANDOFF.md to Claude:

1. Claude reads the full HANDOFF
2. Creates a new session log page with what was done
3. Updates Engineering page if stack changed
4. Updates Product Decisions if any decisions were made
5. Updates Roadmap if a phase was completed
6. Tells Abdul what's next

This happens every session without Abdul having to ask.
