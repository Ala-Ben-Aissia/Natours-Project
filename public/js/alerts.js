export const hideAlert = () => {
   const alert = document.querySelector(".alert");
   if (alert) alert.remove();
};

export const showAlert = (type, msg) => {
   hideAlert(); // always one alert at a time
   const markup = `<div class="alert alert--${type}">${msg}</div>`;
   document
      .querySelector("body")
      .insertAdjacentHTML("afterbegin", markup);
   window.setTimeout(() => hideAlert(), 2000);
};
