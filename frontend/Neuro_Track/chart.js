window.riskChartInstance = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Risk Level",
      data: data,
      fill: true,
      backgroundColor: "rgba(239,68,68,0.2)", // transparent red
      borderColor: "rgba(239,68,68,1)",
      tension: 0.3,
      pointBackgroundColor: "rgba(239,68,68,1)",
      pointBorderColor: "#111827", // dark point border
      pointRadius: 5
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b", // tooltip dark background
        titleColor: "#fcd34d",       // yellow titles
        bodyColor: "#f9fafb"         // light text
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: { color: "#f9fafb" }, // tick labels light
        grid: { color: "rgba(255,255,255,0.1)" }, // subtle grid lines
        title: { display: true, text: "Risk Level", color: "#f9fafb" }
      },
      x: {
        ticks: { color: "#f9fafb" },
        grid: { color: "rgba(255,255,255,0.1)" },
        title: { display: true, text: "Date", color: "#f9fafb" }
      }
    }
  }
});
