const notificationInfo = (text_noti) => {
    Toastify({
        text: text_noti,
        duration: 10000,
        style: {
            background: "#39cae8",
        }
    }).showToast();
}

const notificationDanger = (text_noti) => {
    Toastify({
        text: text_noti,
        duration: 10000,
        style: {
            background: '#ed2e2e',
        }
    }).showToast();
}

const notificationWarning = (text_noti) => {
    Toastify({
        text: text_noti,
        duration: 10000,
        style: {
            background: '#d0c826',
        }
    }).showToast();
}