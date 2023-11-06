import cogoToast from "@successtar/cogo-toast";
import { toast } from 'react-toastify';


const CustomToast = ({ title, message }) => (
    <div>
        <strong>{title}</strong>
        <div>{message}</div>
    </div>
);

function Notification(notifications, removeNotification) {
    if (notifications && notifications.length > 0) {
        notifications.forEach((notification, index) => {
            const { type, code, description } = notification
            switch (type) {
                case "Success":
                    toast.success(<CustomToast title={code} message={description} />);
                    break;
                case "Error":
                    toast.error(<CustomToast title={code} message={description} />);

                    break;
                default:
                    break;
            }
            removeNotification()
        });
    }
}

export default Notification