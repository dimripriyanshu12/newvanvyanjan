// ===== GLOBAL DATA (MUST BE FIRST) =====

let expertQueries = JSON.parse(localStorage.getItem("expertQueries")) || [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
let chatData = JSON.parse(localStorage.getItem("chatData")) || [];
// ===== VALUE DATA =====
const produceValue = {
  Malta: 40,
  Rajma: 80,
  Kafal: 60,
  Gahat: 70
};
// ===== SEASONAL DATA (MUST BE FIRST) =====
const seasonalData = {
  Spring: ["Lingda", "Kandali"],
  Summer: ["Kafal", "Aadu"],
  Monsoon: ["Bhatt", "Turai"],
  Winter: ["Palak", "Gajar"]
};
function detectSeason() {
  const month = new Date().getMonth() + 1;

  if (month >= 3 && month <= 4) return "Spring";
  if (month >= 5 && month <= 6) return "Summer";
  if (month >= 7 && month <= 9) return "Monsoon";
  return "Winter";
}

function renderSeason(season) {
  const container = document.getElementById("seasonFoodContainer");
  const map = document.getElementById("mapDisplay");

  container.innerHTML = "";
  map.innerHTML = "";

  seasonalData[season].forEach(food => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <h4>${food}</h4>
      <p>Fresh & locally available in ${season}</p>
    `;
    container.appendChild(card);

    const mapItem = document.createElement("p");
    mapItem.innerText = "🌱 " + food + " available in hill regions";
    map.appendChild(mapItem);
  });
}

function showSeason(season) {
  renderSeason(season);
}

function loadCurrentSeason() {
  const season = detectSeason();

  document.getElementById("currentSeason").innerText = season;
  document.getElementById("currentFoods").innerText =
    "Suggested Foods: " + seasonalData[season].join(", ");

  renderSeason(season);
}

document.addEventListener("DOMContentLoaded", loadCurrentSeason);
const today = new Date().toDateString();
const lastVisit = localStorage.getItem("lastVisit");

if (lastVisit !== today) {
  localStorage.setItem("steps", 0);
  localStorage.removeItem("goalAchieved");
  localStorage.setItem("lastVisit", today);
}
let totalSteps = parseInt(localStorage.getItem("steps")) || 0;
let streak = parseInt(localStorage.getItem("streak")) || 0;

const goal = 10000;
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
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart();
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartContainer");
  const totalEl = document.getElementById("cartTotal");

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          ₹${item.price} x ${item.qty}
        </div>
        <div>
          <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
          <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
          <button class="qty-btn" onclick="removeItem(${index})">X</button>
        </div>
      </div>
    `;
  });

  totalEl.innerText = total;
}

function changeQty(index, change) {
  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

renderCart();
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
let selectedStore = "Block A Store";
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function changeStore() {
  selectedStore = document.getElementById("storeSelect").value;
}

function checkout() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  showSection('checkoutSection');

  let summary = document.getElementById("billSummary");
  let total = 0;
  summary.innerHTML = "<h4>Bill Summary</h4>";

  cart.forEach(item => {
    total += item.price * item.qty;
    summary.innerHTML += `
      <p>${item.name} - ₹${item.price} x ${item.qty}</p>
    `;
  });

  summary.innerHTML += `<h4>Total: ₹${total}</h4>`;
}

function placeOrder() {

  if (typeof cart === "undefined" || cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let paymentDropdown = document.getElementById("paymentMethod");

  if (!paymentDropdown) {
    alert("Payment method not found!");
    return;
  }

  let payment = paymentDropdown.value;

  let newOrder = {
    items: cart,
    payment: payment,
    date: new Date().toLocaleString()
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Show popup safely
  let popup = document.getElementById("orderPopup");
  if (popup) {
    popup.style.display = "flex";
  }

  // Clear cart
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));

  if (typeof renderCart === "function") {
    renderCart();
  }
}
function closePopup() {
  document.getElementById("orderPopup").style.display = "none";
  showSection('grocery');
}

function renderOrderHistory() {
  let container = document.getElementById("orderHistory");
  container.innerHTML = "";

  orders.forEach(order => {
    container.innerHTML += `
      <div class="order-card">
        <strong>Store:</strong> ${order.store}<br>
        <strong>Payment:</strong> ${order.payment}<br>
        <strong>Date:</strong> ${order.date}
        <hr>
      </div>
    `;
  });
}

renderOrderHistory();
async function generateInvoice(order) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Van Vyanjan Invoice", 20, 20);
  doc.text("Store: " + order.store, 20, 30);
  doc.text("Payment: " + order.payment, 20, 40);
  doc.text("Date: " + order.date, 20, 50);

  let y = 60;

  order.items.forEach(item => {
    doc.text(`${item.name} - ₹${item.price} x ${item.qty}`, 20, y);
    y += 10;
  });

  doc.save("Invoice.pdf");
}
function openTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  document.getElementById(tabId).style.display = "block";
}

