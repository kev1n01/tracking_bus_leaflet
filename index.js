var map = L.map('map')
map.setView([-9.9097017, -76.2376833], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


navigator.geolocation.watchPosition(successCallback, errorCallback)

function successCallback(pos) {
    const lat = pos.coords.latitude
    const lng = pos.coords.longitude
    const accuracy = pos.coords.accuracy
    const speed = pos.coords.speed
    const alt = pos.coords.altitude

    let marker = L.marker([lat, lng]).addTo(map)
    L.circle([lat, lng], { radius: 50 }).addTo(map)

    marker.bindPopup('lat: ' + lat + '<br>Lng: ' + lng + '<br>Accuary: ' + accuracy + '<br>Speed: ' + speed + '<br>Altitude: ' + alt).openPopup()

}

function errorCallback(err) {
    err.code === 1 ? alert("Please Allow geolocation access") : alert("Cannot get current location")

}
