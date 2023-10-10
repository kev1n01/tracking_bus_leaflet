// const themeToggle = document.getElementById("darkmode_toggle");
// const $article = document.querySelector('article')

// themeToggle.addEventListener("change", () => {
//     if (themeToggle.checked) {
//         $article.removeAttribute('data-theme', 'light')
//         $article.setAttribute('data-theme', 'dark')
//     } else {
//         document.body.style.backgroundColor = "#f7f7f7";
//     }
// });
const BASE_URL = 'http://127.0.0.1:8000/api/'

let $driver_alias = document.getElementById('driver_alias')
function saveAsDriver() {
    if ($driver_alias.value != '') {
        sessionStorage.setItem('alias', $driver_alias.value)
        axios.post(BASE_URL + 'drivers', {
            alias: $driver_alias.value,
        }).then(function (res) {
            console.log();
            sessionStorage.setItem('driver_id', res.data.id)
            redirect()
        }).catch(function (error) {
            console.log(error);
        })
    } else {
        notificationDanger('Ingrese un alias por favor')
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