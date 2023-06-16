import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatientdefines = createAsyncThunk(
    'Patientdefines/GetPatientdefines',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTDEFINE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientdefine = createAsyncThunk(
    'Patientdefines/GetPatientdefine',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTDEFINE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientdefines = createAsyncThunk(
    'Patientdefines/AddPatientdefines',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTDEFINE, data);
            dispatch(fillPatientdefinenotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'Hasta tanımı başarı ile Eklendi',
            }));
            history.push('/Patientdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientdefines = createAsyncThunk(
    'Patientdefines/EditPatientdefines',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTDEFINE, data);
            dispatch(fillPatientdefinenotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Hasta tanımı başarı ile Güncellendi',
            }));
            history.push('/Patientdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientdefines = createAsyncThunk(
    'Patientdefines/DeletePatientdefines',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTDEFINE}/${data.Uuid}`);
            dispatch(fillPatientdefinenotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'Hasta tanımı başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientdefinesSlice = createSlice({
    name: 'Patientdefines',
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
        handleSelectedPatientdefine: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientdefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientdefinenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientdefines.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientdefine.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientdefine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientdefine.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatientdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatientdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatientdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatientdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatientdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatientdefine,
    fillPatientdefinenotification,
    removePatientdefinenotification,
    handleDeletemodal
} = PatientdefinesSlice.actions;

export default PatientdefinesSlice.reducer;