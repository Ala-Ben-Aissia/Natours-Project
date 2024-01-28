import { displayMap } from "./leaflet";
import { login } from "./login";
import { logout } from "./logout";
import { updateUserData } from "./settings";

// DOM Elements
const map = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(
   ".form-user-password"
);

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

if (logoutBtn) {
   logoutBtn.addEventListener("click", async () => {
      await logout();
   });
}

if (userDataForm) {
   userDataForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("name").value;
      const email = document.querySelector("#email").value;
      await updateUserData({ username, email }, "data");
   });
}
if (userPasswordForm) {
   userPasswordForm.addEventListener("submit", async (e) => {
      document.querySelector(".btn--save-password").textContent =
         "updating..";
      e.preventDefault();
      const currentPassword = document.getElementById(
         "password-current"
      ).value;
      const newPassword = document.getElementById("password").value;
      const newPasswordConfirm = document.getElementById(
         "password-confirm"
      ).value;
      await updateUserData(
         { currentPassword, newPassword, newPasswordConfirm },
         "password"
      );
      document.querySelector(".btn--save-password").textContent =
         "save passoword";
   });
}
