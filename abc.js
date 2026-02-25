function showSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
}

function showLogin() {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

function signup() {
  let user = document.getElementById("signupUser").value;
  let pass = document.getElementById("signupPass").value;

  localStorage.setItem("user", user);
  localStorage.setItem("pass", pass);

  alert("Account Created!");
}

function login() {
  let user = document.getElementById("loginUser").value;
  let pass = document.getElementById("loginPass").value;

  if(user === localStorage.getItem("user") &&
     pass === localStorage.getItem("pass")) {
       window.location.href = "dashboard1.html";
  } else {
    alert("Invalid Credentials");
  }
}