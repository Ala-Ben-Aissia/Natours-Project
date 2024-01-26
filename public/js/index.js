import { displayMap } from "./leaflet";
import { login } from "./login";
import { logout } from "./logout";

// DOM Elements
const map = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");

// Delegation
if (map) {
   const locations = JSON.parse(map.dataset.locations);
   displayMap(locations);
}

if (loginForm) {
   loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      login(email, password);
   });
}

if (logoutBtn) {
   logoutBtn.addEventListener("click", logout);
}
