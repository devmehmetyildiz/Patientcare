import { ACTION_TYPES } from "../Actions/PatientmovementAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const PatientmovementReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_PATIENTMOVEMENTS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_PATIENTMOVEMENTS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_PATIENTMOVEMENTS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PATIENTMOVEMENT_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_PATIENTMOVEMENT_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_PATIENTMOVEMENT_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_PATIENTMOVEMENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_PATIENTMOVEMENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Hareketleri', description: 'Hasta Hareketi Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_PATIENTMOVEMENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PATIENTMOVEMENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_PATIENTMOVEMENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Hareketleri', description: 'Hasta Hareketi Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PATIENTMOVEMENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_PATIENTMOVEMENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_PATIENTMOVEMENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hasta Hareketleri', description: 'Hasta Hareketi Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_PATIENTMOVEMENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_PATIENTMOVEMENTS_NOTIFICATION:
            let messages = [...state.notifications]
            Array.isArray(payload) ? messages = messages.concat(payload) : messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_PATIENTMOVEMENTS_NOTIFICATION:
           let messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_PATIENTMOVEMENT:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default PatientmovementReducer
