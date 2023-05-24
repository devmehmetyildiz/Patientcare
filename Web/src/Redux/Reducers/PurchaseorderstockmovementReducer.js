import { ACTION_TYPES } from "../Actions/PurchaseorderstockmovementAction"

const defaultState = {
    list: [],
    selected_record: {},
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const PurchaseorderstockmovementReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_PURCHASEORDERSTOCKMOVEMENTS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_PURCHASEORDERSTOCKMOVEMENTS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_PURCHASEORDERSTOCKMOVEMENTS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ALLPURCHASEORDERSTOCKMOVEMENTS_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ALLPURCHASEORDERSTOCKMOVEMENTS_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ALLPURCHASEORDERSTOCKMOVEMENTS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PURCHASEORDERSTOCKMOVEMENT_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_PURCHASEORDERSTOCKMOVEMENT_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_PURCHASEORDERSTOCKMOVEMENT_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_PURCHASEORDERSTOCKMOVEMENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_PURCHASEORDERSTOCKMOVEMENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Satın alma stok hareketleri', description: 'Satın alma stok hareketi Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_PURCHASEORDERSTOCKMOVEMENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_PURCHASEORDERSTOCKMOVEMENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_PURCHASEORDERSTOCKMOVEMENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Satın alma stok hareketleri', description: 'Satın alma stok hareketi Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_PURCHASEORDERSTOCKMOVEMENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_PURCHASEORDERSTOCKMOVEMENT_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_PURCHASEORDERSTOCKMOVEMENT_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Satın alma stok hareketleri', description: 'Satın alma stok hareketi Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_PURCHASEORDERSTOCKMOVEMENT_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_PURCHASEORDERSTOCKMOVEMENTS_NOTIFICATION:
            const messages = [...state.notifications]
            messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_PURCHASEORDERSTOCKMOVEMENTS_NOTIFICATION:
            const messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_PURCHASEORDERSTOCKMOVEMENT:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default PurchaseorderstockmovementReducer
