const MONTH_NAMES = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const MONTH_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / 86400000);
}

function render() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();          // 0-11
  const date = now.getDate();            // 1-31
  const totalDaysInYear = isLeapYear(year) ? 366 : 365;
  const dayOfYear = getDayOfYear(now);   // 1-based
  const daysLeftInYear = totalDaysInYear - dayOfYear;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // ---- Card 1: Year dot grid ----
  const yearGrid = document.getElementById("year-grid");
  yearGrid.innerHTML = "";
  for (let i = 0; i < totalDaysInYear; i++) {
    const dot = document.createElement("div");
    dot.className = "dot " + (i < dayOfYear ? "elapsed" : "remaining");
    yearGrid.appendChild(dot);
  }

  document.getElementById("year-number").textContent = year;
  document.getElementById("year-days-left").textContent =
    daysLeftInYear + " days left";

  // ---- Card 2: Month labels ----
  const monthGrid = document.getElementById("month-grid");
  monthGrid.innerHTML = "";
  for (let m = 0; m < 12; m++) {
    const label = document.createElement("div");
    label.className = "month-label";
    label.textContent = MONTH_NAMES[m];
    if (m < month) {
      label.classList.add("past");
    } else {
      label.classList.add(m === month ? "active" : "future");
    }
    monthGrid.appendChild(label);
  }

  // ---- Card 3: Current month dot grid ----
  const monthDotGrid = document.getElementById("month-dot-grid");
  monthDotGrid.innerHTML = "";
  for (let d = 1; d <= daysInMonth; d++) {
    const dot = document.createElement("div");
    dot.className = "dot " + (d <= date ? "elapsed" : "remaining");
    monthDotGrid.appendChild(dot);
  }

  const daysLeftInMonth = daysInMonth - date;
  document.getElementById("month-name").textContent = MONTH_FULL[month];
  document.getElementById("month-days-left").textContent =
    daysLeftInMonth === 1 ? "1 day left" : daysLeftInMonth + " days left";
}

// Right-click → context menu (handled in main process)
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (window.widgetAPI) {
    window.widgetAPI.showContextMenu();
  }
});

// Initial render + re-render every 60 seconds
render();
setInterval(render, 60000);
