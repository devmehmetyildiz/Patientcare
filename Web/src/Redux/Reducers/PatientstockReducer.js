import { ACTION_TYPES } from "../Actions/PatientstockAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const PatientstockReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_PATIENTSTOCKS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_PATIENTSTOCKS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_PATIENTSTOCKS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ALLPATIENTSTOCKS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ALLPATIENTSTOCKS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ALLPATIENTSTOCKS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PATIENTSTOCK_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_PATIENTSTOCK_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_PATIENTSTOCK_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_PATIENTSTOCK_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_PATIENTSTOCK_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Stokları', description: 'Hasta Stoğu Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_PATIENTSTOCK_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PATIENTSTOCK_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_PATIENTSTOCK_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Stokları', description: 'Hasta Stoğu Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PATIENTSTOCK_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_PATIENTSTOCK_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_PATIENTSTOCK_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Stokları', description: 'Hasta Stoğu Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_PATIENTSTOCK_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_PATIENTSTOCKS_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_PATIENTSTOCKS_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_PATIENTSTOCK:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default PatientstockReducer
