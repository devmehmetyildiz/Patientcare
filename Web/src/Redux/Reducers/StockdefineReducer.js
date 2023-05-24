import { ACTION_TYPES } from "../Actions/StockdefineAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const StockdefinesReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_STOCKDEFINES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_STOCKDEFINES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_STOCKDEFINES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ALLSTOCKDEFINES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ALLSTOCKDEFINES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ALLSTOCKDEFINES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_STOCKDEFINE_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_STOCKDEFINE_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_STOCKDEFINE_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_STOCKDEFINE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_STOCKDEFINE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ürün Tanımları', description: 'Ürün Tanımı Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_STOCKDEFINE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_STOCKDEFINE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_STOCKDEFINE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ürün Tanımları', description: 'Ürün Tanımı Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_STOCKDEFINE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_STOCKDEFINE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_STOCKDEFINE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ürün Tanımları', description: 'Ürün Tanımı Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_STOCKDEFINE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_STOCKDEFINES_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_STOCKDEFINES_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_STOCKDEFINE:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default StockdefinesReducer
