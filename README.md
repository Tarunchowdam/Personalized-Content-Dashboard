# Personalized Content Dashboard

**Live Demo:** [https://your-demo-link.com](https://your-demo-link.com)

**Demo Video:** [https://your-demo-video-link.com](https://your-demo-video-link.com)

A modern, fully responsive dashboard for tracking and interacting with personalized news, movie recommendations, and social posts. Built with Next.js, React, TypeScript, Redux Toolkit, and Tailwind CSS.

---

## 🚀 Features

- **Personalized Feed:** Unified feed of news, movies, and social posts based on user preferences.
- **User Preferences:** Configure favorite categories, language, notifications, dark mode, and profile info in a settings modal.
- **API Integration:** Fetches real or mock data from NewsAPI, TMDB, and a mock social API.
- **Interactive Cards:** Each content card features images, headlines, descriptions, and CTAs ("Read More", "Play Now").
- **Infinite Scroll & Pagination:** Efficiently loads more content as you scroll or via "Show more" buttons.
- **Drag-and-Drop:** Reorder content cards and favorites with smooth drag-and-drop.
- **Trending & Favorites:** Dedicated sections for trending items and user favorites (expand/collapse, drag-and-drop, clickable).
- **Search:** Debounced, cross-category search with infinite scroll for results.
- **Dark Mode:** Toggle dark/light mode, persisted across sessions.
- **Notifications:** Visual toasts and a dropdown notification center.
- **Responsive Design:** Works beautifully on mobile, tablet, and desktop.
- **Testing:** Unit, integration, and E2E tests (Jest, React Testing Library, Cypress).

---

## 📸 Demo

- **Live Demo:** [your-live-link-here]
- **Demo Video:** [your-demo-video-link-here]

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **State Management:** Redux Toolkit, Redux Persist
- **Styling:** Tailwind CSS, Framer Motion
- **Testing:** Jest, React Testing Library, Cypress
- **APIs:** NewsAPI, TMDB, mock social API

---

## ⚙️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/personalized-content-dashboard.git
cd personalized-content-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root:
```
NEXT_PUBLIC_NEWS_API_KEY=your-news-api-key
NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
```
> You can use mock data if you don’t have real API keys.

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

- **Unit/Integration Tests:**
  ```bash
  npm run test
  ```
- **E2E Tests (Cypress):**
  ```bash
  npm run cypress:open
  ```

---

## 📁 Project Structure

```
/components      # UI and dashboard components
/store           # Redux slices and store setup
/lib             # API logic
/pages or /app   # Next.js routing
/types           # TypeScript types
/utils           # Helpers and utilities
/tests           # Unit/integration tests
/cypress         # E2E tests
```

---

## ✨ Customization & Extensibility
- Add more APIs (e.g., Spotify, Twitter) in `/lib/api.ts`.
- Extend user settings (multi-language, privacy, etc.).
- Add more tests for new features.
- Deploy to Vercel/Netlify for a live demo.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License
[MIT](LICENSE)

---

## 🙏 Acknowledgements
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Cypress](https://www.cypress.io/)
- [Jest](https://jestjs.io/)
- [TMDB](https://www.themoviedb.org/)
- [NewsAPI](https://newsapi.org/) 