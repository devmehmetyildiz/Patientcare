import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatienteventdefines = createAsyncThunk(
    'Patienteventdefines/GetPatienteventdefines',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTEVENTDEFINE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatienteventdefine = createAsyncThunk(
    'Patienteventdefines/GetPatienteventdefine',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTEVENTDEFINE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatienteventdefines = createAsyncThunk(
    'Patienteventdefines/AddPatienteventdefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTEVENTDEFINE, data);
            dispatch(fillPatienteventdefinenotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patienteventdefines.Messages.Add'),
            }));
            clearForm && clearForm('PatienteventdefinesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patienteventdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatienteventdefines = createAsyncThunk(
    'Patienteventdefines/EditPatienteventdefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTEVENTDEFINE, data);
            dispatch(fillPatienteventdefinenotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patienteventdefines.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('PatienteventdefinesUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Patienteventdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatienteventdefines = createAsyncThunk(
    'Patienteventdefines/DeletePatienteventdefines',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTEVENTDEFINE}/${data.Uuid}`);
            dispatch(fillPatienteventdefinenotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patienteventdefines.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienteventdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatienteventdefinesSlice = createSlice({
    name: 'Patienteventdefines',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
    },
    reducers: {
        handleSelectedPatienteventdefine: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatienteventdefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatienteventdefinenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatienteventdefines.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetPatienteventdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatienteventdefines.rejected, (state, action) => {
                state.list = [];
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatienteventdefine.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatienteventdefine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatienteventdefine.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatienteventdefines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatienteventdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatienteventdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatienteventdefines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatienteventdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatienteventdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatienteventdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePatienteventdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatienteventdefine,
    fillPatienteventdefinenotification,
    removePatienteventdefinenotification,
    handleDeletemodal,
} = PatienteventdefinesSlice.actions;

export default PatienteventdefinesSlice.reducer;