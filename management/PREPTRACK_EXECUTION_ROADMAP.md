# PrepTrack — Full Execution Roadmap
> For: Abdul Wasay
> Written by: Claude
> Date: 2026-05-13
> This is your complete playbook from where you are right now to a live product with paying users.

---

## WHERE YOU ACTUALLY ARE

The product direction is correct. The codebase is broken. Nothing is live in its v2 form.

You have: a working backend (v1 logic), a Telegram bot, 384 questions, a design system, a deployed URL, and a clear vision.

You don't have: a clean codebase, a working diagnostic flow, any v2 feature that a real user can actually use end to end.

The gap between where you are and your first real user is about 2-3 weeks of clean, focused building. The gap between your first real user and ₹499/month revenue is another 2-3 weeks after that.

Everything in this document is ordered. Do not skip ahead.

---

## STAGE 0 — CLEAN THE MESS (2-3 days)

This is not optional. Building on a broken foundation guarantees more chaos.

**Step 1: JSX/TSX cleanup**

Give Antigravity the PRD (PREPTRACK_PRD_FOR_ANTIGRAVITY.md). Tell it to do only the cleanup task in Section 5. Nothing else.

The output you want: `npm run build` from `/web` passes with no errors. All .tsx files are gone. App.jsx imports are clean.

Verify it yourself — open the live URL after pushing, confirm the landing page and dashboard still load.

**Step 2: Gemini in frontend check**

Look at the current frontend pages from the Google AI Studio build. If you see any `import { GoogleGenerativeAI }` or any Gemini API calls in any .jsx file, flag it in your brief to Antigravity and tell it to move those calls to backend routes first.

**Step 3: Commit the design system**

Make sure tailwind.config.js has the design system from Section 4 of the PRD. If it doesn't, that's part of the cleanup task.

---

## STAGE 1 — DIAGNOSTIC ASSESSMENT (5-7 days)

This is the only feature that matters right now. Everything else is parked until this works end to end.

**What "done" means for Phase 1:**

A student you don't know can open PrepTrack on their phone, sign in, tap "Take Assessment," answer 5 questions about their approach, and see a readiness score with topic feedback. No broken states, no loading spinners that never resolve, no blank screens.

**How to build it:**

Brief Antigravity on Phase 1 (Section 6 of the PRD). Tell it to build backend first, then frontend. Give it HANDOFF.md plus the PRD.

Watch for these specific failure modes:
- Gemini API timing out (add a 30-second timeout and a graceful error message: "Scoring took too long, your answer was saved")
- Empty response from Gemini (always validate JSON before parsing)
- Timer not resetting between questions (each question gets a fresh 5-minute timer)

After Antigravity finishes: test it yourself before showing anyone. Go through the full flow. Take all 5 questions. Deliberately leave one blank and see what happens. Submit a garbage response ("asdfghjkl") and see if Gemini handles it gracefully.

**What to do after it works:**

Send it to 3 actual CS students in CMRIT. Not your best friends — students who are actually preparing for placements. Watch them use it. If you can, sit with them. Don't explain anything — see where they get confused.

The specific things you want to learn:
- Do they understand what the score means?
- Do they read the per-question feedback?
- Do they know what to do after seeing their results?

This feedback directly shapes how you build Phase 2.

---

## STAGE 2 — PATTERN CURRICULUM (7-10 days)

Don't start this until at least 5 students have completed the diagnostic and you've read their feedback.

**What "done" means for Phase 2:**

A student can open the Curriculum page, see the 15 patterns in order with their progress, click into Sliding Window, see the 5 problems, open them on LeetCode in a new tab, and mark them complete when done. Their progress is saved and shows on the dashboard.

**The one thing that makes this feature feel real vs. feel like a list:**

The lock mechanism. Patterns 2-15 are locked until the previous pattern is completed. This creates a sense of progression and makes the user feel like they're working through something meaningful, not just browsing a question bank. Do not remove this even if it feels "restrictive." Restriction is the feature.

**Brief Antigravity on Phase 2 (Section 7 of the PRD) after Phase 1 is stable.**

---

## STAGE 3 — PRICING AND MONETIZATION (run parallel to Stage 2)

Before you build the mock interview, you need to know what you're selling and what's free. Because the mock interview is the paywall.

**Free tier:**
- Diagnostic assessment (unlimited retakes)
- Curriculum patterns 1-5 (first 5 patterns unlocked)
- Dashboard with readiness score

**Paid tier (₹499/month):**
- All 15 curriculum patterns
- Mock Interview (unlimited sessions)
- Company-specific diagnostic (you currently only have generic — paid unlocks Amazon, Google, etc.)
- Detailed AI feedback on all mock sessions

**Why this structure:**

The free tier is genuinely useful. A student can take the diagnostic and do the first 5 patterns without paying. This creates real value that builds trust. The jump to paid is motivated by wanting to finish the curriculum and especially wanting to practice the actual interview — which is the scary part for most students.

Razorpay is already integrated. When Phase 3 is built, adding the paywall is a one-sprint task.

---

## STAGE 4 — AI MOCK INTERVIEW (7-10 days, paid feature)

