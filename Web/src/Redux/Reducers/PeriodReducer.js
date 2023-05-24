import { ACTION_TYPES } from "../Actions/PeriodAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const PeriodReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_PERIODS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_PERIODS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_PERIODS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PERIOD_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_PERIOD_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_PERIOD_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_PERIOD_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_PERIOD_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Kontroller', description: 'Kontrol Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_PERIOD_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PERIOD_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_PERIOD_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Kontroller', description: 'Kontrol Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PERIOD_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_PERIOD_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_PERIOD_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Kontroller', description: 'Kontrol Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_PERIOD_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_PERIODS_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_PERIODS_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_PERIOD:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default PeriodReducer
