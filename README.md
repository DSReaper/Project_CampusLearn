# Project_CampusLearn

## Functional Requirements for CampusLearn™
- ### 1. User Management & Authentication (Mobile-Optimized)
    - FR1.1: One-Tap Login: Integrate with the student's @belgiumcampus.ac.za Google account for seamless, secure authentication without remembering passwords.

    - FR1.2: Swipeable Profiles: Student and tutor profiles should be easy to view and edit on a mobile screen, with sections in swipeable cards.

    - FR1.3: Lector Directory: A searchable, filterable list of lecturers. Tapping a lecturer's card reveals their contact details, modules, and a one-tap option to email them or view their current class' location on the campus map.

- ### 2. Topic & Content Management (Thumb-Friendly)
    - FR2.1: Large Subscribe Buttons: Easy-to-tap buttons to subscribe to modules and topics.

    - FR2.2: Mobile-Optimized Uploads: Tutors can easily upload resources from their phone's gallery, camera, or cloud storage (Google Drive, OneDrive). The system automatically optimizes images and videos for mobile data usage.

- ### 3. Forums & Communication (Chat-Focused Interface)
    - FR3.1: Module Hubs as Chat Channels: The primary interface for each module should feel like a modern messaging app (e.g., WhatsApp, Discord).
        - Main Channel: For general module announcements and discussions.
        - Boss Fight Channels: Dedicated channels for specific tough assignments or exam topics (e.g., "#PROG6211-Final-Boss-Exam").
        - Study Group Channels: Student-created, temporary channels for group projects.
        - FR3.2: Inline Media & Reactions: Students can share screenshots, code snippets, or photos of notes directly in the chat. Use emoji reactions for quick feedback on messages.

    - FR3.2: @Mentions: Use @username to mention peers or tutors to grab their attention, generating a push notification for them.

- ### 4. Notifications
    - FR4.1: Email as Primary Notification Channel: The system shall use email to @belgiumcampus.ac.za addresses as the primary method for all real-time alerts and communications. No standalone push notifications or SMS/WhatsApp APIs are required.

    - FR4.2: Notification Preferences: Users can finely tune what triggers a push notification (e.g., only when @mentioned, new direct messages, or responses to their questions).

- ### 5. AI-Powered Chatbot (Floating Action Button)
    - FR5.1: The AI chatbot should be accessible via a persistent, floating circular button at the bottom corner of the screen, mimicking popular mobile apps.

    - FR5.2: Chat history with the AI tutor should be saved and synced across the user's devices.

- ### 6. Mobile-Specific General Features
    - FR6.1: Interactive Campus Map: A touch-friendly, zoomable map integrated with the device's GPS to provide "blue dot" navigation showing the user's current location on campus.

    - FR6.2: System-Wide Dark Mode: The theme toggle should switch the entire PWA to a true dark mode to save battery on OLED mobile screens and reduce eye strain.

- ### 7. Navigation & Performance (Crucial for Mobile)
    - FR7.1: Bottom Navigation Bar: The primary navigation should be a standard bottom bar with icons for: Home, Messages, Modules, Map, Profile. This is easily reachable with one's thumb.

    - FR7.2: Gesture Navigation: Support for common gestures like swipe-to-go-back and pull-to-refresh lists and feeds.

    - FR7.3: Optimized Performance: The website must be built for speed on mobile networks, with lazy-loaded images and efficient data usage to prevent slow performance on campus Wi-Fi.

## Out of Scope for Initial Release (v1.0)
The following features, while valuable, are explicitly excluded from the initial project scope to ensure a focused and deliverable first version of the platform.

### Gamification Features:
- Experience Points (XP) & Leveling System
- Badges, Achievements, and Trophies
- Global and Module-Specific Leaderboards
- "Boss Fight" Challenges with unique rewards
- A virtual economy or currency system (e.g., CampusCoins)
- A Reward Shop for spending virtual currency
- A detailed statistical progression dashboard(Leaderboard)

