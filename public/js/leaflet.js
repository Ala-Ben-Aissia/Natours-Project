import L from "leaflet";
export const displayMap = (locations) => {
   document.addEventListener("DOMContentLoaded", function () {
      const mymap = L.map("map", {
         scrollWheelZoom: false,
         center: locations[0].coordinates,
      }).setView(locations[0].coordinates, 5);
      // .fitBounds(locations.map((e) => e.coordinates.reverse()));

      L.tileLayer(
         "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
         {
            attribution: "© OpenStreetMap contributors",
         }
      ).addTo(mymap);
      // L.circle([lat, lng], {
      //    color: "red",
      //    fillColor: "#f03",
      //    fillOpacity: 0.5,
      //    radius: 5000,
      // }).addTo(mymap);
      // L.polygon();
      locations.forEach((loc, i) => {
         const [lng, lat] = loc.coordinates;
         const x = L.marker([lat, lng])
            .addTo(mymap)
            .bindPopup(
               L.popup({
                  maxWidth: 500,
                  minWidth: 100,
                  // autoClose: false,
                  closeOnClick: false,
                  // className: "mapboxgl-popup",
                  // autoPan: true,
               })
            )
            .setPopupContent(
               `<h1>Location ${i + 1}: ${loc.description}
                (Day-${loc.day})</h1>`
            );
         if (i === 0) x.openPopup();
      });
      mymap.fitBounds(
         locations.map((e) => e.coordinates.reverse()),
         { padding: [150, 150] }
      );
      L.polygon(locations.map((e) => e.coordinates)).addTo(mymap);
   });
};
