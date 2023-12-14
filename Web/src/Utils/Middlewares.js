import Cookies from "universal-cookie";
import config from "../Config";
import instanse from "../Redux/axios";
import validator from "./Validator";
import { fillnotification } from "../Redux/ProfileSlice";

const TOKENINTERVAL = 1000 * 60 * 2
const NOTIFICATIONINTERVAL = 1000 * 60 * 5

const tokenMiddleware = store => next => action => {
    if (action.type === 'START_MIDDLEWARES') {
        const intervalId = setInterval(async () => {
            store.dispatch({
                type: 'EXECUTED_TOKEN_TIMER'
            })
            try {
                const localcookies = new Cookies();
                let token = localcookies.get('patientcareRefresh')
                const response = await instanse.post(config.services.Auth, `Oauth/Login`, {
                    grant_type: 'refresh_token',
                    refreshToken: token
                });
                localcookies.set('patientcare', response.data.accessToken, { path: '/' })
                localcookies.set('patientcareRefresh', response.data.refreshToken, { path: '/' })
            } catch (error) {
            }

        }, TOKENINTERVAL);

        next({ ...action, meta: { ...action.meta, intervalId } });
    } else if (action.type === 'STOP_MIDDLEWARES') {
        clearInterval(action.meta.intervalId);
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
                if (validator.isUUID(meta?.Uuid)) {
                    let allnotifications = []
                    try {
                        const notifications = await instanse.get(config.services.Userrole, `Usernotifications/GetUsernotificationsbyUserid/${meta?.Uuid}`);
                        allnotifications = notifications?.data
                    } catch (error) {
                        console.log("error on Start timer middelware")
                    }
                    let unreadednotifications = (allnotifications || []).filter(u => !u.Isreaded && u.Isactive)
                    if (unreadednotifications.length > 0) {
                        store.dispatch(fillnotification({
                            type: 'Information',
                            code: "Bildirimler",
                            description: `Okunmamış ${unreadednotifications.length} adet bildiriminiz var`,
                        }))
                    }
                }
            }


        }, NOTIFICATIONINTERVAL);

        next({ ...action, meta: { ...action.meta, intervalId } });
    } else if (action.type === 'STOP_MIDDLEWARES') {
        clearInterval(action.meta.intervalId);
    } else {
        next(action);
    }
};

export { tokenMiddleware, notificationMiddleware }