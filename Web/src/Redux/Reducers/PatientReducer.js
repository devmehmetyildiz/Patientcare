import { ACTION_TYPES } from "../Actions/PatientAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false,
    isCheckperiodloading: false,
    isTodogroupdefineloading: false,
    selected_patient: {}
}

const PatientReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_PATIENTS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_PATIENTS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_PATIENTS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PATIENT_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_PATIENT_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_PATIENT_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_PATIENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_PATIENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hastalar', description: 'Hasta Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_PATIENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PATIENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_PATIENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hastalar', description: 'Hasta Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PATIENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PATIENTTODOGROUPDEFINE_INIT:
            return { ...state, isTodogroupdefineloading: true }
        case ACTION_TYPES.EDIT_PATIENTTODOGROUPDEFINE_SUCCESS:
            return {
                ...state, isTodogroupdefineloading: false, selected_patient: payload.find(u => u.concurrencyStamp === state.selected_patient.concurrencyStamp), list: payload,
                notifications: [{ type: 'Success', code: 'Hastalar', description: 'Hasta Yapılacağı başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PATIENTTODOGROUPDEFINE_ERROR:
            return { ...state, isTodogroupdefineloading: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PATIENTCHECKPERIOD_INIT:
            return { ...state, isCheckperiodloading: true }
        case ACTION_TYPES.EDIT_PATIENTCHECKPERIOD_SUCCESS:
            return {
                ...state, isCheckperiodloading: false, selected_patient: payload.find(u => u.concurrencyStamp === state.selected_patient.concurrencyStamp), list: payload,
                notifications: [{ type: 'Success', code: 'Hastalar', description: 'Hasta Kontrol grubu başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PATIENTCHECKPERIOD_ERROR:
            return { ...state, isCheckperiodloading: false, errmsg: payload }

        case ACTION_TYPES.DELETE_PATIENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_PATIENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Hastalar', description: 'Hasta Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_PATIENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_PATIENTS_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_PATIENTS_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_PATIENT:
            return { ...state, selected_patient: {} }
        case ACTION_TYPES.SET_SELECTED_PATIENT:
            return { ...state, selected_patient: payload }
        default:
            return state
    }
}

export default PatientReducer
