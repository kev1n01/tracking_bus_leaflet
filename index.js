var map = L.map('map')
var serview = map.setView([-9.9097017, -76.2376833], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// var dark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
//     minZoom: 0,
//     maxZoom: 20,
//     attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     ext: 'png'
// });
// dark.addTo(map)

var marker, circle

const points = [
    { lat: -9.9224276, lng: -76.2326591 }, //ovalo pabletich
    { lat: -9.9308852, lng: -76.2340732 }, //puente burgos
    { lat: -9.927321, lng: -76.236112 }, //hermilio valdizan
    { lat: -9.909679, lng: -76.228947 }, //huayopampa
    { lat: -9.925091, lng: -76.232970 }, //llicua
    { lat: -9.898520, lng: -76.222629 }, //jancao
    { lat: -9.891078, lng: -76.217930 }, //udh
]

const routes_start = [
    [-9.891078, -76.217930],//udh
    [-9.898520, -76.222629],//jancao
    [-9.909679, -76.228947],//huayo
    [-9.9224276, -76.2326591],//ovalo pabletich 
    [-9.9308852, -76.2340732],//puente burgos
    [-9.925091, -76.232970],//llicua
    [-9.927321, -76.236112],//hermilio valdizan
]
const routes_end = [
    [-9.927321, -76.236112],//hermilio valdizan
    [-9.9224276, -76.2326591],//ovalo pabletich 
    [-9.909679, -76.228947],//huayo
    [-9.898520, -76.222629],//jancao
    [-9.891078, -76.217930],//udh
]
var bus_icon = L.icon({
    iconUrl: 'img/bus_icon.png',
    iconSize: [40, 40],
});

const options = {
    enableHighAccuary: true,
    timeout: 5000,
}

const getValuesGeolocation = (pos) => {
    return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        speed: pos.coords.speed,
        alt: pos.coords.altitude
    }
}
const markerPosition = (pos, icon = null, map) => {
    return L.marker([pos.lat, pos.lng], { icon: icon }).addTo(map)
}
const circleMarkerPosition = (pos, map, radius = null) => {
    return L.circleMarker([pos.lat, pos.lng], { radius: radius ?? 15 }).addTo(map)
}
const polyLinePosition = (coords, map, color) => {
    return L.polyline(coords, { color: color }).addTo(map);
}

points.forEach(el => {
    circleMarkerPosition(el, map)
});

polyLinePosition(routes_start, map, 'red')
polyLinePosition(routes_end, map, 'blue')

navigator.geolocation.watchPosition(successCallback, errorCallback, options)

function successCallback(pos) {
    const values = getValuesGeolocation(pos)

    if (marker) {
        map.removeLayer(marker)
    }
    if (circle) {
        map.removeLayer(circle)
    }
    marker = markerPosition(values, bus_icon, map)

    // circle = L.circle([values.lat, values.lng], { radius: 50, color: 'red' }).addTo(map)

    marker.bindPopup('lat: ' + values.lat + '<br>Lng: ' + values.lng + '<br>Accuary: ' + values.accuracy + '<br>Speed: ' + values.speed + '<br>Altitude: ' + values.alt)

    console.log('your pos:' + values.lat);


}

function errorCallback(err) {
    err.code === 1 ? alert("Please Allow geolocation access") : alert("Cannot get current location")

}
