import Popup from "./Popup"

export default function ({ dispatch, getState }) {
    return next => action => {
        const state = getState()
        if (action.type === 'INCREMENT_TIMER') {
            if (state.Profile.notifications && state.Profile.notifications.length > 0) {
                let msg = state.Profile.notifications[0]
                Popup(msg.type, msg.code, msg.description)
               // dispatch({ type: ACTION_TYPES.REMOVE_USER_NOTIFICATION })
            }
            return next(action)
        } else {
            return next(action)
        }
    }
}