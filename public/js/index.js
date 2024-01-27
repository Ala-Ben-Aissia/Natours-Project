import { displayMap } from "./leaflet";
import { login } from "./login";
import { logout } from "./logout";
import { updateUserData } from "./settings";

// DOM Elements
const map = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");

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

if (userDataForm) {
   userDataForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("name").value;
      const email = document.querySelector("#email").value;
      updateUserData(username, email);
   });
}
