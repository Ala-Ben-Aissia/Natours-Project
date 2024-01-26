import { displayMap } from "./leaflet";
import { login } from "./login";

// DOM Elements
const map = document.getElementById("map");
const loginForm = document.querySelector(".form");

// Delegation
if (map) {
   const locations = JSON.parse(map.dataset.locations);
   displayMap(locations);
}

if (loginForm) {
   loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      await login(email, password);
   });
}
