import cogoToast from "@successtar/cogo-toast";

function notification(notifications,removeNotification) {
    if (notifications && notifications.length > 0) {
        const { type, code, description } = notifications[0]
        const toastoptions = {
            hideAfter: 5,
            position: 'top-right',
            heading: code
        }
        switch (type) {
            case "Success":
                cogoToast.success(description, toastoptions)
                break;
            case "Error":
                cogoToast.error(description, toastoptions)
                break;
            default:
                break;
        }
        removeNotification()
    }
}

export default notification