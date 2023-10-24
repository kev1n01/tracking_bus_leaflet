const notificationInfo = (text_noti) => {
    Toastify({
        close: true,
        newWindow: true,
        text: text_noti,
        duration: 7000,
        gravity: "top",
        style: {
            background: "#39cae8",
        }
    }).showToast();
}

const notificationDanger = (text_noti) => {
    Toastify({
        close: true,
        newWindow: true,
        text: text_noti,
        duration: 5000,
        gravity: "top",
        style: {
            background: '#ed2e2e',
        }
    }).showToast();
}

const notificationWarning = (text_noti) => {
    Toastify({
        close: true,
        newWindow: true,
        text: text_noti,
        duration: 5000,
        gravity: "top",
        style: {
            background: '#d0c826',
        }
    }).showToast();
}