function generateAIRecommendation() {
  const disease = document.getElementById("aiDisease").value;
  const age = document.getElementById("aiAge").value;
  const bmi = document.getElementById("aiBMI").value;

  let recommendation = "";

  if (disease === "Diabetes") {
    recommendation = "Eat Mandua, Jhangora, high fiber foods. Avoid sugar.";
  }
  if (disease === "Anemia") {
    recommendation = "Eat Rajma, Palak, iron-rich foods.";
  }
  if (disease === "Hypertension") {
    recommendation = "Eat Malta, low sodium foods.";
  }
  if (disease === "Obesity") {
    recommendation = "Eat fiber-rich low calorie foods.";
  }

  document.getElementById("aiResult").innerHTML =
    `<p><strong>Personalized Advice:</strong> ${recommendation}</p>`;

  createNutritionChart();
}

function createNutritionChart() {
  const ctx = document.getElementById("nutritionChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Protein", "Iron", "Fiber"],
      datasets: [{
        label: "Nutrient Level",
        data: [20, 8, 15],
        borderWidth: 1
      }]
    }
  });
}

function searchFood() {
  const nutrient = document.getElementById("nutrientSelect").value;
  let result = "";

  if (nutrient === "iron") {
    result = "High Iron Foods: Rajma, Palak";
  }
  if (nutrient === "protein") {
    result = "High Protein Foods: Rajma, Mandua";
  }
  if (nutrient === "fiber") {
    result = "High Fiber Foods: Mandua, Jhangora";
  }

  document.getElementById("searchResult").innerHTML = result;
}

function calculateRisk() {
  const age = parseInt(document.getElementById("riskAge").value);
  const bmi = parseFloat(document.getElementById("riskBMI").value);
  const steps = parseInt(document.getElementById("riskSteps").value);

  let score = 0;

  if (age > 50) score += 2;
  if (bmi > 25) score += 2;
  if (steps < 5000) score += 2;

  let risk = "Low Risk";

  if (score >= 4) risk = "High Risk";
  else if (score >= 2) risk = "Moderate Risk";

  document.getElementById("riskResult").innerHTML =
    `<strong>Health Risk Level: ${risk}</strong>`;
}

