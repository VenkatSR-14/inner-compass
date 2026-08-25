# Inner Compass: MVP Development Work Plan

This 4-week work plan focuses on delivering a functional web prototype with the core differentiator: cognitive framing, strict practice execution, and intent-driven tracking.

---

### Sprint Overview

| Phase | Focus Area | Deliverable |
| --- | --- | --- |
| **Week 1** | Foundation & Auth | DB schema, server authentication, layout shell, practice content seeding |
| **Week 2** | The Practice State Engine | 4-step practice flow, discipline enforcement, audio playback engine |
| **Week 3** | Analytics & Community Shell | Subjective check-in dashboards, streak calculator, community feed shell |
| **Week 4** | Polish, Security & Alpha Test | Security audit, end-to-end testing, responsive mobile UI, closed alpha launch |

---

### Detailed Task Breakdown

**Week 1: Foundations & Architecture**

* **Database & ORM:** Set up standard managed PostgreSQL (e.g., Neon or Supabase) with Drizzle/Prisma ORM.
* **Schema Definition:** Implement tables for `users`, `practices`, `curriculum_modules`, and `practice_sessions`.
* **Auth & Security:** Configure secure server-side session management (Auth.js/Clerk/Supabase Auth) with protected route middleware.
* **Content Seeding:** Seed initial structured practice data (e.g., 2 classical foundational modules with "Why" video/text scripts and audio tracks).

**Week 2: The Core Practice State Machine**

* **Step 1 ("Why" Module):** Build the mandatory 60–90 second cognitive context player before practice unlocks.
* **Step 2 (Intent Anchoring):** Implement the intent-setting modal (*Equanimity*, *Clarity*, *Somatic Grounding*).
* **Step 3 (Practice Engine):** Build the custom audio player with breath centering calibration and countdown timers.
* **Discipline Enforcer:** Add `visibilitychange` window listeners to trigger warnings or session resets on tab-switching.
* **Step 4 (Post-Session Check-in):** Build subjective 1-tap rating sliders for calm, clarity, and contentment.

**Week 3: Dashboard & Community Layer**

* **Server Actions & API:** Implement secure server endpoints to record practice session completions and subjective metrics.
* **Intellect Dashboard:** Build user dashboard rendering practice streaks, session logs, and qualitative recovery trends over time.
* **Community Intent Feed:** Create the shared feed component displaying completed sessions (user, practice type, chosen intent, and duration).
* **Moderation Baseline:** Set up server-side input sanitization and reporting flags for community posts.

**Week 4: Hardening & Alpha Deployment**

* **Security & Access Control:** Verify database-level isolation so users can strictly query and mutate only their own private session records.
* **Mobile-Responsive Optimization:** Ensure audio player controls, timers, and layout perform seamlessly on mobile browser viewports.
* **Error Handling & State Recovery:** Handle dropped network connections gracefully during audio playback.
* **Deployment:** Deploy web client on Vercel/Cloudflare and conduct closed testing with 10–20 practitioners.

---

### Immediate Action Item

To kick off **Week 1**, the first step is bootstrapping the repository and defining the database schema.