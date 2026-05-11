# Campus Notifications System — Project Documentation

## Project Context
I was tasked with building a notification platform for students to track placements, academic results, and campus events. The primary challenge was the high volume of notifications, which often led to students missing critical updates. To solve this, I implemented a two-stage solution: a robust ranking backend and a modern React frontend.

---

# Phase 1: Smart Ranking Logic

For the first phase, I focused on the core logic for the "Priority Inbox." The idea was to create a scoring system that naturally surfaces the most important items.

### My Ranking Strategy
The algorithm uses a composite score based on two variables:

1.  **Category Importance**: I assigned weights based on the impact of the notification. Placements (3) are the most critical, followed by Results (2), and finally general Events (1).
2.  **Time Decay (Recency)**: Even a high-priority placement item should eventually yield to a brand-new result. I used a simple decay formula: `1 / (1 + age_in_seconds)`.

**Final Score Calculation:**
`Score = CategoryWeight + (1 / (1 + ageInSeconds))`

This ensures that the category always dictates the primary sort order, while recency acts as the "tie-breaker" within that category.

### Technical Implementation (Backend)
I wrote a lightweight Node.js service that:
- Fetches raw data from the evaluation API.
- Computes scores for every notification in real-time.
- Sorts the entire pool and extracts the top `N` requested by the product manager.

---

# Phase 2: React Frontend & UI Experience

With the logic working, I moved on to building the user interface. I used **React (Vite)** and **Material UI** to create a responsive, premium-feeling dashboard.

### Key UI Decisions
- **Visual Hierarchy**: I used a custom dark theme with high contrast for unread items. Once a user clicks a notification, I persist that "viewed" state in LocalStorage and dim the item slightly to keep the focus on what's new.
- **Filtering**: On the main feed, I added server-side filtering so students can quickly drill down into just results or just placements.
- **The Priority View**: I implemented a dedicated view for the Priority Inbox where users can adjust the "N" value (Top 5, 10, 20, etc.) via an interactive slider.

### Overcoming Technical Hurdles
- **CORS Challenges**: I encountered CORS issues when calling the external API directly from the browser. To fix this without compromising security, I set up a local development proxy in Vite.
- **Authentication**: I implemented a robust axios interceptor system that automatically handles token acquisition and refreshes, ensuring the user never sees a "401 Unauthorized" error.

---

# Output Verification

### Backend Service Output
Below is the output from the Node.js ranking service showing the prioritized results.
![Service Ranking Output](notification_app_be/screenshots/priority_inbox_output.png)

### Frontend Dashboard
The dashboard allows for easy navigation between the full feed and the smart priority inbox.

**Main Feed (Desktop)**
![Dashboard Feed](notification_app_fe/screenshots/fe_all_desktop.png)

**Smart Inbox (Desktop)**
![Priority Inbox](notification_app_fe/screenshots/fe_priority_desktop.png)

**Mobile View**
The app scales beautifully down to mobile devices, ensuring students can check updates on the go.
![Mobile All Feed](notification_app_fe/screenshots/fe_all_mobile.png)

---

# Final Conclusion
The project successfully bridges the gap between raw data and student needs. By combining a weighted ranking algorithm with a clean, responsive UI, we've created a tool that ensures critical campus updates are never missed.
