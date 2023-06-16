import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatientstockmovements = createAsyncThunk(
    'Patientstockmovements/GetPatientstockmovements',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.PATIENTSTOCKMOVEMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientstockmovement = createAsyncThunk(
    'Patientstockmovements/GetPatientstockmovement',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.PATIENTSTOCKMOVEMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientstockmovements = createAsyncThunk(
    'Patientstockmovements/AddPatientstockmovements',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Warehouse, ROUTES.PATIENTSTOCKMOVEMENT, data);
            dispatch(fillPatientstockmovementnotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'Hasta Stok hareketi başarı ile Eklendi',
            }));
            history.push('/Patientstockmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientstockmovements = createAsyncThunk(
    'Patientstockmovements/EditPatientstockmovements',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Warehouse, ROUTES.PATIENTSTOCKMOVEMENT, data);
            dispatch(fillPatientstockmovementnotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Hasta Stok hareketi başarı ile Güncellendi',
            }));
            history.push('/Patientstockmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientstockmovements = createAsyncThunk(
    'Patientstockmovements/DeletePatientstockmovements',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.PATIENTSTOCKMOVEMENT}/${data.Uuid}`);
            dispatch(fillPatientstockmovementnotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'Hasta Stok hareketi başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientstockmovementsSlice = createSlice({
    name: 'Patientstockmovements',
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
        handleSelectedPatientstockmovement: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientstockmovementnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientstockmovementnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientstockmovements.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientstockmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientstockmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientstockmovement.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientstockmovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientstockmovement.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientstockmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatientstockmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatientstockmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientstockmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatientstockmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatientstockmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientstockmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatientstockmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientstockmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatientstockmovement,
    fillPatientstockmovementnotification,
    removePatientstockmovementnotification,
    handleDeletemodal
} = PatientstockmovementsSlice.actions;

export default PatientstockmovementsSlice.reducer;