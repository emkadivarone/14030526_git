const map = L.map('map').setView([37.26941, 49.2145], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let coordinates = [];

map.on('click', function(e) {
    const latlng = e.latlng;
    coordinates.push({
        latitude: latlng.lat,
        longitude: latlng.lng
    });
    L.marker(latlng).addTo(map).bindPopup(`Latitude: ${latlng.lat.toFixed(5)}<br>Longitude: ${latlng.lng.toFixed(5)}`).openPopup();
});

function getCurrentDateTime() {
    return new Date().toLocaleString();
}

function saveToServer() {
    const timestamp = getCurrentDateTime();
    const dataToSend = coordinates.map(coord => ({
        ...coord,
        timestamp: timestamp
    }));

    fetch('/save-coordinates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        coordinates = [];
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('save-button').addEventListener('click', saveToServer);
