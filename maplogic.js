// Initialize the map
const map = L.map("map").setView([53.3498, -6.2603], 16);

var monumentIcon = L.icon({
  iconUrl: "monument.png",
  iconSize: [40, 60], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
var tramIcon = L.icon({
  iconUrl: "tram.png",
  iconSize: [25, 25], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
var dartIcon = L.icon({
  iconUrl: "dart.png",
  iconSize: [25, 25], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
var busIcon = L.icon({
  iconUrl: "bus.png",
  iconSize: [25, 25], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});

// Add the OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const monuments = [];
fetch("sourcedata.csv")
  .then((response) => response.text())
  .then((data) => {
    // Parse the CSV data
    const rows = data.trim().split("\n");
    const monuments = [];

    for (let i = 1; i < rows.length; i++) {
      const [
        name,
        website,
        phone,
        email,
        latitude,
        longitude,
        wikiLink,
        description,
        year,
      ] = rows[i].split(",");

      monuments.push({
        id: i,
        name: name,
        description: (description + "," + year).replace(/"/g, ""),
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
        wiki: wikiLink,
      });
    }

    populate_monuments(monuments);
    loadData();
  })
  .catch((error) => console.error("Error:", error));

let busStops = [];

// Function to load the data from the file
function loadData() {
  // fetch("export.geojson")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     busStops = [];
  //     for (const key in data["features"].) {
  //       console.log(key);
  //       debugger;
  //       if (data.hasOwnProperty(key)) {
  //         const { id, name, coordinate, type } = data[key];
  //       }
  //     }
  //     updateBusStops(busStops);
  //   })
  //   .catch((error) => {
  //     console.error("Error loading data:", error);
  //   });
  //
  fetch("export.geojson")
    .then((response) => response.json())
    .then((geojson) => {
      geojson.features.forEach((feature) => {
        const id = feature.id;
        const latitude = feature.geometry.coordinates[1];
        const longitude = feature.geometry.coordinates[0];
        const highway = feature.properties.highway;
        const name = feature.properties.name;

        busStops.push({
          id,
          name,
          latitude,
          longitude,
          highway,
        });
        // updateBusStops(busStops);
      });
    })
    .catch((error) => console.error("Error loading GeoJSON file:", error));
}
const stopTypeColors = {
  bus: "blue",
  dart: "green",
  luas: "red",
};

let selectedMonument = null;
let filterCircle = null;

// Function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Function to update nearby bus stops
function updateNearbyStops(monument, filterDistance) {
  const nearbyStops = busStops
    .map((stop) => ({
      ...stop,
      distance: calculateDistance(
        monument.lat,
        monument.lng,
        stop.latitude,
        stop.longitude,
      ),
    }))
    .filter((stop) => stop.distance <= filterDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  let popupContent = `
      <h3>${monument.name}</h3>
      <p>${monument.description} </p>
      ${monument.wiki ? `<a href="${monument.wiki}" target="_blank">Wikipedia</a>` : "Wikipedia: NA"}
      <h4>Nearby Stops:</h4>
      <ul>
          ${nearbyStops.map((stop) => `<li>(${stop.highway.toUpperCase()}) ${stop.name} (${stop.distance.toFixed(2)}m)</li>`).join("")}
      </ul>
  `;
  updateBusStops(nearbyStops);

  return popupContent;
}

// Add monuments to the map
function populate_monuments(monuments) {
  monuments.forEach((monument) => {
    const marker = L.marker([monument.lat, monument.lng], {
      icon: monumentIcon,
    })
      .addTo(map)
      .on("click", function (e) {
        selectedMonument = monument;
        const filterDistance = document.getElementById("distance").value;
        const popupContent = updateNearbyStops(monument, filterDistance);
        this.bindPopup(popupContent).openPopup();

        if (filterCircle) {
          map.removeLayer(filterCircle);
        }
        filterCircle = L.circle([monument.lat, monument.lng], {
          radius: filterDistance / 5,
          fillColor: "orange",
          fillOpacity: 0.1,
          color: "orange",
        }).addTo(map);
        filterCircle.bringToBack(); // Move the filterCircle behind the marker
      });
  });
}
function updateBusStops(nearByStops) {
  nearByStops.forEach((stop) => {
    let color;
    let icon;
    if (stop.highway === "TRAIN_STATION") {
      color = "green";
      icon = dartIcon;
    } else if (stop.highway === "bus_stop") {
      color = "blue";
      icon = busIcon;
    } else if (stop.highway === "TRAM_STOP_AREA") {
      color = "red";
      icon = tramIcon;
    } else {
      color = "gray"; // default color for unknown types
      icon = L.icon({
        iconUrl: "path/to/default-icon.png",
        // Other icon options
      });
    }
    console.log(stop.latitude);
    L.marker([stop.latitude, stop.longitude], { icon: icon }).addTo(map);
  });
}

// Add event listener for filter distance change
document.getElementById("distance").addEventListener("change", function (e) {
  const filterDistance = Number(e.target.value);
  if (selectedMonument) {
    const popupContent = updateNearbyStops(selectedMonument, filterDistance);
    map.closePopup();
    L.popup()
      .setLatLng([selectedMonument.lat, selectedMonument.lng])
      .setContent(popupContent)
      .openOn(map);

    if (filterCircle) {
      map.removeLayer(filterCircle);
    }
    filterCircle = L.circle([selectedMonument.lat, selectedMonument.lng], {
      radius: filterDistance,
      fillColor: "blue",
      fillOpacity: 0.1,
      color: "blue",
    }).addTo(map);
  }
});
