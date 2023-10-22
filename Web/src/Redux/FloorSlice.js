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
        en: 'Floor added successfully',
        tr: 'Kat Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Floor updated successfully',
        tr: 'Kat Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Floor Deleted successfully',
        tr: 'Kat Başarı ile Silindi'
    },
}

export const GetFloors = createAsyncThunk(
    'Floors/GetFloors',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.FLOOR);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFloornotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetFloor = createAsyncThunk(
    'Floors/GetFloor',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.FLOOR}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFloornotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddFloors = createAsyncThunk(
    'Floors/AddFloors',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.FLOOR, data);
            dispatch(fillFloornotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillFloornotification({
                type: 'Clear',
                code: 'FloorsCreate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Floors');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFloornotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordFloors = createAsyncThunk(
    'Floors/AddRecordFloors',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.FLOOR + '/AddRecord', data);
            dispatch(fillFloornotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Floors');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFloornotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditFloors = createAsyncThunk(
    'Floors/EditFloors',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.FLOOR, data);
            dispatch(fillFloornotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillFloornotification({
                type: 'Clear',
                code: 'FloorsUpdate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Floors');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFloornotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteFloors = createAsyncThunk(
    'Floors/DeleteFloors',
    async (data, { dispatch, getState }) => {
        try {
          
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.FLOOR}/${data.Uuid}`);
            dispatch(fillFloornotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFloornotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const FloorsSlice = createSlice({
    name: 'Floors',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedFloor: (state, action) => {
            state.selected_record = action.payload;
        },
        fillFloornotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeFloornotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetFloors.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetFloors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetFloors.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetFloor.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetFloor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetFloor.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddFloors.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddFloors.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddFloors.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordFloors.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordFloors.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordFloors.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditFloors.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditFloors.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditFloors.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteFloors.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteFloors.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteFloors.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedFloor,
    fillFloornotification,
    removeFloornotification,
    handleDeletemodal
} = FloorsSlice.actions;

export default FloorsSlice.reducer;