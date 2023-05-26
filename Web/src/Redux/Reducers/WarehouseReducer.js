import { ACTION_TYPES } from "../Actions/WarehouseAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const WarehouseReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_WAREHOUSES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_WAREHOUSES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_WAREHOUSES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ALLWAREHOUSES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ALLWAREHOUSES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ALLWAREHOUSES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_WAREHOUSE_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_WAREHOUSE_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_WAREHOUSE_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_WAREHOUSE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_WAREHOUSE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ambalar', description: 'Ambar Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_WAREHOUSE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_WAREHOUSE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_WAREHOUSE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ambalar', description: 'Ambar Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_WAREHOUSE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_WAREHOUSE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_WAREHOUSE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Ambalar', description: 'Ambar Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_WAREHOUSE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_WAREHOUSES_NOTIFICATION:
            let messages = [...state.notifications]
            Array.isArray(payload) ? messages = messages.concat(payload) : messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_WAREHOUSES_NOTIFICATION:
           let messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_WAREHOUSE:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default WarehouseReducer
