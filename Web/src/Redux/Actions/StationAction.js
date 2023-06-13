import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "./axios"
import config from "../../Config"
export const ACTION_TYPES = {
    GET_STATIONS_INIT: 'GET_STATIONS_INIT',
    GET_STATIONS_SUCCESS: 'GET_STATIONS_SUCCESS',
    GET_STATIONS_ERROR: 'GET_STATIONS_ERROR',

    GET_ALLSTATIONS_INIT: 'GET_ALLSTATIONS_INIT',
    GET_ALLSTATIONS_SUCCESS: 'GET_ALLSTATIONS_SUCCESS',
    GET_ALLSTATIONS_ERROR: 'GET_ALLSTATIONS_ERROR',

    GET_STATION_INIT: 'GET_STATION_INIT',
    GET_STATION_SUCCESS: 'GET_STATION_SUCCESS',
    GET_STATION_ERROR: 'GET_STATION_ERROR',

    ADD_STATION_INIT: 'ADD_STATION_INIT',
    ADD_STATION_SUCCESS: 'ADD_STATION_SUCCESS',
    ADD_STATION_ERROR: 'ADD_STATION_ERROR',

    EDIT_STATION_INIT: 'EDIT_STATION_INIT',
    EDIT_STATION_SUCCESS: 'EDIT_STATION_SUCCESS',
    EDIT_STATION_ERROR: 'EDIT_STATION_ERROR',

    DELETE_STATION_INIT: 'DELETE_STATION_INIT',
    DELETE_STATION_SUCCESS: 'DELETE_STATION_SUCCESS',
    DELETE_STATION_ERROR: 'DELETE_STATION_ERROR',

    REMOVE_SELECTED_STATION: 'REMOVE_SELECTED_STATION',

    FILL_STATIONS_NOTIFICATION: 'FILL_STATIONS_NOTIFICATION',
    REMOVE_STATIONS_NOTIFICATION: 'REMOVE_STATIONS_NOTIFICATION',
}

export const GetStations = () => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_STATIONS_INIT })
    await instanse.get(config.services.Setting, ROUTES.STATION)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_STATIONS_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STATIONS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_STATIONS_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const GetStation = (Uuid) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.GET_STATION_INIT })
    await instanse.get(config.services.Setting, `${ROUTES.STATION}/${Uuid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.GET_STATION_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STATIONS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.GET_STATION_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const AddStations = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.ADD_STATION_INIT, payload: data })
    await instanse.post(config.services.Setting, ROUTES.STATION, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.ADD_STATION_SUCCESS, payload: response.data })
            historypusher.push('/Stations')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STATIONS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.ADD_STATION_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const EditStations = (data, historypusher) => async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.EDIT_STATION_INIT, payload: data })
    await instanse.put(config.services.Setting, ROUTES.STATION, data)
        .then(response => {
            dispatch({ type: ACTION_TYPES.EDIT_STATION_SUCCESS, payload: response.data })
            historypusher.push('/Stations')
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STATIONS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.EDIT_STATION_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const DeleteStations = (data) => async (dispatch, getState) => {
    delete data['edit']
    delete data['delete']
    dispatch({ type: ACTION_TYPES.DELETE_STATION_INIT })
    await instanse.delete(config.services.Setting, `${ROUTES.STATION}/${data.Uuid}`)
        .then(response => {
            dispatch({ type: ACTION_TYPES.DELETE_STATION_SUCCESS, payload: response.data })
        })
        .catch(error => {
            dispatch({ type: ACTION_TYPES.FILL_STATIONS_NOTIFICATION, payload: AxiosErrorHelper(error) })
            dispatch({ type: ACTION_TYPES.DELETE_STATION_ERROR, payload: AxiosErrorHelper(error) })
        })
}

export const RemoveSelectedStation = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SELECTED_STATION, payload })
    }
}

export const fillStationnotification = payload => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.FILL_STATIONS_NOTIFICATION, payload })
    }
}

export const removeStationnotification = () => {
    return (dispatch, getState) => {
        dispatch({ type: ACTION_TYPES.REMOVE_STATIONS_NOTIFICATION })
    }
}
