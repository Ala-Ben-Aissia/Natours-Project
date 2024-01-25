/* eslint-disable no-undef */
const locations = JSON.parse(
   document.getElementById("map").dataset.locations
);
document.addEventListener("DOMContentLoaded", function () {
   const mymap = L.map("map").setView(locations[0].coordinates, 10);
   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
   }).addTo(mymap);
   // L.circle([lat, lng], {
   //    color: "red",
   //    fillColor: "#f03",
   //    fillOpacity: 0.5,
   //    radius: 5000,
   // }).addTo(mymap);
   // L.polygon();
   L.polygon(locations.map((e) => e.coordinates.reverse())).addTo(
      mymap
   );
   locations.forEach((loc) => {
      const [lng, lat] = loc.coordinates.reverse();
      L.marker([lat, lng])
         .addTo(mymap)
         .bindPopup(
            L.popup({
               maxWidth: 250,
               minWidth: 100,
               autoClose: false,
               closeOnClick: false,
               // className: "mapboxgl-popup",
            })
         )
         .setPopupContent(
            `<h2 class="mapboxgl-popup-content">${loc.description}</h2>`
         )
         .openPopup();
   });
});
