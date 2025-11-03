const calendarGrid = document.getElementById("calendarGrid");
const emotionBox = document.getElementById("emotionBox");
const monthSelect = document.getElementById("monthSelect");
const historyIcon = document.getElementById("historyIcon");
const historyChat = document.getElementById("historyChat");

// Mock stress data
const stressData = {
  "2025-11-01": { level: "low", emotion: "Calm" },
  "2025-11-03": { level: "medium", emotion: "Anxious" },
  "2025-11-06": { level: "high", emotion: "Overwhelmed" },
  "2025-11-10": { level: "medium", emotion: "Tired" },
  "2025-11-14": { level: "low", emotion: "Relaxed" },
  "2025-11-20": { level: "high", emotion: "Stressed" },
};

// Mock risk history (0 = low, 1 = high)
const riskHistory = [
  { date: "2025-11-01", risk: 0.2 },
  { date: "2025-11-03", risk: 0.5 },
  { date: "2025-11-06", risk: 0.9 },
  { date: "2025-11-10", risk: 0.6 },
  { date: "2025-11-14", risk: 0.3 },
  { date: "2025-11-20", risk: 0.8 },
];

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Populate month dropdown
months.forEach((month, index) => {
  const opt = document.createElement("option");
  opt.value = index;
  opt.textContent = month;
  monthSelect.appendChild(opt);
});

// Set current month
const today = new Date();
monthSelect.value = today.getMonth();

function generateCalendar(monthIndex) {
  calendarGrid.innerHTML = "";

  const year = today.getFullYear();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Weekday headers
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  days.forEach(day => {
    const header = document.createElement("div");
    header.textContent = day;
    header.className = "text-center font-semibold text-indigo-200";
    calendarGrid.appendChild(header);
  });

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) calendarGrid.appendChild(document.createElement("div"));

  // Calendar days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(monthIndex+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const cell = document.createElement("div");
    cell.textContent = d;
    cell.className = "cursor-pointer text-center py-2 rounded-lg transition-all hover:scale-105 text-black font-semibold";

    if (stressData[dateStr]) {
      const level = stressData[dateStr].level;
      if (level === "low") cell.classList.add("bg-green-300");
      if (level === "medium") cell.classList.add("bg-yellow-300");
      if (level === "high") cell.classList.add("bg-red-400");
    } else {
      cell.classList.add("bg-gray-200");
    }

    cell.addEventListener("click", () => {
      if (stressData[dateStr]) {
        emotionBox.textContent = `🧘 Top Emotion on ${d} ${months[monthIndex]}: ${stressData[dateStr].emotion}`;
      } else {
        emotionBox.textContent = `No data recorded for ${d} ${months[monthIndex]} 📅`;
      }
    });

    calendarGrid.appendChild(cell);
  }
}


// Initial render
generateCalendar(parseInt(monthSelect.value));

// Update calendar when month changes
monthSelect.addEventListener("change", (e) => {
  generateCalendar(parseInt(e.target.value));
});

// History icon click to show chart

historyIcon.addEventListener("click", (e) => {
  e.preventDefault(); // ✅ Prevent page from jumping/reloading
  historyChat.classList.toggle("hidden");

  const labels = riskHistory.map(item => item.date);
  const data = riskHistory.map(item => item.risk);

  // Destroy previous chart if exists
  if (window.riskChartInstance) window.riskChartInstance.destroy();

  const ctx = document.getElementById("riskChart").getContext("2d");
  window.riskChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Risk Level",
        data: data,
        fill: true,
        backgroundColor: "rgba(239,68,68,0.2)",
        borderColor: "rgba(239,68,68,1)",
        tension: 0.3,
        pointBackgroundColor: "white",
        pointBorderColor: "red",
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          title: { display: true, text: "Risk Level" }
        },
        x: {
          title: { display: true, text: "Date" }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
});
