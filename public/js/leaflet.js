/* eslint-disable no-undef */
const locations = JSON.parse(
   document.getElementById("map").dataset.locations
);
document.addEventListener("DOMContentLoaded", function () {
   const mymap = L.map("map").setView([105, 42], 5);
   L.polygon(locations.map((e) => e.coordinates)).addTo(mymap);
   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
   }).addTo(mymap);
   locations.forEach((loc) => {
      const [lng, lat] = loc.coordinates;
      L.marker([lat, lng])
         .addTo(mymap)
         .bindPopup(L.popup())
         .setPopupContent(loc.description)
         .openPopup();
      // L.circle([lat, lng], {
      //    color: "red",
      //    fillColor: "#f03",
      //    fillOpacity: 0.5,
      //    radius: 5000,
      // }).addTo(mymap);
   });
});