### Application Distribution:
Development and distribution of a native iOS mobile application through the Apple App Store.
Development and distribution of a native Android mobile application through the Google Play Store.
Development and distribution of a native Desktop application for Windows or macOS.

## Non-Functional Requirements for CampusLearn™

### 1. Performance
- **NFR-P1 (Load Speed):**  
  The app must load and become interactive within **4 seconds on 4G** and **2 seconds on campus Wi-Fi**.  
  *Rationale:* Campus Wi-Fi and mobile data may be unstable; students need fast access for real-time learning.  
  *Measure:* Verified with Lighthouse performance audits under "Slow 4G" emulation.

- **NFR-P2 (API Latency):**  
  API calls must complete within **300 ms for reads** and **600 ms for writes** at the 95th percentile.  
  *Rationale:* Chat-like experience requires near real-time responsiveness.  
  *Measure:* Load testing and monitoring tools must confirm latency thresholds.

---

### 2. Availability
- **NFR-A1 (Uptime):**  
  Core services (Authentication, Chat, Notifications) must achieve **99.5% uptime per month**.  
  *Rationale:* Students rely on CampusLearn during critical periods such as exams.  
  *Measure:* Uptime dashboards and SLA reports.

- **NFR-A2 (Maintenance Notifications):**  
  All planned maintenance must be communicated at least **24 hours in advance** to users.  
  *Rationale:* Ensures transparency and avoids disruption during classwork and assignments.  
  *Measure:* System-wide banner/email notification logs.

---

### 3. Security & Privacy
- **NFR-S1 (Encryption in Transit):**  
  All communication must use **TLS 1.2+** to protect sensitive student and tutor information.  
  *Measure:* SSL Labs security tests must show grade **A or higher**.

- **NFR-S2 (Encryption at Rest & POPIA):**  
  Personal data must be encrypted at rest and processed in compliance with **POPIA**.  
  *Measure:* Database encryption enabled; audits confirm POPIA compliance.

- **NFR-S3 (Vulnerability Management):**  
  No **high-severity vulnerabilities** from OWASP Top-10 should remain unresolved.  
  *Measure:* Quarterly penetration tests and vulnerability scans.

---

### 4. Usability & Accessibility
- **NFR-U1 (Accessibility Standards):**  
  The system must meet **WCAG 2.2 AA** standards, including screen reader support, captions, and proper contrast ratios.  
  *Measure:* Accessibility audit with ≤ 3 minor findings.

- **NFR-U2 (Mobile Ergonomics):**  
  Provide **thumb-friendly navigation**, with key buttons and bottom nav bar within **600px of screen bottom** for easy reach.  
  *Measure:* Usability testing on 6–6.8" devices.

- **NFR-U3 (Dark Mode):**  
  A true dark mode must be available system-wide, avoiding pure white flashes when switching themes.  
  *Measure:* Visual regression tests ensure consistent dark mode behavior.

---

### 5. Scalability
- **NFR-SC1 (Elastic Load Handling):**  
  The system must scale to handle **5× the expected weekly peak user load** without performance degradation.  
  *Rationale:* To prepare for exam week or unexpected surges in usage.  
  *Measure:* Load tests simulate 5× peak traffic with ≤ 500 ms API latency.

- **NFR-SC2 (Database Scaling):**  
  Databases must scale horizontally to support growing student/tutor content without downtime.  
  *Measure:* Monitoring confirms storage costs and performance within ±10% of forecasts.

---

### 6. AI Chatbot (Quality & Safety)
- **NFR-AI1 (Response Accuracy):**  
  The chatbot must provide **≥ 85% helpful/relevant accuracy** on a 50-question test dataset.  
  *Measure:* Evaluations conducted quarterly with curated academic queries.

- **NFR-AI2 (Fallback Safety):**  
  If chatbot confidence falls below a threshold, it must **escalate to a tutor or support staff**.  
  *Measure:* 100% of low-confidence queries routed appropriately in test scenarios.

- **NFR-AI3 (Data Privacy):**  
  Chat history must not store sensitive data beyond session scope unless **explicit consent** is given by the student.  
  *Measure:* Security audit ensures no unauthorized data retention.

