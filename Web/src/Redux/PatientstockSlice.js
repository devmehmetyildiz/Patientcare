import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatientstocks = createAsyncThunk(
    'Patientstocks/GetPatientstocks',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.PATIENTSTOCK);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientstock = createAsyncThunk(
    'Patientstocks/GetPatientstock',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.PATIENTSTOCK}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientstocks = createAsyncThunk(
    'Patientstocks/AddPatientstocks',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Warehouse, ROUTES.PATIENTSTOCK, data);
            dispatch(fillPatientstocknotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Patientstocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientstocks = createAsyncThunk(
    'Patientstocks/EditPatientstocks',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Warehouse, ROUTES.PATIENTSTOCK, data);
            dispatch(fillPatientstocknotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Patientstocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientstocks = createAsyncThunk(
    'Patientstocks/DeletePatientstocks',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.PATIENTSTOCK}/${data.Uuid}`);
            dispatch(fillPatientstocknotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientstocksSlice = createSlice({
    name: 'Patientstocks',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedPatientstock: (state) => {
            state.selected_record = {};
        },
        fillPatientstocknotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientstocknotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientstocks.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientstocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientstocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientstock.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientstock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientstock.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatientstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatientstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatientstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatientstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatientstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedPatientstock,
    fillPatientstocknotification,
    removePatientstocknotification,
} = PatientstocksSlice.actions;

export default PatientstocksSlice.reducer;