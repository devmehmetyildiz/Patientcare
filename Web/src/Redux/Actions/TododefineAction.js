import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_TODODEFINES_INIT: 'GET_TODODEFINES_INIT',
    GET_TODODEFINES_SUCCESS: 'GET_TODODEFINES_SUCCESS',
    GET_TODODEFINES_ERROR: 'GET_TODODEFINES_ERROR',

    GET_TODODEFINE_INIT: 'GET_TODODEFINE_INIT',
    GET_TODODEFINE_SUCCESS: 'GET_TODODEFINE_SUCCESS',
    GET_TODODEFINE_ERROR: 'GET_TODODEFINE_ERROR',

    ADD_TODODEFINE_INIT: 'ADD_TODODEFINE_INIT',
    ADD_TODODEFINE_SUCCESS: 'ADD_TODODEFINE_SUCCESS',
    ADD_TODODEFINE_ERROR: 'ADD_TODODEFINE_ERROR',

    EDIT_TODODEFINE_INIT: 'EDIT_TODODEFINE_INIT',
    EDIT_TODODEFINE_SUCCESS: 'EDIT_TODODEFINE_SUCCESS',
    EDIT_TODODEFINE_ERROR: 'EDIT_TODODEFINE_ERROR',

    DELETE_TODODEFINE_INIT: 'DELETE_TODODEFINE_INIT',
    DELETE_TODODEFINE_SUCCESS: 'DELETE_TODODEFINE_SUCCESS',
    DELETE_TODODEFINE_ERROR: 'DELETE_TODODEFINE_ERROR',

    REMOVE_SELECTED_TODODEFINE: 'REMOVE_SELECTED_TODODEFINE',

    FILL_TODODEFINES_NOTIFICATION: 'FILL_TODODEFINES_NOTIFICATION',
    REMOVE_TODODEFINES_NOTIFICATION: 'REMOVE_TODODEFINES_NOTIFICATION',
}

export const GetTododefines = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_TODODEFINES_INIT })
    await instanse.get(ROUTES.TODODEFINE + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_TODODEFINES_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODODEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_TODODEFINES_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetTododefine = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_TODODEFINE_INIT })
    await instanse.get(ROUTES.TODODEFINE + `/Getselected?guid=${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_TODODEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODODEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_TODODEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddTododefines = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_TODODEFINE_INIT })
    await instanse.post(ROUTES.TODODEFINE + "/Add", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_TODODEFINE_SUCCESS, payload: response.data })
            historypusher.push('/Tododefines')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODODEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_TODODEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditTododefines = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_TODODEFINE_INIT })
    await instanse.post(ROUTES.TODODEFINE + "/Update", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_TODODEFINE_SUCCESS, payload: response.data })
            historypusher.push('/Tododefines')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODODEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_TODODEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteTododefines = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_TODODEFINE_INIT })
    await instanse.post(ROUTES.TODODEFINE + "/Delete", data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_TODODEFINE_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODODEFINES_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_TODODEFINE_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedTododefine = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_TODODEFINE, payload })
    }
}

export const fillTododefinenotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_TODODEFINES_NOTIFICATION, payload })
    }
}

export const removeTododefinenotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_TODODEFINES_NOTIFICATION })
    }
}
