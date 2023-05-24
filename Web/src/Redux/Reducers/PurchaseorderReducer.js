import { ACTION_TYPES } from "../Actions/PurchaseorderAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const PurchaseordersReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_PURCHASEORDERS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_PURCHASEORDERS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_PURCHASEORDERS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ALLPURCHASEORDERS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ALLPURCHASEORDERS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ALLPURCHASEORDERS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PURCHASEORDER_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_PURCHASEORDER_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_PURCHASEORDER_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_PURCHASEORDER_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_PURCHASEORDER_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Siparişler', description: 'Sipariş ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_PURCHASEORDER_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.COMPLETE_PURCHASEORDER_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.COMPLETE_PURCHASEORDER_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Siparişler', description: 'Sipariş Başarı ile Tamamlandı' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.COMPLETE_PURCHASEORDER_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PURCHASEORDER_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_PURCHASEORDER_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Siparişler', description: 'Sipariş Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PURCHASEORDER_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_PURCHASEORDER_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_PURCHASEORDER_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Siparişler', description: 'Sipariş Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_PURCHASEORDER_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_PURCHASEORDERS_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_PURCHASEORDERS_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_PURCHASEORDER:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default PurchaseordersReducer
