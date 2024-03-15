import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescription: {
        en: 'Room added successfully',
        tr: 'Oda Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Room updated successfully',
        tr: 'Oda Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Room Deleted successfully',
        tr: 'Oda Başarı ile Silindi'
    },
}

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
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.ROOM, data);
            dispatch(fillRoomnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
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
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.ROOM + '/AddRecord', data);
            dispatch(fillRoomnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
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
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.ROOM, data);
            dispatch(fillRoomnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
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
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.ROOM}/${data.Uuid}`);
            dispatch(fillRoomnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
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
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedRoom: (state, action) => {
            state.selected_record = action.payload;
        },
        fillRoomnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeRoomnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetRooms.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetRooms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetRooms.rejected, (state, action) => {
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
    handleSelectedRoom,
    fillRoomnotification,
    removeRoomnotification,
    handleDeletemodal
} = RoomsSlice.actions;

export default RoomsSlice.reducer;