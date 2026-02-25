// Toggle Forms
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
}

function showSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
}

// Show/Hide Password
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// Password Strength
function checkStrength() {
  const pass = document.getElementById("signupPass").value;
  const meter = document.getElementById("strengthMeter");

  if (pass.length < 4) {
    meter.style.background = "red";
  } else if (pass.length < 8) {
    meter.style.background = "orange";
  } else {
    meter.style.background = "green";
  }
}

// Signup
document.getElementById("signupForm").addEventListener("submit", function(e){
  e.preventDefault();

  const user = document.getElementById("signupUser").value;
  const email = document.getElementById("signupEmail").value;
  const pass = document.getElementById("signupPass").value;

  localStorage.setItem("user", JSON.stringify({user, email, pass}));

  alert("Account Created Successfully!");
  showLogin();
});

// Login
document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  const saved = JSON.parse(localStorage.getItem("user"));

  if (saved && saved.user === user && saved.pass === pass) {
    alert("Login Successful!");
    window.location.href = "dashboard1.html";
  } else {
    alert("Invalid Credentials");
  }
});