import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatienteventmovements = createAsyncThunk(
    'Patienteventmovements/GetPatienteventmovements',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTEVENTMOVEMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatienteventmovement = createAsyncThunk(
    'Patienteventmovements/GetPatienteventmovement',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTEVENTMOVEMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatienteventmovements = createAsyncThunk(
    'Patienteventmovements/AddPatienteventmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTEVENTMOVEMENT, data);
            dispatch(fillPatienteventmovementnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patienteventmovements.Messages.Add'),
            }));
            clearForm && clearForm('PatienteventmovementsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patienteventmovements');
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatienteventmovements = createAsyncThunk(
    'Patienteventmovements/EditPatienteventmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTEVENTMOVEMENT, data);
            dispatch(fillPatienteventmovementnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patienteventmovements.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('PatienteventmovementsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Patienteventmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatienteventmovements = createAsyncThunk(
    'Patienteventmovements/DeletePatienteventmovements',
    async ({ patienteventmovementID, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTEVENTMOVEMENT}/${patienteventmovementID}`);
            dispatch(fillPatienteventmovementnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patienteventmovements.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatienteventmovementsSlice = createSlice({
    name: 'Patienteventmovements',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
    },
    reducers: {
        handleSelectedPatienteventmovement: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatienteventmovementnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatienteventmovementnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatienteventmovements.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatienteventmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatienteventmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatienteventmovement.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatienteventmovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatienteventmovement.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatienteventmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatienteventmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatienteventmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatienteventmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatienteventmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatienteventmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatienteventmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePatienteventmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatienteventmovement,
    fillPatienteventmovementnotification,
    removePatienteventmovementnotification,
    handleDeletemodal,
} = PatienteventmovementsSlice.actions;

export default PatienteventmovementsSlice.reducer;