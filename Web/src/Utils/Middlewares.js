import config from "../Config";
import instanse from "../Redux/axios";
import validator from "./Validator";
import { fillnotification, handleTokeninterval } from "../Redux/ProfileSlice";

const TOKENINTERVAL = 1000 * 60 * 5
const NOTIFICATIONINTERVAL = 1000 * 60 * 5

const tokenMiddleware = store => next => action => {
    if (action.type === 'START_MIDDLEWARES') {
        const intervalId = setInterval(async () => {
            store.dispatch({
                type: 'EXECUTED_TOKEN_TIMER'
            })
            try {
                let token = localStorage.getItem('patientcareRefresh')
                const response = await instanse.post(config.services.Auth, `Oauth/Login`, {
                    grant_type: 'refresh_token',
                    refreshToken: token
                });
                localStorage.setItem('patientcare', response.data.accessToken)
                localStorage.setItem('patientcareRefresh', response.data.refreshToken)
                console.log("executed timer at ", new Date())
            } catch (error) {
            }

        }, TOKENINTERVAL);

        store.dispatch(handleTokeninterval(intervalId))
        next({ ...action, meta: { ...action.meta, intervalId } });
    } else if (action.type === 'STOP_MIDDLEWARES') {
        const state = store.getState()
        const Profile = state?.Profile
        clearInterval(Profile?.tokenInterval);
    } else {
        next(action);
    }
};

const notificationMiddleware = store => next => action => {
    if (action.type === 'START_MIDDLEWARES') {
        const intervalId = setInterval(async () => {
            store.dispatch({
                type: 'EXECUTED_NOTIFICATION_TIMER'
            })
            const routes = [
                "/Login",
                "/login",
                "/Register",
                "/register",
                "/Forget-password",
                "/Forgetpassword",
                "/forgetpassword",
                "/Passwordreset",
            ]
            const currentPath = window.location.pathname;
            if (!routes.some(route => currentPath.toLowerCase().startsWith(route.toLowerCase()))) {
                const state = store.getState()
                const meta = state.Profile?.meta
                const isfocused = state.Profile?.isFocusedpage

                if (validator.isUUID(meta?.Uuid) && isfocused) {
                    let allnotifications = []
                    try {
                        const notifications = await instanse.get(config.services.Userrole, `Usernotifications/GetUsernotificationsbyUserid/${meta?.Uuid}`);
                        allnotifications = notifications?.data
                    } catch (error) {
                        console.log("error on Start timer middelware")
                    }
                    let unreadednotifications = (allnotifications || []).filter(u => !u.Isreaded && u.Isactive)
                    let unshowednotifications = (allnotifications || []).filter(u => !u.Isshowed && u.Isactive)
                    if (unreadednotifications.length > 0) {
                        store.dispatch(fillnotification({
                            type: 'Information',
                            code: "Bildirimler",
                            description: `${unshowednotifications.length} adet yeni bildiriminiz var, okunmamış ${unreadednotifications.length} adet bildiriminiz var.`,
                        }))
                    }
                }
            }


        }, NOTIFICATIONINTERVAL);

        store.dispatch(handleTokeninterval(intervalId))
        next({ ...action, meta: { ...action.meta, intervalId } });
    } else if (action.type === 'STOP_MIDDLEWARES') {
        const state = store.getState()
        const Profile = state?.Profile
        clearInterval(Profile?.tokenInterval);
    } else {
        next(action);
    }
};

export { tokenMiddleware, notificationMiddleware }