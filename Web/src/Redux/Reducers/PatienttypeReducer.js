import { ACTION_TYPES } from "../Actions/PatienttypeAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const PatienttypeReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_PATIENTTYPES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_PATIENTTYPES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_PATIENTTYPES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ALLPATIENTTYPES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ALLPATIENTTYPES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ALLPATIENTTYPES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PATIENTTYPE_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_PATIENTTYPE_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_PATIENTTYPE_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_PATIENTTYPE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_PATIENTTYPE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Türleri', description: 'Hasta Türü Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_PATIENTTYPE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PATIENTTYPE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_PATIENTTYPE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Türleri', description: 'Hasta Türü Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PATIENTTYPE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_PATIENTTYPE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_PATIENTTYPE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Türleri', description: 'Hasta Türü Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_PATIENTTYPE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_PATIENTTYPES_NOTIFICATION:
            let messages = [...state.notifications]
            Array.isArray(payload) ? messages = messages.concat(payload) : messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_PATIENTTYPES_NOTIFICATION:
            let messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_PATIENTTYPE:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default PatienttypeReducer
