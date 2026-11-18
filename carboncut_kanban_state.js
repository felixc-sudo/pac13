// CARBONCUT Kanban Task Manager State (CRUD Array), Filtering & Carbon Footprint Calculator

const DEFAULT_KANBAN_TASKS = [
  { id: 1, title: "Audit Scope 2 Grid Electricity Meters", date: "18/11/2026", category: "Energy", status: "pending" },
  { id: 2, title: "Contract 65% Rooftop Solar PPA Supply", date: "22/11/2026", category: "Energy", status: "pending" },
  { id: 3, title: "Electrify Last-Mile Delivery Van Fleet", date: "28/11/2026", category: "Fleet", status: "pending" },
  { id: 4, title: "Supplier Scope 3 Emissions Benchmarking", date: "15/11/2026", category: "Supply Chain", status: "progress" },
  { id: 5, title: "HVAC Smart Thermostat Optimization", date: "17/11/2026", category: "Energy", status: "progress" },
  { id: 6, title: "Retire 4.5 Tonnes Blue Carbon Mangroves", date: "10/11/2026", category: "Offsets", status: "completed" },
  { id: 7, title: "ISO-14064 Baseline Greenhouse Gas Ledger", date: "04/11/2026", category: "Offsets", status: "completed" }
];

let kanbanTasks = JSON.parse(localStorage.getItem("carboncut_kanban_v1")) || [...DEFAULT_KANBAN_TASKS];
let activeStatusFilter = "all";

function persistBoard() {
  localStorage.setItem("carboncut_kanban_v1", JSON.stringify(kanbanTasks));
}

function getCardTheme(category, status) {
  if (status === "completed") return "theme-blue";
  if (status === "progress") return "theme-pink";
  if (category === "Offsets") return "theme-amber";
  return "theme-green";
}

