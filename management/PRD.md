# Product Requirements Document (PRD) - PrepTrack V2

## 1. Product Vision
PrepTrack is an AI-powered interview readiness platform designed specifically for Indian Computer Science students who are preparing for campus placements or off-campus interviews. Unlike traditional platforms that focus solely on solving random questions, PrepTrack acts as a personalized interview coach. It helps students understand their current readiness level, identify weak areas, and practice under realistic interview conditions.

## 2. Target Audience
*   **Primary User**: Indian CS students who are roughly 3 months away from placement season (serious preparation mode).
*   **Pain Points**:
    *   Not knowing if they are at the level companies expect.
    *   Difficulty staying consistent with Data Structures and Algorithms (DSA).
    *   Struggling to come up with solutions to unseen problems.
    *   Anxiety and hesitation regarding the actual interview experience.

## 3. Core Features & User Flow

### 3.1. Pattern-Based Curriculum (The Primary Focus)
*   **Objective**: Move users away from memorizing solutions and towards pattern recognition by showing them exactly what to study and in what order.
*   **Flow**:
    *   On first entry, the user sees a **0% Readiness Score** (or "Not Assessed").
    *   The primary view is the curriculum, organized around 15 core DSA patterns (e.g., Sliding Window, Two Pointers).
    *   Each pattern has a structured set of problems ordered from easy to hard.
    *   Users progress through patterns to build confidence and skill.

### 3.2. Diagnostic Assessment (Secondary/Optional)
*   **Objective**: Give users an honest assessment of where they stand when they are ready for it.
*   **Flow**:
    *   User can opt-in to take a 20-minute diagnostic test consisting of 5 questions.
    *   User explains their approach and provides time/space complexity.
    *   The AI evaluates the responses and updates the **Readiness Score**.
    *   This helps personalize the curriculum recommendations further.

### 3.3. AI Mock Interview (The Differentiator)
*   **Objective**: Simulate the pressure and interaction of a real technical interview.
*   **Flow**:
    *   A timed session where a problem is presented.
    *   The user interacts with an AI interviewer via a chat interface.
    *   At the end, the user receives detailed feedback.


### 3.4. Readiness Dashboard
*   **Objective**: Provide a single source of truth for the user's progress.
*   **Flow**:
    *   Displays the current Readiness Score for the target company.
    *   Highlights the "Next Action" (e.g., "Complete Sliding Window pattern").
    *   Shows recent mock interview results and statistics.

## 4. System Architecture & Tech Stack
*   **Frontend**: React (Vite) - Mobile-first design but responsive for desktop (especially for Mock Interviews).
*   **Backend**: Node.js/Express.
*   **Database**: (Assumed existing schema for users and questions).
*   **AI Layer**: Google Gemini 1.5 Flash (via Google AI Studio) for free-tier usage. Used for scoring diagnostics and simulating mock interviews.
*   **Messaging**: Telegram Bot.
    *   **Role**: Acts purely as a notification and re-engagement layer (e.g., "Time for your daily mock session!"). It is NOT the primary platform.

## 5. Key Decisions & Open Questions
*   **Decision**: Switched from Anthropic API to Gemini API to avoid costs during development and early scaling.
*   **Decision**: The Web App is the primary interface; the Telegram bot is secondary.
*   **Decision**: Decouple the login from the Telegram bot link to allow direct web sign-ups.
*   **Open Question**: How exactly should the user link their Telegram account with the web app without feeling "hacky"?
*   **Open Question**: How to handle the transition from the diagnostic results to the curriculum smoothly?
*   **Open Question**: How to reduce drop-off during the 20-minute Diagnostic Assessment for new users?

