import { toast } from 'react-toastify';
import validator from "./Validator";

const CustomToast = ({ title, message }) => (
    <div>
        <strong>{title}</strong>
        <div>{message}</div>
    </div>
);

function Notification(notifications, removeNotification, Profile) {

    let meta = Profile?.meta?.Config
    let config = {}
    config = (meta && validator.isString(meta)) ? JSON.parse(meta) : {}

    config?.autoClose && (config.autoClose = parseFloat(config.autoClose))
    config?.position && (config.position = `top-${config.position}`)

    if (notifications && notifications.length > 0) {
        notifications.forEach((notification) => {
            if (notification) {
                const { type, code, description } = notification
                switch (type) {
                    case "Success":
                        toast.success(<CustomToast title={code} message={description} />, config);
                        break;
                    case "Information":
                        toast.info(<CustomToast title={code} message={description} />, config);
                        break;
                    case "Error":
                        toast.error(<CustomToast title={code} message={description} />, config);

                        break;
                    default:
                        break;
                }
            } else {
                console.log('notification: ', notification);
                toast.error(<CustomToast title={"Notification Error"} message={"Notification Object Can't Read"} />, config);
            }
            removeNotification()
        })
    }
}

export default Notification