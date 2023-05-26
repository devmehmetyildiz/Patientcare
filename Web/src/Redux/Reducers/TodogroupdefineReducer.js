import { ACTION_TYPES } from "../Actions/TodogroupdefineAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const TodogroupdefineReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_TODOGROUPDEFINES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_TODOGROUPDEFINES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_TODOGROUPDEFINES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_TODOGROUPDEFINE_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_TODOGROUPDEFINE_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_TODOGROUPDEFINE_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_TODOGROUPDEFINE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_TODOGROUPDEFINE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Yapılacaklar Grubları', description: 'Yapılacaklar Grubu Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_TODOGROUPDEFINE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_TODOGROUPDEFINE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_TODOGROUPDEFINE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Yapılacaklar Grubları', description: 'Yapılacaklar Grubu ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_TODOGROUPDEFINE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_TODOGROUPDEFINE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_TODOGROUPDEFINE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Yapılacaklar Grubları', description: 'Yapılacaklar Grubu ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_TODOGROUPDEFINE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_TODOGROUPDEFINES_NOTIFICATION:
            let messages = [...state.notifications]
            Array.isArray(payload) ? messages = messages.concat(payload) : messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_TODOGROUPDEFINES_NOTIFICATION:
           let messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_TODOGROUPDEFINE:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default TodogroupdefineReducer
