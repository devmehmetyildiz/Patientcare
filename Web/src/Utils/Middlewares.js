import config from "../Config";
import instanse from "../Redux/axios";
import validator from "./Validator";
import { fillnotification, handleTokeninterval } from "../Redux/ProfileSlice";
import { STORAGE_KEY_PATIENTCARE_ACCESSTOKEN, STORAGE_KEY_PATIENTCARE_EXPIRETIME, STORAGE_KEY_PATIENTCARE_REFRESHTOKEN } from "./Constants";

const TOKENINTERVAL = 1000 * 10

const NOTIFICATIONINTERVAL = 1000 * 60 * 10

const BREAKDOWNMAINTEANCE_INTERVAL = 1000 * 60 * 15

const StartMiddleWares = (store) => {
    store.dispatch({
        type: 'START_NOTIFICATION_MIDDLEWARES'
    })
    store.dispatch({
        type: 'START_TOKEN_MIDDLEWARES'
    })
    store.dispatch({
        type: 'START_BREAKDOWNMAINTEANCE_MIDDLEWARES'
    })
}

const tokenMiddleware = store => next => action => {
    if (action.type === 'START_TOKEN_MIDDLEWARES') {
        const intervalId = setInterval(async () => {
            store.dispatch({
                type: 'EXECUTED_TOKEN_TIMER'
            })
            try {
                const accessToken = localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN)
                const refreshToken = localStorage.getItem(STORAGE_KEY_PATIENTCARE_REFRESHTOKEN)
                const rawExpireTime = localStorage.getItem(STORAGE_KEY_PATIENTCARE_EXPIRETIME)

                if (validator.isISODate(rawExpireTime) && accessToken && refreshToken) {
                    const expireTime = new Date(rawExpireTime)
                    const now = new Date()
                    now.setMinutes(now.getMinutes() + 30)

                    if (now.getTime() > expireTime.getTime()) {
                        const response = await instanse.post(config.services.Auth, `Oauth/Login`, {
                            grant_type: 'refresh_token',
                            refreshToken: refreshToken
                        });

                        localStorage.setItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN, response.data.accessToken)
                        localStorage.setItem(STORAGE_KEY_PATIENTCARE_REFRESHTOKEN, response.data.refreshToken)
                        localStorage.setItem(STORAGE_KEY_PATIENTCARE_EXPIRETIME, response.data.ExpiresAt)

                        console.log("Token Refreshed ", new Date())
                    } else {
                    }
                } else {
                }
            } catch (error) {
                console.log('Refresh Token Error: ', error);
            }
        }, TOKENINTERVAL);

        store.dispatch(handleTokeninterval(intervalId))
        next({ ...action, meta: { ...action.meta, intervalId } });
    } else if (action.type === 'STOP_TOKEN_MIDDLEWARES') {
        const state = store.getState()
        const Profile = state?.Profile
        clearInterval(Profile?.tokenInterval);
    } else {
        next(action);
    }
};

const notificationMiddleware = store => next => action => {
    if (action.type === 'START_NOTIFICATION_MIDDLEWARES') {
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
                    let unShowedCount = 0
                    let unReadCount = 0
                    try {
                        const unShowedCountResponse = await instanse.get(config.services.Userrole, `Usernotifications/GetUnshowedNotificationCountByUser/${meta?.Uuid}`);
                        const unReadCountResponse = await instanse.get(config.services.Userrole, `Usernotifications/GetUnreadNotificationCountByUser/${meta?.Uuid}`);
                        unShowedCount = unShowedCountResponse?.data
                        unReadCount = unReadCountResponse?.data
                    } catch (error) {
                        console.log("error on Start timer middelware")
                    }
                    if (unShowedCount > 0 || unReadCount > 0) {
                        store.dispatch(fillnotification({
                            type: 'Information',
                            code: "Bildirimler",
                            description: `${unShowedCount > 0 ? `${unShowedCount} adet yeni bildiriminiz var` : ''} ${unReadCount > 0 ? `${unReadCount} adet okunmamış bildiriminiz var` : ''}.`,
                        }))
                    }
                }
            }


        }, NOTIFICATIONINTERVAL);

        store.dispatch(handleTokeninterval(intervalId))
        next({ ...action, meta: { ...action.meta, intervalId } });
    } else if (action.type === 'STOP_NOTIFICATION_MIDDLEWARES') {
        const state = store.getState()
        const Profile = state?.Profile
        clearInterval(Profile?.tokenInterval);
    } else {
        next(action);
    }
};

const breakdownMainteanceMiddleware = store => next => action => {
    if (action.type === 'START_BREAKDOWNMAINTEANCE_MIDDLEWARES') {
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
                    let openBreakdowns = 0
                    let openMainteancies = 0
                    try {
                        const openResponseBreakdowns = await instanse.get(config.services.Warehouse, `Breakdowns/GetOpenedBreakdownCount`);
                        const openResponseMainteancies = await instanse.get(config.services.Warehouse, `Mainteancies/GetOpenedMainteanceCount`);
                        openBreakdowns = openResponseBreakdowns?.data
                        openMainteancies = openResponseMainteancies?.data
                    } catch (error) {
                        console.log("error on Start timer middelware")
                    }
                    if (openBreakdowns > 0 || openMainteancies > 0) {
                        store.dispatch(fillnotification({
                            type: 'Information',
                            code: "Bildirimler",
                            description: `${openBreakdowns > 0 ? `${openBreakdowns} adet açık arıza bildirimi var` : ''} ${openMainteancies > 0 ? `${openMainteancies} adet açık bakım talebi var` : ''}.`,
                        }))
                    }
                }
            }


        }, BREAKDOWNMAINTEANCE_INTERVAL);

        store.dispatch(handleTokeninterval(intervalId))
        next({ ...action, meta: { ...action.meta, intervalId } });
    } else if (action.type === 'STOP_BREAKDOWNMAINTEANCE_MIDDLEWARES') {
        const state = store.getState()
        const Profile = state?.Profile
        clearInterval(Profile?.tokenInterval);
    } else {
        next(action);
    }
};

export { tokenMiddleware, notificationMiddleware, breakdownMainteanceMiddleware, StartMiddleWares }