const notification = (text_noti) => {
    Toastify({
        text: text_noti,
        duration: 15000,
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