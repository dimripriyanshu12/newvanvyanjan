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
let cart = [];
let total = 0;

function addToCart(name, price) {
  cart.push({name, price});
  total += price;

  displayCart();
}

function displayCart() {
  let list = document.getElementById("cartList");
  list.innerHTML = "";

  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item.name + " - ₹" + item.price;
    list.appendChild(li);
  });

  document.getElementById("totalPrice").innerText = total;
}
function saveProfile() {
  let name = document.querySelector("#profile input[type='text']").value;
  let age = document.querySelector("#profile input[type='number']").value;

  localStorage.setItem("name", name);
  localStorage.setItem("age", age);

  calculateBMI();
}
function initMap() {
  const location = { lat: 30.0668, lng: 79.0193 };

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: location,
  });

  new google.maps.Marker({
    position: location,
    map: map,
  });
}
function toggleDark() {
  document.body.classList.toggle("dark");
}
const ctx = document.getElementById('healthChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Mon','Tue','Wed','Thu','Fri'],
    datasets: [{
      label: 'Steps',
      data: [4000, 6000, 8000, 7500, 9000],
      borderWidth: 2
    }]
  }
});
if(!sessionStorage.getItem("loggedIn")){
  window.location = "index.html";
}