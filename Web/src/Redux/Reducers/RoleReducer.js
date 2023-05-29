import { ACTION_TYPES } from "../Actions/RoleAction"

const defaultState = {
    list: [],
    selected_record: {},
    privileges: [],
    privilegegroups: [],
    errmsg: null,
    notifications: [],
    isLoading: false,
    isDispatching: false
}

const RoleReducer = (state = defaultState, { type, payload }) => {
    switch (type) {
        case ACTION_TYPES.GET_ROLES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ROLES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ROLES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ALLROLES_INIT:
            return { ...state, isLoading: true, errmsg: null, list: [] }
        case ACTION_TYPES.GET_ALLROLES_SUCCESS:
            return { ...state, isLoading: false, list: payload }
        case ACTION_TYPES.GET_ALLROLES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_ROLE_INIT:
            return { ...state, isLoading: true, errmsg: null, selected_record: {} }
        case ACTION_TYPES.GET_ROLE_SUCCESS:
            return { ...state, isLoading: false, selected_record: payload }
        case ACTION_TYPES.GET_ROLE_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PRIVILEGES_INIT:
            return { ...state, isLoading: true, errmsg: null, privileges: [] }
        case ACTION_TYPES.GET_PRIVILEGES_SUCCESS:
            return { ...state, isLoading: false, privileges: payload }
        case ACTION_TYPES.GET_PRIVILEGES_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.GET_PRIVILEGEGROUPS_INIT:
            return { ...state, isLoading: true, errmsg: null, privilegegroups: [] }
        case ACTION_TYPES.GET_PRIVILEGEGROUPS_SUCCESS:
            return { ...state, isLoading: false, privilegegroups: payload }
        case ACTION_TYPES.GET_PRIVILEGEROUPS_ERROR:
            return { ...state, isLoading: false, errmsg: payload }

        case ACTION_TYPES.ADD_ROLE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.ADD_ROLE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Roller', description: 'Role Başarı ile Eklendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.ADD_ROLE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.EDIT_ROLE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.EDIT_ROLE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Roller', description: 'Role Başarı ile Güncellendi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.EDIT_ROLE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.DELETE_ROLE_INIT:
            return { ...state, isDispatching: true }
        case ACTION_TYPES.DELETE_ROLE_SUCCESS:
            return {
                ...state, isDispatching: false, list: payload,
                notifications: [{ type: 'Success', code: 'Roller', description: 'Role Başarı ile Silindi' }].concat(state.notifications || [])
            }
        case ACTION_TYPES.DELETE_ROLE_ERROR:
            return { ...state, isDispatching: false, errmsg: payload }

        case ACTION_TYPES.FILL_ROLES_NOTIFICATION:
            let messages = [...state.notifications]
            Array.isArray(payload) ? messages = messages.concat(payload) : messages.push(payload)
            return { ...state, notifications: messages }
        case ACTION_TYPES.REMOVE_ROLES_NOTIFICATION:
           let messages1 = [...state.notifications]
            messages1.splice(0, 1)
            return { ...state, notifications: messages1 }
        case ACTION_TYPES.REMOVE_SELECTED_ROLE:
            return { ...state, selected_record: {} }
        default:
            return state
    }
}

export default RoleReducer
