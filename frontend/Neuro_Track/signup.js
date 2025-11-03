const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent default form submission

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (password.length > 72) {
  alert("Password too long! Max 72 characters.");
  return;
}


  try {
    const res = await fetch("http://127.0.0.1:8000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Signup failed");
    } else {
      alert(data.message);
      // optionally redirect to login page
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Server error. Check console.");
  }
});
