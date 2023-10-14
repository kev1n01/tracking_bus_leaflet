//init Leaflet 
var map = L.map('map', {
    zoomControl: true,
}).setView([-9.914953, -76.230911], 14)

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map)

L.tileLayer('https://api.mapbox.com/styles/v1/mantequillita21/clnqi8rln00a501qjexvxd4bx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibWFudGVxdWlsbGl0YTIxIiwiYSI6ImNrbXh4MGZwOTAzMGwydnBnNXV4NG91bjMifQ.wljneJmPr3jJUSgzLB6YTg', {
    maxZoom: 18,
}).addTo(map)


const logoutButton = L.easyButton({
    states: [
        {
            stateName: 'show-tooltip',
            title: 'Salir',
            icon: '<strong>Salir</strong>',
            onClick: function () {
                endDriver()
                control.state('show-tooltip')
            }
        }
    ]
})
logoutButton.button.style.backgroundColor = 'red'
logoutButton.button.style.color = 'white'
logoutButton.button.style.width = '60px'

let marker, circle, data_drivers
let alias = sessionStorage.getItem('alias')
let driver_id = sessionStorage.getItem('driver_id')
let driverMarkers = {}

const bus_icon = L.icon({
    iconUrl: '../img/bus_icon.png',
    iconSize: [40, 40],
})

const bus_icon_2 = L.icon({
    iconUrl: '../img/bus_icon_2.png',
    iconSize: [40, 40],
})

const points = [
    { lat: -9.9224276, lng: -76.2326591, alias: "Ovalo pabletich" },
    { lat: -9.9308852, lng: -76.2340732, alias: "Puente burgos" },
    { lat: -9.927321, lng: -76.236112, alias: "Hospital de Huánuco" },
    { lat: -9.909679, lng: -76.228947, alias: "Huayopampa" },
    { lat: -9.925091, lng: -76.232970, alias: "Llicua" },
    { lat: -9.898520, lng: -76.222629, alias: "Jancao" },
    { lat: -9.891078, lng: -76.217930, alias: "UDH" },
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
    }
}

const markerPosition = (pos = [], icon = null, map) => {
    return L.marker(pos, { icon: icon }).addTo(map)
}
//function to add popup
const popupMarkerPosition = (data, marker_me) => {
    marker_me.bindPopup(data)
}

//function for draw points with circlemarker
const circleMarkerPosition = (pos = [], map, radius = null) => {
    return L.circleMarker(pos, { radius: radius ?? 15 }).addTo(map)
}

// function for draw line Leaflet
const polyLinePosition = (coords, map, color) => {
    return L.polyline(coords, { color: color }).addTo(map)
}

//drawing points 
points.forEach(el => {
    marker_circle = circleMarkerPosition([el.lat, el.lng], map, 30)
    popupMarkerPosition(el.alias, marker_circle)
})

//draw line routes 
polyLinePosition(routes_start, map, 'red')
polyLinePosition(routes_end, map, 'blue')

// get a coordenate each 2 seconds
const options = {
    enableHighAccuary: true,
    timeout: 2000,
}

function deleteMarkers() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
}
// delete markers that dont match to data response getDrivers 
function deleteMarkersNotFound(data, driverMarkers) {
    for (const driverId in driverMarkers) {
        const driverNotFound = data.find(driver => driver.id === parseInt(driverId));
        if (!driverNotFound) {
            map.removeLayer(driverMarkers[driverId]);
            delete driverMarkers[driverId];
        }
    }
}
//function get drivers
function getDriversApi() {
    axios.get(BASE_URL + 'drivers')
        .then(function (res) {
            data_drivers = res.data.data

            let filter_data = data_drivers.filter(el => el.id !== parseInt(driver_id))

            deleteMarkersNotFound(filter_data, driverMarkers)

            filter_data.forEach(driver => {
                let driverId = driver.id
                if (driverMarkers[driverId]) {
                    driverMarkers[driverId].setLatLng([driver.lat, driver.lng])
                } else {
                    const marker_new = markerPosition([driver.lat, driver.lng], bus_icon_2, map)
                    driverMarkers[driverId] = marker_new
                    popupMarkerPosition(driver.alias, marker_new)
                }
            })
        }).catch(function (error) {
            // console.log(error)
        })
}
setInterval(getDriversApi, 2000)

function updateMyCoordenates(lat_driver, lng_driver, id) {
    axios.put(BASE_URL + 'drivers/' + id, {
        lat: lat_driver,
        lng: lng_driver
    })
        .then(function (res) {
            // console.log(res.data)
        }).catch(function (error) {
            console.log(error)
        })
}
if (alias) {
    navigator.geolocation.watchPosition(successCallback, errorCallback, options)
    function successCallback(pos) {
        const values = getValuesGeolocation(pos)
        if (marker) {
            marker.setLatLng([values.lat, values.lng])
        }
        marker = markerPosition([values.lat, values.lng], bus_icon, map)
        popupMarkerPosition('Lat: ' + values.lat + '<br>Lng: ' + values.lng + '<br>Speed: ' + values.speed, marker)
        updateMyCoordenates(values.lat, values.lng, driver_id)
    }

    function errorCallback(err) {
        console.log(err)
        err.code === 1 ? notificationInfo('Por favor, permite acceder a tu ubicación desde la aplicación \n Y activa el gps de tu celular')
            : notificationWarning('No sé puede obtener tu ubicación, espere un momento')
    }
}

function deleteDriver(id) {
    axios.delete(BASE_URL + 'drivers/' + id)
        .then(function (res) {
            if (res.status === 200) {
                sessionStorage.removeItem('driver_id')
                sessionStorage.removeItem('alias')
                location.href = "../index.html"
            } else {
                notificationInfo('Hay un problema al cerrar sesión')
            }
        }).catch(function (error) {
            console.log(error)
        })
}

const endDriver = () => {
    map.removeLayer(marker)
    deleteDriver(driver_id)
}
if (driver_id !== null) {
    logoutButton.addTo(map)
}
console.log('%cSolo mirar, no tocar 🥲😈👽', 'color: #1cfff9; background: #bd4147; font-size: 2.3em; padding: 0.25em 0.5em; margin: 1em; font-family: Helvetica; border: 2px solid white; border-radius: 0.6em; font-weight: bold; text-shadow: 1px 1px 1px #000121; font-style: italic;');