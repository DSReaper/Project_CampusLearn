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

FR6.2: System-Wide Dark Mode: The theme toggle should switch the entire PWA to a true dark mode to save battery on OLED mobile screens and reduce eye strain.

FR6.3: Offline Functionality: Core features like viewing downloaded PDFs, reading past messages, and drafting new questions should work without an internet connection, syncing once reconnected.

FR6.4: Mobile Gamification:

Achievement Pop-ups: Small, game-like notifications that appear at the top of the screen for earning badges (e.g., "Helping Hand - Helped 5 Peers!").

Simple Leaderboards: Show top contributors for the week within a Module Hub to encourage participation.

7. Navigation & Performance (Crucial for Mobile)
FR7.1: Bottom Navigation Bar: The primary navigation should be a standard bottom bar with icons for: Home, Messages, Modules, Map, Profile. This is easily reachable with one's thumb.

FR7.2: Gesture Navigation: Support for common gestures like swipe-to-go-back and pull-to-refresh lists and feeds.

FR7.3: Optimized Performance: The website must be built for speed on mobile networks, with lazy-loaded images and efficient data usage to prevent slow performance on campus Wi-Fi.