function todayFormatted() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// READ & RENDER BOARD
function renderBoard() {
  const searchQuery = document.getElementById("taskSearchInput").value.trim().toLowerCase();
  const catFilter = document.getElementById("categoryFilter").value;

  const statuses = ["pending", "progress", "completed"];
  statuses.forEach(st => {
    const colEl = document.querySelector(`.cc-column[data-col="${st}"]`);
    colEl.style.display = (activeStatusFilter === "all" || activeStatusFilter === st) ? "block" : "none";

    const listEl = document.getElementById(`list-${st}`);
    listEl.innerHTML = "";

    const matching = kanbanTasks.filter(t => {
      const matchSt = t.status === st;
      const matchCat = catFilter === "ALL" || t.category === catFilter;
      const matchTxt = t.title.toLowerCase().includes(searchQuery) || t.category.toLowerCase().includes(searchQuery);
      return matchSt && matchCat && matchTxt;
    });

    document.getElementById(`count-${st}`).textContent = matching.length;

    matching.forEach(task => {
      const card = document.createElement("article");
      card.className = `cc-task-card ${getCardTheme(task.category, task.status)}`;

      const moveBackBtn = task.status !== "pending"
        ? `<button type="button" class="cc-tiny-btn" title="Move Back" onclick="shiftStatus(${task.id}, -1)">&larr;</button>`
        : "";
      const moveNextBtn = task.status !== "completed"
        ? `<button type="button" class="cc-tiny-btn" title="Advance Status" onclick="shiftStatus(${task.id}, 1)">&rarr;</button>`
        : "";

      card.innerHTML = `
        <div class="cc-card-top">
          <span class="cc-card-title">${escapeHtml(task.title)}</span>
        </div>
        <span class="cc-card-date">${escapeHtml(task.date)}</span>
        <div class="cc-card-bottom">
          <span class="cc-cat-tag">${escapeHtml(task.category)}</span>
          <div class="cc-card-btns">
            ${moveBackBtn}
            ${moveNextBtn}
            <button type="button" class="cc-tiny-btn" onclick="editTask(${task.id})">Edit</button>
            <button type="button" class="cc-tiny-btn del" onclick="deleteTask(${task.id})">Del</button>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });
  });

  const completedTotal = kanbanTasks.filter(t => t.status === "completed").length;
  const pct = kanbanTasks.length ? Math.round((completedTotal / kanbanTasks.length) * 100) : 0;
  document.getElementById("sidebarProgressText").textContent = `${pct}% Net-Zero Progress (${completedTotal}/${kanbanTasks.length})`;
}

// CREATE (onclick="addTask()")
function addTask() {
  const input = document.getElementById("newTaskTitleInput");
  const title = input.value.trim();
  if (!title) {
    input.focus();
    return;
  }

  const category = document.getElementById("newTaskCategory").value;
  const status = document.getElementById("newTaskStatus").value;

  kanbanTasks.unshift({
    id: Date.now(),
    title,
    date: todayFormatted(),
    category,
    status
  });

  input.value = "";
  persistBoard();
  renderBoard();
}

function quickAddToColumn(status) {
  const title = prompt(`Add new carbon reduction card to ${status.toUpperCase()}:`);
  if (title && title.trim() !== "") {
    kanbanTasks.unshift({
      id: Date.now(),
      title: title.trim(),
      date: todayFormatted(),
      category: "Offsets",
      status
    });
    persistBoard();
    renderBoard();
  }
}

// UPDATE (Move status or Edit text)
function shiftStatus(id, dir) {
  const order = ["pending", "progress", "completed"];
  const task = kanbanTasks.find(t => t.id === id);
  if (!task) return;
  const nextIdx = Math.min(order.length - 1, Math.max(0, order.indexOf(task.status) + dir));
  task.status = order[nextIdx];
  persistBoard();
  renderBoard();
}

function editTask(id) {
  const task = kanbanTasks.find(t => t.id === id);
  if (!task) return;
  const updated = prompt("Edit carbon reduction milestone:", task.title);
  if (updated !== null && updated.trim() !== "") {
    task.title = updated.trim();
    persistBoard();
    renderBoard();
  }
}

// DELETE
function deleteTask(id) {
  kanbanTasks = kanbanTasks.filter(t => t.id !== id);
  persistBoard();
  renderBoard();
}

function filterByStatus(status, linkEl) {
  activeStatusFilter = status;
  document.querySelectorAll(".cc-nav-item").forEach(el => el.classList.remove("active"));
  if (linkEl) linkEl.classList.add("active");
  renderBoard();
}

function resetSampleBoard() {
  kanbanTasks = [...DEFAULT_KANBAN_TASKS];
  persistBoard();
  renderBoard();
}

function exportTasksJson() {
  const blob = new Blob([JSON.stringify(kanbanTasks, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "carboncut_kanban_milestones.json";
  a.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// Carbon Footprint Calculator
function calculateCarbon() {
  const kwh = Number(document.getElementById("elecKwh").value);
  const km = Number(document.getElementById("fleetKm").value);
  const ops = Number(document.getElementById("opsType").value);

  document.getElementById("elecKwhVal").textContent = kwh;
  document.getElementById("fleetKmVal").textContent = km;

  const monthly = Math.round((kwh * 0.72) + (km * 4.33 * 0.21) + ops);
  const annual = ((monthly * 12) / 1000).toFixed(2);

  document.getElementById("monthlyCo2Out").textContent = monthly;
  document.getElementById("annualCo2Out").textContent = annual;
}

function createOffsetCard() {
  const annual = document.getElementById("annualCo2Out").textContent;
  kanbanTasks.unshift({
    id: Date.now(),
    title: `Offset ${annual} Tonnes CO2e/yr Verified Carbon Portfolio`,
    date: todayFormatted(),
    category: "Offsets",
    status: "pending"
  });
  persistBoard();
  renderBoard();
  document.getElementById("kanban-workspace").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("newTaskTitleInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

calculateCarbon();
renderBoard();
