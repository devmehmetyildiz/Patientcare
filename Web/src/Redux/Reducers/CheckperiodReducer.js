import { ACTION_TYPES } from "../Actions/CheckperiodAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const CheckperiodReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_CHECKPERIODS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_CHECKPERIODS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_CHECKPERIODS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_CHECKPERIOD_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_CHECKPERIOD_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_CHECKPERIOD_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_CHECKPERIOD_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_CHECKPERIOD_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Kontrol Grupları', description: 'Kontrol grubu başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_CHECKPERIOD_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_CHECKPERIOD_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_CHECKPERIOD_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Kontrol Grupları', description: 'Kontrol grubu başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_CHECKPERIOD_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_CHECKPERIOD_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_CHECKPERIOD_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Kontrol Grupları', description: 'Kontrol grubu başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_CHECKPERIOD_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_CHECKPERIODS_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_CHECKPERIODS_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_CHECKPERIOD:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default CheckperiodReducer
