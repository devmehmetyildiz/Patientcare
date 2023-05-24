import { ACTION_TYPES } from "../Actions/ProfileAction"

const defaultState = {
  changePassword: false,
  isLogging: false,
  user: null,
  error: null,
  isDispatching: false,
  notifications: [],
  meta: {},
  username: "",
  roles: [],
  auth: false,
  tablemeta: [],
  resetpasswordStatus: false
}

const ProfileReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case ACTION_TYPES.LOGIN_REQUEST_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.LOGIN_REQUEST_SUCCESS: {
      return {
        ...state, isLogging: false,
        notifications: [{ type: 'Success', code: 'Elder Camp', description: 'Uygulamaya Giriş Yapıldı' }].concat(state.notifications || [])
      }
    }
    case ACTION_TYPES.LOGIN_REQUEST_ERROR:
      return { ...state, isLogging: false, error: payload }
    case ACTION_TYPES.REGISTER_REQUEST_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.REGISTER_REQUEST_SUCCESS: {
      return {
        ...state, isLogging: false,
        notifications: [{ type: 'Success', code: 'Elder Camp', description: 'Kullanıcı Başarı ile oluşturuldu' }].concat(state.notifications || [])
      }
    }
    case ACTION_TYPES.REGISTER_REQUEST_ERROR:
      return { ...state, isLogging: false, error: payload }
    case ACTION_TYPES.LOGOUT_REQUEST_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.LOGOUT_REQUEST_SUCCESS:
      return { ...defaultState }
    case ACTION_TYPES.GET_ACTIVEUSER_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.GET_ACTIVEUSER_SUCCESS:
      return { ...state, isLogging: false, username: payload }
    case ACTION_TYPES.GET_ACTIVEUSER_ERROR:
      return { ...state, isLogging: false, error: payload }
    case ACTION_TYPES.GET_USERMETA_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.GET_USERMETA_SUCCESS:
      return { ...state, isLogging: false, meta: payload }
    case ACTION_TYPES.GET_USERMETA_ERROR:
      return { ...state, isLogging: false, error: payload }
    case ACTION_TYPES.CHANGE_PASSWORD_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state, isLogging: false,
        notifications: [{ type: 'Success', code: 'Elder Camp', description: 'Parola Başarı ile güncellendi' }].concat(state.notifications || [])
      }
    case ACTION_TYPES.CHANGE_PASSWORD_ERROR:
      return { ...state, isLogging: false, error: payload }
    case ACTION_TYPES.GET_USERSROLES_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.GET_USERSROLES_SUCCESS:
      return { ...state, isLogging: false, roles: payload }
    case ACTION_TYPES.GET_USERSROLES_ERROR:
      return { ...state, isLogging: false, error: payload }
    case ACTION_TYPES.FILL_USER_NOTIFICATION:
      const messages = [...state.notifications]
      messages.push(payload)
      return { ...state, notifications: messages }
    case ACTION_TYPES.REMOVE_USER_NOTIFICATION:
      const messages1 = [...state.notifications]
      messages1.splice(0, 1)
      return { ...state, notifications: messages1 }
    case ACTION_TYPES.GET_TABLEMETA_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.GET_TABLEMETA_SUCCESS:
      return { ...state, isLogging: false, tablemeta: payload }
    case ACTION_TYPES.GET_TABLEMETA_ERROR:
      return { ...state, isLogging: false, error: payload }

    case ACTION_TYPES.SAVE_TABLEMETA_INIT:
      return { ...state, isLogging: true }
    case ACTION_TYPES.SAVE_TABLEMETA_SUCCESS:
      return { ...state, isLogging: false, tablemeta: payload }
    case ACTION_TYPES.SAVE_TABLEMETA_ERROR:
      return { ...state, isLogging: false, error: payload }

    case ACTION_TYPES.RESETPASSWORD_REQUEST_INIT:
      return { ...state, resetpasswordStatus: false, isLogging: true }
    case ACTION_TYPES.RESETPASSWORD_REQUEST_SUCCESS:
      return { ...state, isLogging: false, resetpasswordStatus: true }
    case ACTION_TYPES.RESETPASSWORD_REQUEST_ERROR:
      return { ...state, isLogging: false, resetpasswordStatus: false, error: payload }
    default:
      return state
  }
}

export default ProfileReducer