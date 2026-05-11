# PrepTrack — Stitch Design Brief
> Paste this entire file into Stitch before designing any PrepTrack page.
> This is maintained by Claude. Do not edit manually.

---

## Design System (Locked)

### Colors
```
Background:     #0e150e
Surface:        #1a221a
Surface High:   #242c24
Border:         #3d4a3d
Primary:        #4be277  (green accent)
Primary dim:    rgba(75,226,119,0.1)
On Primary:     #003915  (text on green buttons)
Text:           #dce5d9
Text Muted:     #bccbb9
Text Dim:       #869585
Error/Stuck:    #ef4444
Warning/Medium: #eab308
```

### Typography
- Font: Inter (primary), JetBrains Mono (code only)
- Heading large: 32px, weight 700, letter-spacing -0.02em
- Heading medium: 20px, weight 600
- Body: 16px, weight 400, line-height 1.6
- Small: 14px, weight 400
- Label/caps: 12px, weight 600, letter-spacing 0.05em, uppercase

### Spacing
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- Container max width: 1200px
- Page padding: 0 24px

### Components
- Cards: bg #1a221a, border 1px solid #3d4a3d, border-radius 4px, padding 24px
- Buttons primary: bg #4be277, color #003915, padding 12px 24px, border-radius 4px, font-weight 700
- Buttons ghost: border 1px solid #3d4a3d, color #dce5d9, same padding
- Input fields: bg #1a221a, border 1px solid #3d4a3d, color #dce5d9, padding 12px 16px, border-radius 4px
- Badges easy: bg #166534, color #4ade80
- Badges medium: bg #854d0e, color #fbbf24
- Badges hard: bg #7f1d1d, color #f87171
- Pro badge: bg #4be277, color #003915, font-size 10px, uppercase

### Tone
- Focused, minimal, technical
- Feels like a serious tool, not a startup landing page
- No gradients, no glassmorphism, no heavy shadows
- Material Symbols Outlined icon set

---

## Pages Needed (v2)

### Page 1 — Diagnostic Assessment Page (/diagnostic)

**Purpose:** User takes a 5-question timed assessment to get their readiness score.

**Layout:**
- Top bar: PrepTrack logo left, "Question X of 5" center, timer right (MM:SS, turns red under 2 minutes)
- Main area: question card (title, difficulty badge, topic tag, full problem description)
- Below question: large textarea "Describe your approach..." placeholder
- Below textarea: "Submit & Next" primary button right-aligned
- Progress bar at very top of page (thin, green, fills as questions completed)

**States to design:**
- Active question state (timer running, textarea empty)
- Timer warning state (under 2 min, timer text turns red)
- Loading state after submit (skeleton or spinner)
- Results state: score circle (big number, 0-100%), topic breakdown bars, per-question feedback cards

**Results page elements:**
- Big readiness score in a circle: green if >70, yellow if 40-70, red if <40
- "Your readiness score for [Company]"
- Topic breakdown: horizontal bars for each topic scored
- Per-question accordion: question title → expand to see response + AI feedback
- CTA: "Start Pattern Training" button

---

### Page 2 — Pattern Curriculum Page (/curriculum)

**Purpose:** Shows 15 core patterns, user progresses through them in order.

**Layout:**
- Page header: "Pattern Curriculum" + subtitle "15 patterns cover 80% of DSA interviews"
- Progress summary: "X of 15 patterns completed" with progress bar
- Grid of 15 pattern cards (3 columns desktop, 1 mobile)

**Pattern card:**
- Pattern name (e.g. "Sliding Window")
- One-line description
- "X/5 questions" progress
- Status: locked (gray), in progress (green border), completed (green checkmark)
- Locked if previous pattern not completed (linear progression)

**Pattern detail page (/curriculum/:slug):**
- Header: pattern name + "When to use this pattern" explanation box
- Problem list below: numbered, each row has title + difficulty badge + LeetCode link + "Mark Complete" button
- Sidebar (desktop): your progress, time spent, completion percentage

---

### Page 3 — Mock Interview Page (/mock)

**Purpose:** Simulated interview session with AI interviewer.

**Layout:**
- Split screen: left 45% question panel, right 55% chat panel
- Top bar: company name + role + timer (counts down from 45:00)
- Question panel: problem title, difficulty, full description, "Hints" collapsible
- Chat panel: conversation thread (interviewer messages left, user messages right)
- Bottom of chat: textarea input + Send button
- Top right: "End Interview" red ghost button

**Chat message styles:**
- Interviewer: bg #1a221a, left-aligned, "Interviewer" label above
- User: bg rgba(75,226,119,0.1), right-aligned, no label

**Post-session feedback page:**
- "Interview Complete" header
- Score card: overall rating (Hire / Maybe / No Hire)
- 4 metric cards: Approach, Communication, Complexity Awareness, Edge Cases
- Full transcript accordion
- CTA: "Practice Again" + "View Dashboard"

---

### Page 4 — Updated Dashboard (/dashboard)

**Changes from current design:**
- Replace streak card with READINESS SCORE — big circle, 0-100%, colored by range
- Add "Next Action" card — one clear recommended action
- Add "Mock Sessions" recent history section
- Keep today's questions but move to bottom
- Add curriculum progress bar

**Readiness score circle:**
- Large circle, center: percentage number (e.g. "67%")
- Below: "Ready for Amazon SDE1"
- Ring color: green >70, yellow 40-70, red <40
- Below circle: "Last assessed: X days ago" + "Retake Assessment" link

---

## What NOT to Design
- No light mode variants
- No onboarding flows (handled in code)
- No admin panel
- No mobile app screens (web only for now)

---

## Output Format
- Export as a single HTML file with Tailwind CDN
- Use the exact color values from the design system above
- Include all states (loading, empty, filled)
- Label each page/section clearly with HTML comments
- All 4 pages in one file, separated by comments
