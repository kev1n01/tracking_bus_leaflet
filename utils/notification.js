const notificationInfo = (text_noti) => {
    Toastify({
        text: text_noti,
        duration: 7000,
        style: {
            background: "#39cae8",
        }
    }).showToast();
}

const notificationDanger = (text_noti) => {
    Toastify({
        text: text_noti,
        duration: 5000,
        style: {
            background: '#ed2e2e',
        }
    }).showToast();
}

const notificationWarning = (text_noti) => {
    Toastify({
        text: text_noti,
        duration: 5000,
        style: {
            background: '#d0c826',
        }
    }).showToast();
}