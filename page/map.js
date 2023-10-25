//init Leaflet 
var map = L.map('map', {
    zoomControl: false,
}).setView([-9.914953, -76.230911], 14)
L.control.zoom({
    position: 'bottomright'
}).addTo(map)

const styleDefault = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})

const styleDark = L.tileLayer(MAP_DARK, {
    maxZoom: 18,
})

var theme = localStorage.getItem('theme')

theme === 'dark' ? styleDark.addTo(map) : styleDefault.addTo(map)

const logoutButton = L.easyButton({
    position: 'bottomright',
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
let alias = localStorage.getItem('alias')
let driver_id = localStorage.getItem('driver_id')
let driverMarkers = {}
if (driver_id != null) {
    notificationWarning('Recuerda salir para cerrar sesión  😉')
}

const legend = L.control.Legend({
    position: "bottomleft",
    collapsed: false,
    symbolWidth: 24,
    opacity: 1,
    column: 2,
    title: 'Leyenda',
    legends: [{
        label: "Buses",
        type: "image",
        url: "../img/bus_icon_2.png",
    }, {
        label: "Tu bus",
        type: "image",
        url: "../img/bus_icon.png"
    }, {
        label: "Paraderos",
        type: "circle",
        radius: 6,
        stroke: "rgb(51, 136, 255)",
        fillColor: "rgb(51, 136, 255)",
        fillOpacity: 0.4,
        weight: 2,
    },
    {
        label: "Ruta salida",
        type: "polyline",
        color: "#FF0000",
        fillColor: "#FF0000",
        dashArray: [10, 5],
        weight: 2,
    }, {
        label: "Ruta retorno",
        type: "polyline",
        color: "#0000FF",
        fillColor: "#0000FF",
        dashArray: [10, 5],
        weight: 2
    }]
}).addTo(map)

const bus_icon = L.icon({
    iconUrl: '../img/bus_icon.png',
    iconSize: [40, 40],
})
const bus_icon_2 = L.icon({
    iconUrl: '../img/bus_icon_2.png',
    iconSize: [40, 40],
})
const soul_icon = L.icon({
    iconUrl: '../img/soul_icon.png',
    iconSize: [40, 40],
});
const soul_icon_2 = L.icon({
    iconUrl: '../img/soul_icon_2.png',
    iconSize: [40, 40],
});
const points = [
    { lat: -9.9224276, lng: -76.2326591, alias: "Puente Esteban Pavletich" },
    { lat: -9.9308852, lng: -76.2340732, alias: "Puente Señor de Burgos" },
    { lat: -9.927321, lng: -76.236112, alias: "Hospital Hermilio Valdizán" },
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

L.control.locate({
    position: 'bottomright',
    drawCircle: true,
    circleStyle: {
        fillColor: '#f41e1e',
        radius: 0.2,
        fillOpacity: 0.4,
        stroke: "rgb(51, 136, 255)",
    },
    markerClass: L.marker,
    markerStyle: {
        icon: soul_icon_2
    },
    toFly: true,
    showPopup: true,
    strings: {
        title: "Mostrar mi ubicación",
        popup: "Mi ubicacion actual"
    },
    onLocationError: function (err) {
        notificationInfo('Por favor, permite acceder a tu ubicación desde la aplicación \n Y activa el gps de tu celular')
    },
}).addTo(map)

const getValuesGeolocation = (pos) => {
    return {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        speed: pos.coords.speed,
        heading: pos.coords.heading,
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
    return L.polyline(coords, { color: color, smoothFactor: 10, noClip: true, lineJoin: 'round', lineCap: 'round', dashArray: '10, 5' }).addTo(map)
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

function getDistanceToPoints(coords) {
    let rows = []
    points.forEach(p => {
        let km = distanceInKmBetweenEarthCoordinates(coords[0], coords[1], p.lat, p.lng)
        rows.push('A ' + km.toFixed(1) + ' km del paradero ' + p.alias)
    })
    return rows
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
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
                        .on('click', () => {
                            const description = document.getElementById('description')
                            const p = document.getElementById('title_info')
                            description.style.display = 'block'
                            let ul = document.getElementById('text_info')
                            while (ul.firstChild) {
                                ul.removeChild(ul.firstChild);
                            }
                            // setTimeout(() => {
                            //     description.classList.add('fade-out')
                            //     setTimeout(() => {
                            //         description.classList.remove('fade-out')
                            //         description.style.display = 'none'
                            //     }, 300)
                            // }, 5000)
                            p.textContent = 'Distancias de los paraderos del bus: ' + driver.alias
                            let info = getDistanceToPoints([driver.lat, driver.lng])
                            console.log(info);
                            info.forEach(row => {
                                const el_li = document.createElement('li')
                                el_li.textContent = row
                                ul.appendChild(el_li)
                            })
                        })

                    driverMarkers[driverId] = marker_new
                    let data_show = '<strong>Poni: </strong> ' + driver.alias + '<br><strong>Coordenadas: </strong> ' + driver.lat + ', ' + driver.lng
                    popupMarkerPosition(data_show, marker_new)
                }
            })
        }).catch(function (error) {
            // console.log(error)
        })
}
setInterval(getDriversApi, 2000)
const button_close = document.getElementById('close')
const description = document.getElementById('description')
button_close.addEventListener('click', () => {
    description.classList.add('fade-out')
    setTimeout(() => {
        description.classList.remove('fade-out')
        description.style.display = 'none'
    }, 200)
})
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
            map.removeLayer(marker)
        }
        marker = markerPosition([values.lat, values.lng], bus_icon, map)
        popupMarkerPosition('Yo: ' + alias + '<br>Lat: ' + values.lat + '<br>Lng: ' + values.lng + '<br>Speed: ' + values.speed + '<br>Heading: ' + values.heading, marker)
        updateMyCoordenates(values.lat, values.lng, driver_id)
    }

    function errorCallback(err) {
        if (err.code === 1) { notificationInfo('Por favor, permite acceder a tu ubicación desde la aplicación \n Y activa el gps de tu celular') }
    }
}

function deleteDriver(id) {
    axios.delete(BASE_URL + 'drivers/' + id)
        .then(function (res) {
            if (res.status === 200) {
                localStorage.removeItem('driver_id')
                localStorage.removeItem('alias')
                location.href = "../index.html"
            } else {
                notificationInfo('Hay un problema al cerrar sesión')
            }
        }).catch(function (error) {
            console.log(error)
        })
}

const endDriver = () => {
    deleteDriver(driver_id)
}

if (driver_id !== null) {
    logoutButton.addTo(map)
}

console.log('%cSolo mirar, no tocar 🥲😈👽', 'color: #1cfff9; background: #bd4147; font-size: 2.3em; padding: 0.25em 0.5em; margin: 1em; font-family: Helvetica; border: 2px solid white; border-radius: 0.6em; font-weight: bold; text-shadow: 1px 1px 1px #000121; font-style: italic;');
