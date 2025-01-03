import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatientactivities = createAsyncThunk(
    'Patientactivities/GetPatientactivities',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTACTIVITY);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientactivitynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientactivity = createAsyncThunk(
    'Patientactivities/GetPatientactivity',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTACTIVITY}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientactivitynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientactivities = createAsyncThunk(
    'Patientactivities/AddPatientactivities',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTACTIVITY, data);
            dispatch(fillPatientactivitynotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patientactivities.Messages.Add'),
            }));
            clearForm && clearForm('PatientactivitiesCreate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Patientactivities');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientactivitynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientactivities = createAsyncThunk(
    'Patientactivities/EditPatientactivities',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTACTIVITY, data);
            dispatch(fillPatientactivitynotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patientactivities.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('PatientactivitiesUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Patientactivities');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientactivitynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewPatientactivities = createAsyncThunk(
    'Patientactivities/SavepreviewPatientactivities',
    async ({ patientactivityID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENTACTIVITY}/Savepreview/${patientactivityID}`);
            dispatch(fillPatientactivitynotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patientactivities.Messages.Savepreview'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientactivitynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePatientactivities = createAsyncThunk(
    'Patientactivities/ApprovePatientactivities',
    async ({ patientactivityID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENTACTIVITY}/Approve/${patientactivityID}`);
            dispatch(fillPatientactivitynotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patientactivities.Messages.Approve'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientactivitynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompletePatientactivities = createAsyncThunk(
    'Patientactivities/CompletePatientactivities',
    async ({ patientactivityID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENTACTIVITY}/Complete/${patientactivityID}`);
            dispatch(fillPatientactivitynotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patientactivities.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientactivitynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientactivities = createAsyncThunk(
    'Patientactivities/DeletePatientactivities',
    async ({ patientactivityID, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTACTIVITY}/${patientactivityID}`);
            dispatch(fillPatientactivitynotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Patientactivities.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientactivitynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientactivitiesSlice = createSlice({
    name: 'Patientactivities',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        fillPatientactivitynotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientactivitynotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientactivities.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientactivities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientactivities.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientactivity.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientactivity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientactivity.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientactivities.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatientactivities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatientactivities.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientactivities.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatientactivities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatientactivities.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientactivities.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePatientactivities.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(DeletePatientactivities.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewPatientactivities.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewPatientactivities.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(SavepreviewPatientactivities.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovePatientactivities.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovePatientactivities.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(ApprovePatientactivities.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePatientactivities.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompletePatientactivities.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(CompletePatientactivities.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    fillPatientactivitynotification,
    removePatientactivitynotification,
} = PatientactivitiesSlice.actions;

export default PatientactivitiesSlice.reducer;