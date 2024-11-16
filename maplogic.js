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

  iconSize: [40, 60], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
var dartIcon = L.icon({
  iconUrl: "dart.png",

  iconSize: [40, 60], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
});
var busIcon = L.icon({
  iconUrl: "bus.png",

  iconSize: [40, 60], // size of the icon
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
fetch("/sourcedata.csv")
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
  })
  .catch((error) => console.error("Error:", error));

const busStops = [
  {
    id: 1,
    name: "College Green, stop 7598",
    lat: 53.3444,
    lng: -6.2593,
    type: "bus",
  },
  {
    id: 2,
    name: "Trinity College, stop 751",
    lat: 53.3435,
    lng: -6.2587,
    type: "bus",
  },
  {
    id: 3,
    name: "Aston Quay, stop 315",
    lat: 53.3467,
    lng: -6.2608,
    type: "bus",
  },
  {
    id: 4,
    name: "Bachelor's Walk, stop 318",
    lat: 53.3474,
    lng: -6.2602,
    type: "bus",
  },
  {
    id: 5,
    name: "O'Connell Bridge, stop 273",
    lat: 53.347,
    lng: -6.2588,
    type: "bus",
  },
  {
    id: 6,
    name: "O'Connell Street Upper, stop 277",
    lat: 53.3502,
    lng: -6.2603,
    type: "bus",
  },
  {
    id: 7,
    name: "Parnell Square West, stop 2",
    lat: 53.3528,
    lng: -6.2631,
    type: "bus",
  },
  {
    id: 8,
    name: "Dame Street, stop 1358",
    lat: 53.3439,
    lng: -6.2667,
    type: "bus",
  },
  {
    id: 9,
    name: "South Great George's Street, stop 1359",
    lat: 53.3431,
    lng: -6.2648,
    type: "bus",
  },
  {
    id: 10,
    name: "Christchurch Place, stop 1934",
    lat: 53.3435,
    lng: -6.2712,
    type: "bus",
  },
  {
    id: 11,
    name: "High Street, stop 1937",
    lat: 53.343,
    lng: -6.2743,
    type: "bus",
  },
  {
    id: 12,
    name: "Lord Edward Street, stop 1935",
    lat: 53.3437,
    lng: -6.2679,
    type: "bus",
  },
  {
    id: 13,
    name: "Werburgh Street, stop 1936",
    lat: 53.3433,
    lng: -6.2685,
    type: "bus",
  },
  {
    id: 14,
    name: "Patrick Street, stop 2007",
    lat: 53.3399,
    lng: -6.2724,
    type: "bus",
  },
  {
    id: 15,
    name: "Kevin Street Upper, stop 1317",
    lat: 53.338,
    lng: -6.2728,
    type: "bus",
  },
  {
    id: 16,
    name: "St Stephen's Green North, stop 791",
    lat: 53.3395,
    lng: -6.2588,
    type: "bus",
  },
  {
    id: 17,
    name: "Dawson Street, stop 792",
    lat: 53.3414,
    lng: -6.2581,
    type: "bus",
  },
  {
    id: 18,
    name: "Kildare Street, stop 750",
    lat: 53.3409,
    lng: -6.2549,
    type: "bus",
  },
  {
    id: 19,
    name: "Nassau Street, stop 405",
    lat: 53.3425,
    lng: -6.2567,
    type: "bus",
  },
  {
    id: 20,
    name: "Westmoreland Street, stop 317",
    lat: 53.3463,
    lng: -6.2592,
    type: "bus",
  },
  {
    id: 21,
    name: "Abbey Street Lower, stop 259",
    lat: 53.3484,
    lng: -6.2581,
    type: "bus",
  },
  {
    id: 22,
    name: "Marlborough Street, stop 4494",
    lat: 53.3499,
    lng: -6.2573,
    type: "bus",
  },
  {
    id: 23,
    name: "Parnell Street, stop 6",
    lat: 53.3518,
    lng: -6.2617,
    type: "bus",
  },
  {
    id: 24,
    name: "Gardiner Street Lower, stop 135",
    lat: 53.3499,
    lng: -6.2547,
    type: "bus",
  },
  {
    id: 25,
    name: "Custom House Quay, stop 4445",
    lat: 53.3484,
    lng: -6.2528,
    type: "bus",
  },
  {
    id: 26,
    name: "Tara Street Station",
    lat: 53.3472,
    lng: -6.2539,
    type: "dart",
  },
  { id: 27, name: "Pearse Station", lat: 53.3432, lng: -6.2492, type: "dart" },
  {
    id: 28,
    name: "Connolly Station",
    lat: 53.3531,
    lng: -6.2462,
    type: "dart",
  },
  { id: 29, name: "Abbey Street", lat: 53.3488, lng: -6.2582, type: "luas" },
  { id: 30, name: "Jervis", lat: 53.3478, lng: -6.2656, type: "luas" },
  {
    id: 31,
    name: "St. Stephen's Green",
    lat: 53.339,
    lng: -6.2612,
    type: "luas",
  },
];

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
        stop.lat,
        stop.lng,
      ),
    }))
    .filter((stop) => stop.distance <= filterDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  let popupContent = `
      <h3>${monument.name}</h3>
      <p>${monument.description} </p>
      ${monument.wiki ? `<a href="${monument.wiki}" target="_blank">Wikipedia</a>` : "Wikipedia: NA"}
      <h4>Nearby Stops:</h4>
      <ul>
          ${nearbyStops.map((stop) => `<li>(${stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}) ${stop.name} (${stop.distance.toFixed(2)}m)</li>`).join("")}

          </ul>
  `;

  return popupContent;
}

// Add monuments to the map
function populate_monuments(monuments) {
  monuments.forEach((monument) => {
    L.marker([monument.lat, monument.lng], { icon: monumentIcon })
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
          radius: filterDistance,
          fillColor: "orange",
          // fillOpacity: 0.1,
          color: "orange",
        }).addTo(map);
      });
  });
}

busStops.forEach((stop) => {
  let color;
  let icon;
  if (stop.type === "dart") {
    color = "green";
    icon = dartIcon;
  } else if (stop.type === "bus") {
    color = "blue";
    icon = busIcon;
  } else if (stop.type === "luas") {
    color = "red";
    icon = tramIcon;
  } else {
    color = "gray"; // default color for unknown types
    icon = L.icon({
      iconUrl: "path/to/default-icon.png",
      // Other icon options
    });
  }
  L.marker([stop.lat, stop.lng], { icon: icon }).addTo(map);
});

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
