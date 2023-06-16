import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatientmovements = createAsyncThunk(
    'Patientmovements/GetPatientmovements',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTMOVEMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientmovement = createAsyncThunk(
    'Patientmovements/GetPatientmovement',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTMOVEMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientmovements = createAsyncThunk(
    'Patientmovements/AddPatientmovements',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTMOVEMENT, data);
            dispatch(fillPatientmovementnotification({
                type: 'Success',
                code: 'Müşteri Türleri',
                description: 'Müşteri türü başarı ile Eklendi',
            }));
            history.push('/Patientmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientmovements = createAsyncThunk(
    'Patientmovements/EditPatientmovements',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTMOVEMENT, data);
            dispatch(fillPatientmovementnotification({
                type: 'Success',
                code: 'Müşteri Türleri',
                description: 'Müşteri türü başarı ile Güncellendi',
            }));
            history.push('/Patientmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientmovements = createAsyncThunk(
    'Patientmovements/DeletePatientmovements',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTMOVEMENT}/${data.Uuid}`);
            dispatch(fillPatientmovementnotification({
                type: 'Success',
                code: 'Müşteri Türleri',
                description: 'Müşteri türü başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientmovementsSlice = createSlice({
    name: 'Patientmovements',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedPatientmovement: (state) => {
            state.selected_record = {};
        },
        fillPatientmovementnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientmovementnotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientmovements.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientmovement.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientmovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientmovement.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatientmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatientmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatientmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatientmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatientmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedPatientmovement,
    fillPatientmovementnotification,
    removePatientmovementnotification,
} = PatientmovementsSlice.actions;

export default PatientmovementsSlice.reducer;