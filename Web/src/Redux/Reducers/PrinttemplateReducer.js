import { ACTION_TYPES } from "../Actions/PrinttemplateAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const PrinttemplateReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_PRINTTEMPLATES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_PRINTTEMPLATES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_PRINTTEMPLATES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PRINTTEMPLATE_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_PRINTTEMPLATE_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_PRINTTEMPLATE_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_PRINTTEMPLATE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_PRINTTEMPLATE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Yazdırma Tasarımları', description: 'Tasarım Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_PRINTTEMPLATE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PRINTTEMPLATE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_PRINTTEMPLATE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Yazdırma Tasarımları', description: 'Tasarım Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PRINTTEMPLATE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_PRINTTEMPLATE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_PRINTTEMPLATE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Yazdırma Tasarımları', description: 'Tasarım Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_PRINTTEMPLATE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_PRINTTEMPLATES_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_PRINTTEMPLATES_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_PRINTTEMPLATE:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default PrinttemplateReducer
