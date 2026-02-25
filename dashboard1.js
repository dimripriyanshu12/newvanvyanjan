function showSection(id) {
  let sections = document.querySelectorAll(".section");
  sections.forEach(sec => sec.style.display = "none");

  document.getElementById(id).style.display = "block";
}

function logout() {
  window.location.href = "index.html";
}
function calculateBMI() {
  let height = document.querySelector("#profile input[placeholder='Height']").value;
  let weight = document.querySelector("#profile input[placeholder='Weight']").value;

  height = height / 100; // convert cm to meters
  let bmi = weight / (height * height);

  let result = "Your BMI: " + bmi.toFixed(2);

  if(bmi < 18.5) result += " (Underweight)";
  else if(bmi < 25) result += " (Normal)";
  else if(bmi < 30) result += " (Overweight)";
  else result += " (Obese)";

  document.getElementById("bmiResult").innerText = result;
}