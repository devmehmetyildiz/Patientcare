import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatientvisits = createAsyncThunk(
    'Patientvisits/GetPatientvisits',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTVISIT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientvisitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientvisit = createAsyncThunk(
    'Patientvisits/GetPatientvisit',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTVISIT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientvisitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientvisits = createAsyncThunk(
    'Patientvisits/AddPatientvisits',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTVISIT, data);
            dispatch(fillPatientvisitnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patientvisits.Messages.Add'),
            }));
            clearForm && clearForm('PatientvisitsCreate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Patientvisits');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientvisitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientvisits = createAsyncThunk(
    'Patientvisits/EditPatientvisits',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTVISIT, data);
            dispatch(fillPatientvisitnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patientvisits.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('PatientvisitsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Patientvisits');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientvisitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewPatientvisits = createAsyncThunk(
    'Patientvisits/SavepreviewPatientvisits',
    async ({ patientvisitID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENTVISIT}/Savepreview/${patientvisitID}`);
            dispatch(fillPatientvisitnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patientvisits.Messages.Savepreview'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientvisitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePatientvisits = createAsyncThunk(
    'Patientvisits/ApprovePatientvisits',
    async ({ patientvisitID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENTVISIT}/Approve/${patientvisitID}`);
            dispatch(fillPatientvisitnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patientvisits.Messages.Approve'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientvisitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompletePatientvisits = createAsyncThunk(
    'Patientvisits/CompletePatientvisits',
    async ({ patientvisitID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENTVISIT}/Complete/${patientvisitID}`);
            dispatch(fillPatientvisitnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patientvisits.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientvisitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientvisits = createAsyncThunk(
    'Patientvisits/DeletePatientvisits',
    async ({ patientvisitID, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTVISIT}/${patientvisitID}`);
            dispatch(fillPatientvisitnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Patientvisits.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientvisitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientvisitsSlice = createSlice({
    name: 'Patientvisits',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedPatientvisit: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientvisitnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientvisitnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientvisits.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientvisits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientvisits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientvisit.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientvisit.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientvisit.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientvisits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatientvisits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatientvisits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientvisits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatientvisits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatientvisits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientvisits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePatientvisits.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(DeletePatientvisits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewPatientvisits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewPatientvisits.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(SavepreviewPatientvisits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovePatientvisits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovePatientvisits.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(ApprovePatientvisits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePatientvisits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompletePatientvisits.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(CompletePatientvisits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    handleSelectedPatientvisit,
    fillPatientvisitnotification,
    removePatientvisitnotification,
    handleDeletemodal
} = PatientvisitsSlice.actions;

export default PatientvisitsSlice.reducer;