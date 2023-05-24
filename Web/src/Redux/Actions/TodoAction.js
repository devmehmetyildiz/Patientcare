import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"

export const ACTION_TYPES = {
    GET_TODOS_INIT: 'GET_TODOS_INIT',
    GET_TODOS_SUCCESS: 'GET_TODOS_SUCCESS',
    GET_TODOS_ERROR: 'GET_TODOS_ERROR',

    GET_TODO_INIT: 'GET_TODO_INIT',
    GET_TODO_SUCCESS: 'GET_TODO_SUCCESS',
    GET_TODO_ERROR: 'GET_TODO_ERROR',

    ADD_TODO_INIT: 'ADD_TODO_INIT',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',

    EDIT_TODO_INIT: 'EDIT_TODO_INIT',
    EDIT_TODO_SUCCESS: 'EDIT_TODO_SUCCESS',
    EDIT_TODO_ERROR: 'EDIT_TODO_ERROR',

    DELETE_TODO_INIT: 'DELETE_TODO_INIT',
    DELETE_TODO_SUCCESS: 'DELETE_TODO_SUCCESS',
    DELETE_TODO_ERROR: 'DELETE_TODO_ERROR',

    REMOVE_SELECTED_TODO: 'REMOVE_SELECTED_TODO',

    FILL_TODOS_NOTIFICATION: 'FILL_TODOS_NOTIFICATION',
    REMOVE_TODOS_NOTIFICATION: 'REMOVE_TODOS_NOTIFICATION',
}

export const GetTodos = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_TODOS_INIT })
    await instanse.get(ROUTES.TODO + "/GetAll")
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_TODOS_SUCCESS, payload: response.data }) 
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_TODOS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetTodo = (guid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_TODO_INIT })
    await instanse.get(ROUTES.TODO + `/Getselected?guid=${guid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_TODO_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_TODO_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddTodos = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_TODO_INIT })
    await instanse.post(ROUTES.TODO + "/Add", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.ADD_TODO_SUCCESS, payload: response.data })
                historypusher.push('/Todos')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_TODO_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditTodos = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_TODO_INIT })
    await instanse.post(ROUTES.TODO + "/Update", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.EDIT_TODO_SUCCESS, payload: response.data })
                historypusher.push('/Todos')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_TODO_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteTodos = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_TODO_INIT })
    await instanse.post(ROUTES.TODO + "/Delete", data)
        .then(response => {
                dispatch({ type: ACTION_TYPES.DELETE_TODO_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_TODOS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_TODO_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedTodo = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_TODO, payload })
    }
}

export const fillTodonotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_TODOS_NOTIFICATION, payload })
    }
}

export const removeTodonotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_TODOS_NOTIFICATION })
    }
}
