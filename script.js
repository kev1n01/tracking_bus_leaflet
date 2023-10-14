let $driver_alias = document.getElementById('driver_alias')
function saveAsDriver() {
    if ($driver_alias.value != '') {
        sessionStorage.setItem('alias', $driver_alias.value)
        axios.post(BASE_URL + 'drivers', {
            alias: $driver_alias.value,
        }).then(function (res) {
            sessionStorage.setItem('driver_id', res.data.id)
            redirect()
        }).catch(function (error) {
            console.log(error);
        })
    } else {
        notificationDanger('El alias es obligatorio')
    }
}
function redirect() {
    location.href = "./page/map.html"
}


function isDriverOrStudent(type_user) {
    switch (type_user) {
        case 'driver':
            openModal()
            break;
        case 'student':
            redirect()
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
    isDriverOrStudent('driver')
});

const closeModal = () => {
    $dialog.removeAttribute('open', 'open')
    $dialog.setAttribute('close', 'close')
}
$button_close.addEventListener('click', function () {
    closeModal()
});
console.log('%cSolo mirar, no tocar 🥲😈👽', 'color: #1cfff9; background: #bd4147; font-size: 2.3em; padding: 0.25em 0.5em; margin: 1em; font-family: Helvetica; border: 2px solid white; border-radius: 0.6em; font-weight: bold; text-shadow: 1px 1px 1px #000121; font-style: italic;');