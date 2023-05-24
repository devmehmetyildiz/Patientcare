import { ACTION_TYPES } from "../Actions/FileAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const FileReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_FILES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_FILES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_FILES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_FILE_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_FILE_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_FILE_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_FILE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_FILE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Dosyalar', description: 'Dosya Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_FILE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_FILE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_FILE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Dosyalar', description: 'Dosya Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_FILE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_FILE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_FILE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Dosyalar', description: 'Dosya Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_FILE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_FILES_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_FILES_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_FILE:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default FileReducer
