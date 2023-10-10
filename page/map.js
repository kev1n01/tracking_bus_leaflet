//init Leaflet 
var map = L.map('map').setView([-9.9097017, -76.2376833], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// L.easyButton({
//     states: [
//         {
//             icon: '<span class="star">&starf;</span>',
//             onClick: function () { alert('you just clicked the html entity \&starf;'); }
//         }
//     ]
// }).addTo(map);

let marker, circle, data_drivers, bus_marker2 = [], bus_marker
let alias = sessionStorage.getItem('alias')
let driver_id = sessionStorage.getItem('driver_id')

console.log(alias);
console.log(driver_id);
const BASE_URL = 'http://127.0.0.1:8000/api/'
const bus_icon = L.icon({
    iconUrl: '../img/bus_icon.png',
    iconSize: [40, 40],
});
const bus_icon_2 = L.icon({
    iconUrl: '../img/bus_icon_2.png',
    iconSize: [40, 40],
});
const points = [
    { lat: -9.9224276, lng: -76.2326591 }, //ovalo pabletich
    { lat: -9.9308852, lng: -76.2340732 }, //puente burgos
    { lat: -9.927321, lng: -76.236112 },
    { lat: -9.909679, lng: -76.228947 }, //huayopampa
    { lat: -9.925091, lng: -76.232970 }, //llicua
    { lat: -9.898520, lng: -76.222629 }, //jancao
    { lat: -9.891078, lng: -76.217930 }, //udh
]
const bus_coords = [
    { lat: -9.927321, lng: -76.236112, alias: 'bus1' },
    { lat: -9.9224276, lng: -76.2326591, alias: 'bus2' },
    { lat: -9.909679, lng: -76.228947, alias: 'bus3' },
    { lat: -9.9224276, lng: -76.2326591, alias: 'bus4' },
    { lat: -9.9224276, lng: -76.2326591, alias: 'bus5' },
    { lat: -9.891078, lng: -76.217930, alias: 'bus6' },
]

const routes_start = [
    [-9.891078, -76.217930],
    [-9.891864, -76.218033],
    [-9.892872, -76.220007],
    [-9.893438, -76.220510],
    [-9.898520, -76.222629],
    [-9.899110, -76.222838],
    [-9.901807, -76.224093],
    [-9.904447, -76.225076],
    [-9.909679, -76.228947],
    [-9.912164, -76.230645],
    [-9.912906, -76.230995],
    [-9.918348, -76.232302],
    [-9.9224276, -76.2326591],
    [-9.926552, -76.233136],
    [-9.929218, -76.233269],
    [-9.930128, -76.233376],
    [-9.930711, -76.233592],
    [-9.931093, -76.233919],
    [-9.930696, -76.234688],
    [-9.930514, -76.234715],
    [-9.930065, -76.234442],
    [-9.929658, -76.234412],
    [-9.928050, -76.235513],
    [-9.927602, -76.235589],
    [-9.927094, -76.235425],
    [-9.926569, -76.235214],
    [-9.926344, -76.235565],
    [-9.927250, -76.236165],
]

const routes_end = [
    [
        [-9.927250, -76.236165],
        [-9.927602, -76.235589],
        [-9.927094, -76.235425],
        [-9.926566, -76.235204],
        [-9.925973, -76.234892],
        [-9.925590, -76.234830],
        [-9.922657, -76.234503],
        [-9.922809, -76.232825],
    ]

]

const getValuesGeolocation = (pos) => {
    return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        speed: pos.coords.speed,
        alt: pos.coords.altitude
    }
}
const markerPosition = (pos = [], icon = null, map) => {
    return L.marker(pos, { icon: icon }).addTo(map)
}
const popupMarkerPosition = (data, marker) => {
    marker.bindPopup(data)
}
//function for draw points with circlemarker
const circleMarkerPosition = (pos, map, radius = null) => {
    return L.circleMarker([pos.lat, pos.lng], { radius: radius ?? 15 }).addTo(map)
}
// function for draw line Leaflet
const polyLinePosition = (coords, map, color) => {
    return L.polyline(coords, { color: color }).addTo(map);
}


points.forEach(el => {
    marker_circle = circleMarkerPosition(el, map, 30)
    popupMarkerPosition('paradero', marker_circle)
});

// bus_coords.forEach(el => {
//     bus_marker = markerPosition([el.lat, el.lng], bus_icon, map)
//     popupMarkerPosition(el.alias, bus_marker)
// });

//draw line routes 
polyLinePosition(routes_start, map, 'red')
polyLinePosition(routes_end, map, 'blue')


// get a coordenate each 2 seconds
const options = {
    enableHighAccuary: true,
    timeout: 2000,
}

//function get drivers
function getDriversApi() {
    axios.get(BASE_URL + 'drivers')
        .then(function (res) {
            data_drivers = res.data.data
            for (let i = 0; i <= data_drivers.length; i++) {
                var m = markerPosition([data_drivers[i].lat, data_drivers[i].lng], bus_icon_2, map)
                bus_marker2.push(m)
                popupMarkerPosition(data_drivers[i].alias, m)
                // bus_marker2[i].setLatLng([data_drivers[i].lat, data_drivers[i].lng])

            }
        }).catch(function (error) {
            // console.log(error);
        })
    if (bus_marker2.length > 0) {
        for (let b = 0; b < bus_marker2.length; b++)
            map.removeLayer(bus_marker2[b])
    }
}

function call() {
    setInterval(getDriversApi, 2000)
}
call()
function updateMyCoordenates(lat_driver, lng_driver, id) {
    axios.post(BASE_URL + 'driverupdate/' + id, {
        lat: lat_driver,
        lng: lng_driver
    })
        .then(function (res) {
            // console.log(res.data);
        }).catch(function (error) {
            console.log(error);
        })
}
if (alias) {
    navigator.geolocation.watchPosition(successCallback, errorCallback, options)
    function successCallback(pos) {
        const values = getValuesGeolocation(pos)
        var data = 'lat: ' + values.lat + '<br>Lng: ' + values.lng + '<br>Accuary: ' + values.accuracy + '<br>Speed: ' + values.speed + '<br>Altitude: ' + values.alt
        if (marker) {
            map.removeLayer(marker)
        }
        marker = markerPosition([values.lat, values.lng], bus_icon, map)
        popupMarkerPosition(data, marker)
        updateMyCoordenates(values.lat, values.lng, driver_id)
    }

    function errorCallback(err) {
        err.code === 1 ? notification('Por favor, permite acceder a tu ubicación desde la aplicación \n Activa el gps de tu celular') : notification('No sé puede obtener tu ubicación, intentelo nuevamente', 'danger')
    }
}

function deleteDriver(id) {
    axios.delete(BASE_URL + 'drivers/' + id)
        .then(function (res) {
            console.log(res.data);
        }).catch(function (error) {
            console.log(error);
        })
}

const endDriver = () => {
    deleteDriver(driver_id)
    sessionStorage.removeItem('driver_id')
    sessionStorage.removeItem('alias')

    location.href = "../index.html"
}