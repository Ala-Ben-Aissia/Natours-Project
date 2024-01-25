/* eslint-disable no-undef */
const locations = JSON.parse(
   document.getElementById("map").dataset.locations
);
document.addEventListener("DOMContentLoaded", function () {
   const mymap = L.map("map", { scrollWheelZoom: false })
      // .setView(locations[0].coordinates, 10)
      .fitBounds(locations.map((e) => e.coordinates.reverse()));

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
   L.polygon(locations.map((e) => e.coordinates)).addTo(mymap);
   locations.forEach((loc, i) => {
      const [lng, lat] = loc.coordinates.reverse();
      const x = L.marker([lat, lng])
         .addTo(mymap)
         .bindPopup(
            L.popup({
               maxWidth: 250,
               minWidth: 100,
               // autoClose: false,
               closeOnClick: false,
               // className: "mapboxgl-popup",
               autoPan: true,
            })
         )
         .setPopupContent(`<h1>${i + 1}. ${loc.description}</h1>`);
      if (i === 0) x.openPopup();
   });
});
