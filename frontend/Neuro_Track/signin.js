document.getElementById("signinForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const response = await fetch("http://127.0.0.1:8000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Login successful! Redirecting...");
      window.location.href = "index.html"; // redirect to your home/dashboard
    } else {
      alert(`❌ ${data.detail || "Invalid email or password"}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ Could not connect to the server. Make sure backend is running.");
  }
});