function generateDietPlan() {
  const plan = `
    <ul>
      <li>Morning: Warm water + Malta</li>
      <li>Breakfast: Mandua roti + Palak</li>
      <li>Lunch: Rajma + Brown rice</li>
      <li>Evening: Fruit snack</li>
      <li>Dinner: Light vegetable soup</li>
    </ul>
  `;

  document.getElementById("dietResult").innerHTML = plan;
}
const circle = document.querySelector(".progress");
const radius = 70;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;
function updateUI() {

  document.getElementById("stepCount").innerText = totalSteps;

  let percent = Math.min((totalSteps / goal) * 100, 100);

  document.getElementById("goalProgress").style.width = percent + "%";
  document.getElementById("goalPercent").innerText = percent.toFixed(1) + "%";

  let healthScore = Math.min((percent * 0.7) + (streak * 3), 100);

  document.getElementById("healthFill").style.width = healthScore + "%";
  document.getElementById("healthScore").innerText = Math.round(healthScore) + " / 100";

  document.getElementById("streakCount").innerText = streak + " Days";

  // Circular progress update
  const circle = document.querySelector(".progress");
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = circumference;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function addSteps() {
  const steps = parseInt(document.getElementById("stepsInput").value);

  if (!steps || steps <= 0) {
    alert("Enter valid steps");
    return;
  }

  totalSteps += steps;
  localStorage.setItem("steps", totalSteps);

  if (totalSteps >= goal && !localStorage.getItem("goalAchieved")) {
    streak++;
    localStorage.setItem("streak", streak);
    localStorage.setItem("goalAchieved", "true");
    launchConfetti();
  }

  updateUI();
}
function launchConfetti() {
  var duration = 3 * 1000;
  var end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 70,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 70,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
function resetSteps() {

  totalSteps = 0;
  localStorage.setItem("steps", 0);

  localStorage.removeItem("goalAchieved");

  updateUI();
}

// ===== DETECT SEASON =====
function detectSeason() {
  const month = new Date().getMonth() + 1;

  if (month >= 3 && month <= 4) return "Spring";
  if (month >= 5 && month <= 6) return "Summer";
  if (month >= 7 && month <= 9) return "Monsoon";
  return "Winter";
}

// ===== LOAD CURRENT SEASON =====
function loadCurrentSeason() {
  const season = detectSeason();

  document.getElementById("currentSeason").innerText = season;
  document.getElementById("currentFoods").innerText =
    "Suggested Foods: " + seasonalData[season].join(", ");

  renderSeason(season);
}

// ===== RENDER FUNCTION (IMPORTANT) =====
function renderSeason(season) {
  const container = document.getElementById("seasonFoodContainer");
  const map = document.getElementById("mapDisplay");

  container.innerHTML = "";
  map.innerHTML = "";

  seasonalData[season].forEach(food => {
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <h4>${food}</h4>
      <p>Fresh & locally available in ${season}</p>
    `;
    container.appendChild(card);

    const mapItem = document.createElement("p");
    mapItem.innerText = "🌱 " + food + " available in hill regions";
    map.appendChild(mapItem);
  });
}

// ===== CLICK FUNCTION =====
function showSeason(season) {
  renderSeason(season);
}

// ===== AUTO LOAD =====
document.addEventListener("DOMContentLoaded", loadCurrentSeason);
// ===== BART-ER VALUE MAPPING =====
function calculateExchange() {
  const selectElement = document.getElementById("produceSelect");
  const qtyElement = document.getElementById("produceQty");
  const resultDiv = document.getElementById("exchangeResult");

  if (!selectElement || !qtyElement || !resultDiv) {
    console.error("Exchange elements not found in HTML");
    return;
  }

  const selectedProduce = selectElement.value;
  const quantity = parseFloat(qtyElement.value);

  if (isNaN(quantity) || quantity <= 0) {
    resultDiv.innerHTML = "⚠ Please enter valid quantity";
    return;
  }

  const totalValue = produceValue[selectedProduce] * quantity;

  let suggestions = "";

  Object.keys(produceValue).forEach(item => {
    if (item !== selectedProduce) {
      const equivalentQty = (totalValue / produceValue[item]).toFixed(2);
      suggestions += `<p>🌾 ${quantity} kg ${selectedProduce} ≈ ${equivalentQty} kg ${item}</p>`;
    }
  });

  resultDiv.innerHTML = `
    <h4>💰 Exchange Value: ₹${totalValue}</h4>
    ${suggestions}
  `;
}
// ===== ASK EXPERT SYSTEM =====

function submitQuestion() {
  const category = document.getElementById("expertCategory").value;
  const priority = document.getElementById("priorityLevel").value;
  const question = document.getElementById("expertQuestion").value;

  if (!question.trim()) {
    alert("Please enter your question");
    return;
  }

  const newQuery = {
    id: Date.now(),
    category,
    priority,
    question,
    status: "Pending",
    response: generateAIResponse(category),
    date: new Date().toLocaleDateString()
  };

  expertQueries.push(newQuery);
  localStorage.setItem("expertQueries", JSON.stringify(expertQueries));

  document.getElementById("expertQuestion").value = "";

  renderExpertHistory();
}

function generateAIResponse(category) {
  const responses = {
    Nutrition: "Increase protein intake and stay hydrated.",
    Disease: "Please consult a nearby health center for diagnosis.",
    "Mental Health": "Practice breathing exercises and maintain sleep schedule.",
    Fitness: "Aim for 30 minutes of moderate exercise daily."
  };

  return responses[category] || "Expert will respond soon.";
}

function renderExpertHistory() {
  const container = document.getElementById("expertHistory");
  container.innerHTML = "";

  expertQueries.forEach(query => {
    container.innerHTML += `
      <div class="expert-card">
        <h4>${query.category} (${query.priority})</h4>
        <p><strong>Question:</strong> ${query.question}</p>
        <p><strong>Status:</strong> ${query.status}</p>
        <p><strong>Expert Reply:</strong> ${query.response}</p>
        <small>${query.date}</small>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", renderExpertHistory);

function bookExpert() {
  const type = document.getElementById("expertType").value;
  const date = document.getElementById("bookingDate").value;
  const time = document.getElementById("bookingTime").value;

  if (!date || !time) {
    alert("Select date and time");
    return;
  }

  const newBooking = {
    id: Date.now(),
    type,
    date,
    time,
    status: "Confirmed"
  };

  bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));

  renderBookings();
  updateNotification();
}

function renderBookings() {
  const container = document.getElementById("bookingHistory");
  container.innerHTML = "";

  bookings.forEach(b => {
    container.innerHTML += `
      <div class="expert-card">
        <h4>${b.type}</h4>
        <p>${b.date} at ${b.time}</p>
        <p>Status: ${b.status}</p>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", renderBookings);

document.addEventListener("DOMContentLoaded", function () {

  expertQueries = JSON.parse(localStorage.getItem("expertQueries")) || [];
  bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  chatData = JSON.parse(localStorage.getItem("chatData")) || [];

  renderExpertHistory();
  renderBookings();
  renderChat();
});