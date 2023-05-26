import instanse from "./axios"
import cookies from 'universal-cookie';
import AxiosErrorHelper from '../../Utils/AxiosErrorHelper';
import config from "../../Config";
import { ROUTES } from "../../Utils/Constants";

export const ACTION_TYPES = {
  LOGIN_REQUEST_INIT: 'LOGIN_REQUEST_INIT',
  LOGIN_REQUEST_SUCCESS: 'LOGIN_REQUEST_SUCCESS',
  LOGIN_REQUEST_ERROR: 'LOGIN_REQUEST_ERROR',

  LOGOUT_REQUEST_INIT: 'LOGOUT_REQUEST_INIT',
  LOGOUT_REQUEST_SUCCESS: 'LOGOUT_REQUEST_SUCCESS',

  REGISTER_REQUEST_INIT: 'REGISTER_REQUEST_INIT',
  REGISTER_REQUEST_SUCCESS: 'REGISTER_REQUEST_SUCCESS',
  REGISTER_REQUEST_ERROR: 'REGISTER_REQUEST_ERROR',

  GET_ACTIVEUSER_INIT: 'GET_ACTIVEUSER_INIT',
  GET_ACTIVEUSER_SUCCESS: 'GET_ACTIVEUSER_SUCCESS',
  GET_ACTIVEUSER_ERROR: 'GET_ACTIVEUSER_ERROR',

  GET_USERMETA_INIT: 'GET_USERMETA_INIT',
  GET_USERMETA_SUCCESS: 'GET_USERMETA_SUCCESS',
  GET_USERMETA_ERROR: 'GET_USERMETA_ERROR',

  GET_USERSROLES_INIT: 'GET_USERSROLES_INIT',
  GET_USERSROLES_SUCCESS: 'GET_USERSROLES_SUCCESS',
  GET_USERSROLES_ERROR: 'GET_USERSROLES_ERROR',

  CHANGE_PASSWORD_INIT: 'CHANGE_PASSWORD_INIT',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_ERROR: 'CHANGE_PASSWORD_ERROR',

  FILL_USER_NOTIFICATION: 'FILL_USER_NOTIFICATION',
  REMOVE_USER_NOTIFICATION: 'REMOVE_USER_NOTIFICATION',

  GET_TABLEMETA_INIT: 'GET_TABLEMETA_INIT',
  GET_TABLEMETA_SUCCESS: 'GET_TABLEMETA_SUCCESS',
  GET_TABLEMETA_ERROR: 'GET_TABLEMETA_ERROR',

  SAVE_TABLEMETA_INIT: 'SAVE_TABLEMETA_INIT',
  SAVE_TABLEMETA_SUCCESS: 'SAVE_TABLEMETA_SUCCESS',
  SAVE_TABLEMETA_ERROR: 'SAVE_TABLEMETA_ERROR',

  RESETPASSWORD_REQUEST_INIT: 'RESETPASSWORD_REQUEST_INIT',
  RESETPASSWORD_REQUEST_SUCCESS: 'RESETPASSWORD_REQUEST_SUCCESS',
  RESETPASSWORD_REQUEST_ERROR: 'RESETPASSWORD_REQUEST_ERROR',
}

export const Passwordforget = (data, historyPusher, redirecturl) => {
  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.LOGIN_REQUEST_INIT })
    instanse.post(config.services.Auth, `/oauth/login`, data)
      .then(result => {
        dispatch({ type: ACTION_TYPES.LOGIN_REQUEST_SUCCESS })
        redirecturl ? window.location = (redirecturl) : window.location = ('Home')
      })
      .catch(error => {
        dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
        dispatch({ type: ACTION_TYPES.LOGIN_REQUEST_ERROR, payload: AxiosErrorHelper(error) })
      })
  }
}

export const Passwordresetrequest = (data, historyPusher, redirecturl) => {
  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.RESETPASSWORD_REQUEST_INIT })
    instanse.post(`/auth/CreateResetPasswordRequest`, data)
      .then(result => {
        dispatch({ type: ACTION_TYPES.RESETPASSWORD_REQUEST_SUCCESS })
        redirecturl ? window.location = (redirecturl) : window.location = ('Home')
      })
      .catch(error => {
        dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
        dispatch({ type: ACTION_TYPES.RESETPASSWORD_REQUEST_ERROR, payload: AxiosErrorHelper(error) })
      })
  }
}

export const logIn = (data, historyPusher, redirecturl) => {
  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.LOGIN_REQUEST_INIT })
    instanse.post(config.services.Auth, `Oauth/Login`, data)
      .then(result => {
        dispatch({ type: ACTION_TYPES.LOGIN_REQUEST_SUCCESS })
        redirecturl ? window.location = (redirecturl) : window.location = ('Home')
      })
      .catch(error => {
        console.log('error: ', error);
        dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
        dispatch({ type: ACTION_TYPES.LOGIN_REQUEST_ERROR, payload: AxiosErrorHelper(error) })
      })
  }
}

