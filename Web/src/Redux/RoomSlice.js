import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetRooms = createAsyncThunk(
    'Rooms/GetRooms',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.ROOM);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRoomnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetRoom = createAsyncThunk(
    'Rooms/GetRoom',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.ROOM}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRoomnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRooms = createAsyncThunk(
    'Rooms/AddRooms',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Setting, ROUTES.ROOM, data);
            dispatch(fillRoomnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Rooms.Messages.Add'),
            }));
            clearForm && clearForm('RoomsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Rooms');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRoomnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordRooms = createAsyncThunk(
    'Rooms/AddRecordRooms',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Setting, ROUTES.ROOM + '/AddRecord', data);
            dispatch(fillRoomnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Rooms.Messages.Add'),
            }));
            clearForm && clearForm('RoomsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Rooms');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRoomnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditRooms = createAsyncThunk(
    'Rooms/EditRooms',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Setting, ROUTES.ROOM, data);
            dispatch(fillRoomnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Rooms.Messages.Update'),
            }));
            clearForm && clearForm('RoomsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Rooms');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRoomnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteRooms = createAsyncThunk(
    'Rooms/DeleteRooms',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Setting, `${ROUTES.ROOM}/${data.Uuid}`);
            dispatch(fillRoomnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Rooms.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRoomnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const RoomsSlice = createSlice({
    name: 'Rooms',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        fillRoomnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeRoomnotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetRooms.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetRooms.rejected, (state, action) => {
                state.list = [];
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetRoom.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetRoom.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetRoom.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRooms.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddRooms.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordRooms.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddRecordRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddRecordRooms.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditRooms.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditRooms.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteRooms.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteRooms.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    fillRoomnotification,
    removeRoomnotification,
} = RoomsSlice.actions;

export default RoomsSlice.reducer;