This is the differentiator. No other free platform offers a conversational AI interviewer with real-time follow-up questions. This is the thing that makes PrepTrack worth ₹499.

**Brief Antigravity on Phase 3 (Section 8 of PRD) after Phase 2 is stable.**

Watch for these specific failure modes:
- Conversation getting stuck (Gemini not responding) — add a retry mechanism
- Final assessment never triggering — add a "force end" button that generates feedback from transcript even if Gemini didn't output FINAL_ASSESSMENT
- Mobile keyboard covering the input field — make sure the input is truly pinned to bottom and the chat scrolls above it

**What to do after it works:**

This is your public launch trigger. Once mock interviews work, you have a complete product. Time to charge.

---

## STAGE 5 — READINESS DASHBOARD UPDATE (2-3 days)

Brief Antigravity on Phase 4 (Section 9 of PRD). This is a single-sprint update to the existing dashboard page. It cannot be built before Phase 3 because it depends on mock session data.

---

## STAGE 6 — LAUNCH (after Stage 5)

**The sequence:**

Day 1: Deploy everything. Make sure the full loop works (sign up → diagnostic → curriculum → mock → dashboard).

Day 2: Enable Razorpay. The free tier is live automatically. Paid features are gated by subscription status in the backend.

Day 3-7: 50 users. Not from Instagram, not from Reddit, not from LinkedIn cold messages. From these specific places:
- CMRIT WhatsApp placement prep groups
- Your batchmates directly
- Any 3rd/4th year students you know who are actively placed-hunting
- CMRIT's placement cell (email them, offer free access for placement cell members in exchange for feedback and word of mouth)

The message is dead simple: "I built a tool that tells you honestly if you're ready for Amazon/Google/Flipkart interviews. It's free to try. Take the 5-minute diagnostic." No pitch, no feature list. One sentence about what it does for them.

**The first paying user target: 10 paid users within 30 days of launch.**

At ₹499/month, 10 users is ₹4,990/month. That's not money — that's proof. Proof that strangers will pay for something you built. That is the signal that tells you to keep building.

---

## STAGE 7 — DISTRIBUTION (after first 10 paying users)

Only think about distribution after you have 10 paying users. Before that, it's a distraction. You don't need reach, you need proof.

After 10 paying users, in order of priority:

**1. Telegram community**

Create a PrepTrack Telegram channel (not just the bot). Post weekly: "Student from [college] just hit 78% readiness for Amazon using PrepTrack. Here's what their diagnostic showed and what they worked on." Real results with permission. This costs zero and builds trust with the exact audience.

**2. LinkedIn**

Post the CodeSync-style story but about PrepTrack. Not "I built an app." The story of the pivot — "I started building a LeetCode bot. Then I asked myself: do I actually use this? No. Here's what I actually needed." This performs because it's honest and it's about a relatable problem.

**3. Reddit r/developersIndia and r/cscareerquestions**

Wait until you have at least 20 real testimonials. Post a case study: "My tool evaluated 50 students' interview readiness. Here's what we found about tier-2 college prep gaps." Data-first, not product-first. Provide value in the post itself.

**4. College partnerships**

Email placement officers at tier-2 engineering colleges in Hyderabad, Pune, Chennai. Offer free bulk access (50 students) in exchange for a testimonial and referral. One college saying "we recommend PrepTrack" is worth more than 1000 Instagram followers.

**5. Zain collab**

When you reach out to Zain (you said May was the target), the angle is simple: PrepTrack has a distribution problem. Zain has distribution but not a product. The pitch isn't "help me promote my app." The pitch is "I have something real that helps students. Let's figure out the right format to reach your audience." Don't ask him to post about PrepTrack. Ask him what format would work for his audience. He knows his audience better than you do.

---

## THE OPERATING CADENCE

Every build session follows this sequence:
1. Come to Claude. Describe what you want to build.
2. Claude writes the brief for Antigravity.
3. Paste HANDOFF.md + brief into Antigravity.
4. Antigravity builds. Brings back updated HANDOFF.md.
5. You bring HANDOFF.md to Claude.
6. Claude reviews it, updates Notion, writes the next brief.

Every week, one check-in with Claude that answers three questions:
- What got shipped?
- What did users say?
- What's the next most important thing?

Everything else is noise.

---

## THE HONEST ASSESSMENT OF YOUR SITUATION

You're a 2nd year student who has built a live product with 384 questions, a working backend, real deployment, and a product vision that is correct. Most people building "AI startups" in 2026 don't have a deployed product with real infrastructure. You do.

The risk is not technical ability. The risk is the pattern you already know about yourself: you ignite when there's external pressure (Akshay collab, hackathon context) and slow down when the anchor disappears.

PrepTrack doesn't have an Akshay. There's no competition deadline, no external validator, no one watching. This means you have to create your own forward pressure.

The mechanism that works for this product specifically: commit to showing it to 3 real students by a fixed date. Not "soon." A date. Real students using your product creates the external pressure you need better than any self-discipline system. The moment a student tells you "this helped me understand where I'm weak," that's the signal that reactivates your motivation. Get to that signal as fast as possible.

The fastest path to that signal: clean codebase → working diagnostic → 3 students → their feedback.

Everything else follows from there.
