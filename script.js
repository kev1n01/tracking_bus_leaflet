let $driver_alias = document.getElementById('driver_alias')
function saveAsDriver() {
    if ($driver_alias.value != '') {
        localStorage.setItem('alias', $driver_alias.value)
        axios.post(BASE_URL + 'drivers', {
            alias: $driver_alias.value,
        }).then(function (res) {
            localStorage.setItem('driver_id', res.data.id)
            redirectToMap()
        }).catch(function (error) {
            console.log(error);
        })
    } else {
        notificationDanger('El alias es obligatorio')
    }
}
function redirectToMap() {
    location.href = "./page/map.html"
}

let $driver_id = localStorage.getItem('driver_id')

if ($driver_id != null) {
    notificationDanger('Recuerda cerrar sesión antes de salir 😉')
}

function isDriverOrStudent(type_user) {
    switch (type_user) {
        case 'driver':
            openModal()
            break;
        case 'student':
            redirectToMap()
            break;
    }
}

let $button_close = document.getElementById('button_close')
let $btn_driver = document.getElementById('btn_driver')
let $dialog = document.querySelector('dialog')
const openModal = () => {
    $dialog.setAttribute('open', 'open')
}
$btn_driver.addEventListener('click', function () {
    console.log($driver_id);
    $driver_id != null ? redirectToMap() : isDriverOrStudent('driver')
});

const closeModal = () => {
    $dialog.removeAttribute('open', 'open')
    $dialog.setAttribute('close', 'close')
}
$button_close.addEventListener('click', function () {
    closeModal()
});
console.log('%cSolo mirar, no tocar 🥲😈👽', 'color: #1cfff9; background: #bd4147; font-size: 2.3em; padding: 0.25em 0.5em; margin: 1em; font-family: Helvetica; border: 2px solid white; border-radius: 0.6em; font-weight: bold; text-shadow: 1px 1px 1px #000121; font-style: italic;')

const $toggle = document.getElementById('toggle')
const $html = document.querySelector('html')
const $nav = document.querySelector('nav')
const $h4 = document.querySelector('h4')
const $btn_go = document.getElementById('btn_go')
const $svg = document.getElementById('Layer_1')
const $code = document.getElementById('code')
const $code2 = document.getElementById('code2')
let $theme_init = localStorage.getItem('theme')
switch ($theme_init) {
    case 'light':
        $btn_go.style.background = '#264161'
        $btn_go.style.color = '#ebebeb'
        $svg.style.fill = '#ebebeb'
        $h4.style.color = '#264161'
        $code.style.color = '#264161'
        $code2.style.color = '#264161'
        $nav.style.background = 'hsl(205, 20%, 94%)'
        $toggle.classList.add('active')
        $html.setAttribute('data-theme', 'light')
        break;
    case 'dark':
        $btn_go.style.background = 'rgb(214, 214, 214)'
        $btn_go.style.color = '#141e26'
        $svg.style.fill = '#141e26'
        $h4.style.color = '#dadada'
        $code.style.color = '#ebebeb'
        $code2.style.color = '#ebebeb'
        $nav.style.background = '#141e26'
        $html.setAttribute('data-theme', 'dark')
        break
    case null:
        localStorage.setItem('theme', 'dark')
        break
}

$toggle.addEventListener('click', () => {
    var $theme_status = localStorage.getItem('theme')
    if ($theme_status === 'light') {
        $btn_go.style.background = 'rgb(214, 214, 214)'
        $btn_go.style.color = '#141e26'
        $svg.style.fill = '#141e26'
        $h4.style.color = '#dadada'
        $code.style.color = '#ebebeb'
        $code2.style.color = '#ebebeb'
        $nav.style.background = '#141e26'
        $toggle.classList.remove('active')
        $html.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
    } else {
        $btn_go.style.background = '#264161'
        $btn_go.style.color = '#ebebeb'
        $svg.style.fill = '#ebebeb'
        $code.style.color = '#264161'
        $code2.style.color = '#264161'
        $h4.style.color = '#264161'
        $nav.style.background = 'hsl(205, 20%, 94%)'
        $toggle.classList.add('active')
        $html.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
    }
})