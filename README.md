# 🗳️ ElectWise — Your Smart Election Guide

ElectWise is a lightweight, interactive, and educational web application built to simplify the U.S. election process. It provides users with a clear, step-by-step roadmap to voting and features a dynamic, real-time AI assistant powered by Google Gemini.

---

## 🏆 Chosen Vertical
**Civic Education / Government & Public Service**

The democratic process can often seem complex and intimidating to first-time voters or those unfamiliar with the system. This project directly addresses that challenge by providing a highly accessible, step-by-step guide and a neutral, AI-powered assistant. ElectWise is designed to educate citizens on voter registration, electoral timelines, key concepts (like the Electoral College), and post-election certification, ultimately promoting higher civic engagement and informed voting.

---

## 🧠 Approach and Logic
Our primary goal was to create an application that is **lightning-fast, highly accessible, and strictly secure**, without relying on heavy frontend frameworks like React or Angular. This ensures the entire repository remains incredibly lightweight (under 100 KB) while delivering a premium user experience.

### Key Architectural Decisions:
1. **Vanilla Single Page Application (SPA):** Built entirely with pure HTML5, CSS3, and ES6 JavaScript. This eliminates the need for a build step, reduces load times to milliseconds, and ensures broad compatibility.
2. **Modular Design:** The application logic is separated into distinct functional areas (Navigation, UI State, Accessibility, API Integration, and Analytics) within a single `app.js` file for easy maintainability.
3. **Hybrid AI Architecture:** The assistant uses a two-tiered approach to conserve API quota and ensure speed. It first checks a local, custom knowledge base for common questions (instant, zero-cost responses). If the query is complex, it automatically routes the request to the Gemini API.

---

## ⚙️ How the Solution Works

### 1. User Interface & Experience
Upon opening `index.html`, the user is greeted with a modern, responsive interface featuring a custom AI-generated hero banner for a premium SaaS feel.
- **Timeline & Steps:** Scroll animations and interactive tabs guide the user through the 4 phases of voting. The timeline features dynamic, large-scale watermark numbers with smooth scaling hover effects.
- **FAQ (Masonry Grid):** A beautiful multi-column CSS Masonry layout automatically organizes accordion questions to maximize wide-screen real estate efficiently.

### 2. The Dynamic AI Assistant
The core of ElectWise is the "Ask AI" chat interface.
- **Hybrid Resolution:** The logic first checks a robust static knowledge base. If the answer isn't available locally, it calls the **Google Gemini API** (`gemini-2.5-flash`) via a REST `fetch` request.
- **Prompt Engineering:** The system prompt forces the AI to adopt the persona of a "helpful, neutral, non-partisan assistant explaining the US election process," ensuring safe and relevant answers.
- **Efficiency Layer:** To optimize resource usage, all queries and responses are stored in a local JavaScript `Map()` cache. If a user asks the same question twice, the app retrieves the answer instantly from memory, saving API tokens and reducing latency.

### 3. Google Services Integration
- **Google Gemini API:** Drives the core conversational intelligence.
- **Google Analytics (GA4):** Custom events are dispatched (`trackEvent`) when users navigate sections, open FAQs, or interact with the chat, providing valuable insights into user engagement.
- **Google Fonts & Material Icons:** Utilized for a clean, professional aesthetic.

---

## 🔒 Security, Testing, & Accessibility

### Security
- **Content-Security-Policy (CSP):** A strict CSP meta tag is implemented to prevent Cross-Site Scripting (XSS) and unauthorized external scripts.
- **Input Sanitization:** All user inputs in the chat are strictly sanitized (HTML entities escaped) before being rendered to the DOM to prevent injection attacks.
- **API Key Management:** API keys are never hardcoded in the public repository. They are accepted via a secure UI modal and stored temporarily in the browser's `sessionStorage`.

### Accessibility (WCAG AA Compliant)
- Semantic HTML tags (`<header>`, `<main>`, `<nav>`) and ARIA labels are used throughout.
- Keyboard navigation is fully supported with visible focus rings (`:focus-visible`).
- A hidden "Skip to content" link is provided for screen reader users.

### Testing
- A lightweight, inline testing suite (`tests.js`) is included. 
- **How to run:** Append `?test=true` to the application URL in your browser and open the Developer Console to view the automated test results for the sanitizer, cache, and navigation logic.

---

## 📌 Any Assumptions Made
1. **Scope:** The application content currently assumes the context of the United States federal election cycle. However, the modular architecture and dynamic AI mean it can be easily adapted for local, state, or international elections.
2. **Environment:** The user is operating a modern web browser capable of utilizing the `fetch` API and `sessionStorage`.
3. **Execution:** The core educational content and basic offline AI chat work entirely without external dependencies. To unlock the dynamic, live AI responses securely, this application uses a Vercel Serverless Function (`api/chat.js`). The evaluator should configure the `GEMINI_API_KEY` in Vercel's Environment Variables during deployment to ensure the API key remains securely hidden from the frontend.

---

## 📂 File Structure
- `index.html` — The main structure, UI, and CSP headers.
- `style.css` — Custom styling, animations, and accessibility focus states.
- `app.js` — Core application logic, Gemini API client, and offline fallback.
- `tests.js` — Automated unit test suite.
- `.gitignore` — Ensures sensitive files (like local config or .env) are never pushed to the repository.