export const register = (data, historyPusher) => {
  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.REGISTER_REQUEST_INIT })
    instanse.post(`/auth/Register`, data)
      .then(result => {
        dispatch({ type: ACTION_TYPES.REGISTER_REQUEST_SUCCESS })
        historyPusher.push("/Login")
      })
      .catch(error => {
        dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
        dispatch({ type: ACTION_TYPES.REGISTER_REQUEST_ERROR, payload: AxiosErrorHelper(error) })
      })
  }
}

export const GetActiveUser = () => async (dispatch, getState) => {
  dispatch({ type: ACTION_TYPES.GET_ACTIVEUSER_INIT })
  await instanse.get(config.services.Userrole, 'Users/GetActiveUsername')
    .then(response => {
      dispatch({ type: ACTION_TYPES.GET_ACTIVEUSER_SUCCESS, payload: response.data })
    })
    .catch(error => {
      dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
      dispatch({ type: ACTION_TYPES.GET_ACTIVEUSER_ERROR, payload: AxiosErrorHelper(error) })
    })
}

export const GetUserMeta = () => async (dispatch, getState) => {
  dispatch({ type: ACTION_TYPES.GET_USERMETA_INIT })
  await instanse.get(config.services.Userrole, 'Users/GetActiveUserMeta')
    .then(response => {
      dispatch({ type: ACTION_TYPES.GET_USERMETA_SUCCESS, payload: response.data })
    })
    .catch(error => {
      console.log('error: ', error);
      dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
      dispatch({ type: ACTION_TYPES.GET_USERMETA_ERROR, payload: AxiosErrorHelper(error) })
    })
}
export const GetUserRoles = () => async (dispatch, getState) => {
  dispatch({ type: ACTION_TYPES.GET_USERSROLES_INIT })
  await instanse.get(config.services.Userrole, 'Roles/GetActiveuserprivileges')
    .then(response => {
      dispatch({ type: ACTION_TYPES.GET_USERSROLES_SUCCESS, payload: response.data })
    })
    .catch(error => {
      dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
      dispatch({ type: ACTION_TYPES.GET_USERSROLES_ERROR, payload: AxiosErrorHelper(error) })
    })
}

export const GetTableMeta = () => async (dispatch, getState) => {
  dispatch({ type: ACTION_TYPES.GET_TABLEMETA_INIT })
  await instanse.get(config.services.Userrole, ROUTES.USER + '/GetTableMeta')
    .then(response => {
      dispatch({ type: ACTION_TYPES.GET_TABLEMETA_SUCCESS, payload: response.data })
    })
    .catch(error => {
      dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
      dispatch({ type: ACTION_TYPES.GET_TABLEMETA_ERROR, payload: AxiosErrorHelper(error) })
    })
}

export const SaveTableMeta = (data) => async (dispatch, getState) => {
  dispatch({ type: ACTION_TYPES.SAVE_TABLEMETA_INIT })
  await instanse.post(config.services.Userrole, ROUTES.USER + '/SaveTableMeta', data)
    .then(response => {
      dispatch({ type: ACTION_TYPES.SAVE_TABLEMETA_SUCCESS, payload: response.data })
    })
    .catch(error => {
      dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
      dispatch({ type: ACTION_TYPES.SAVE_TABLEMETA_ERROR, payload: AxiosErrorHelper(error) })
    })
}

export const ChangePassword = (data, historyPusher) => async (dispatch, getState) => {
  dispatch({ type: ACTION_TYPES.CHANGE_PASSWORD_INIT })
  await instanse.post("Auth/ChangePassword", data)
    .then(response => {
      dispatch({ type: ACTION_TYPES.CHANGE_PASSWORD_SUCCESS, payload: response.data })
      historyPusher.push("/Home")
    })
    .catch(error => {
      dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload: AxiosErrorHelper(error) })
      dispatch({ type: ACTION_TYPES.CHANGE_PASSWORD_ERROR, payload: AxiosErrorHelper(error) })
    })
}

export const fillnotification = payload => {
  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.FILL_USER_NOTIFICATION, payload })
  }
}

export const removenotification = () => {
  return (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.REMOVE_USER_NOTIFICATION })
  }
}

export const logOut = () => {
  return dispatch => {
    dispatch({ type: ACTION_TYPES.LOGOUT_REQUEST_INIT })
    const localcookies = new cookies();
    localcookies.remove('patientcare')
    dispatch({ type: ACTION_TYPES.LOGOUT_REQUEST_SUCCESS })
    window.location = '/Login'
  }
}

