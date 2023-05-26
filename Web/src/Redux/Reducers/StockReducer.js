import { ACTION_TYPES } from "../Actions/StockAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const StocksReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_STOCKS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_STOCKS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_STOCKS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ALLSTOCKS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ALLSTOCKS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ALLSTOCKS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_STOCK_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_STOCK_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_STOCK_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_STOCK_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_STOCK_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ürünler', description: 'Ürün Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_STOCK_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_STOCK_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_STOCK_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ürünler', description: 'Ürün Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_STOCK_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_STOCK_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_STOCK_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ürünler', description: 'Ürün Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_STOCK_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.MOVE_STOCK_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.MOVE_STOCK_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ürünler', description: 'Ürün Başarı ile Bağlandı' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.MOVE_STOCK_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DEACTIVATE_STOCK_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DEACTIVATE_STOCK_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ürünler', description: 'Ürün Başarı ile İtlaf edildi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DEACTIVATE_STOCK_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_STOCKS_NOTIFICATION:
            let messages = [...state.notifications]
            Array.isArray(payload) ? messages = messages.concat(payload) : messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_STOCKS_NOTIFICATION:
           let messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_STOCK:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default StocksReducer
