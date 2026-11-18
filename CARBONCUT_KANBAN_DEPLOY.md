# CARBONCUT — Carbon Reduction Kanban Task Manager & Footprint Hub

Static web application demonstrating a **JavaScript Kanban Task Manager** (sidebar navigation, live search/scope filtering, 3 status columns: *Pending*, *In Progress*, *Completed*, JSON export, and full CRUD task management), paired with an interactive Carbon Footprint Tracking Calculator.

## Files Included
- `index.html` — Root HTML entry point for GitHub Pages and Vercel.
- `carboncut_kanban_board.css` — Responsive dark-navy sidebar + 3-column pastel Kanban board stylesheet.
- `carboncut_kanban_state.js` — CRUD task state array (`addTask()`), column transitions, search/scope filters, JSON export, and carbon calculator.
- `vercel.json` — Zero-config Vercel static deployment configuration.

## GitHub & Vercel Deployment Steps
1. Extract `carboncut_kanban_taskboard.zip` and open a terminal inside `carboncut_kanban_taskboard`.
2. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Add CARBONCUT Kanban task manager website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/carboncut-kanban-taskboard.git
   git push -u origin main
   ```
3. Open [vercel.com](https://vercel.com), click **Add New → Project**, import `carboncut-kanban-taskboard`, keep Framework Preset as **Other**, and click **Deploy**.
