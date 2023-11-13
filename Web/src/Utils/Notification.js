import cogoToast from "@successtar/cogo-toast";
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
            const { type, code, description } = notification
            switch (type) {
                case "Success":
                    toast.success(<CustomToast title={code} message={description} />, config);
                    break;
                case "Error":
                    toast.error(<CustomToast title={code} message={description} />, config);

                    break;
                default:
                    break;
            }
            removeNotification()
        });
    }
}

export default Notification