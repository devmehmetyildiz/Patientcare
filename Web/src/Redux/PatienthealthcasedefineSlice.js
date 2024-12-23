import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatienthealthcasedefines = createAsyncThunk(
    'Patienthealthcasedefines/GetPatienthealthcasedefines',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTHEALTHCASEDEFINE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasedefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatienthealthcasedefine = createAsyncThunk(
    'Patienthealthcasedefines/GetPatienthealthcasedefine',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTHEALTHCASEDEFINE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasedefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatienthealthcasedefines = createAsyncThunk(
    'Patienthealthcasedefines/AddPatienthealthcasedefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTHEALTHCASEDEFINE, data);
            dispatch(fillPatienthealthcasedefinenotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patienthealthcasedefines.Messages.Add'),
            }));
            clearForm && clearForm('PatienthealthcasedefinesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patienthealthcasedefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasedefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatienthealthcasedefines = createAsyncThunk(
    'Patienthealthcasedefines/EditPatienthealthcasedefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTHEALTHCASEDEFINE, data);
            dispatch(fillPatienthealthcasedefinenotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patienthealthcasedefines.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('PatienthealthcasedefinesUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Patienthealthcasedefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasedefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatienthealthcasedefines = createAsyncThunk(
    'Patienthealthcasedefines/DeletePatienthealthcasedefines',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTHEALTHCASEDEFINE}/${data.Uuid}`);
            dispatch(fillPatienthealthcasedefinenotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patienthealthcasedefines.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasedefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatienthealthcasedefinesSlice = createSlice({
    name: 'Patienthealthcasedefines',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
    },
    reducers: {
        handleSelectedPatienthealthcasedefine: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatienthealthcasedefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatienthealthcasedefinenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatienthealthcasedefines.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatienthealthcasedefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatienthealthcasedefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatienthealthcasedefine.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatienthealthcasedefine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatienthealthcasedefine.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatienthealthcasedefines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatienthealthcasedefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatienthealthcasedefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatienthealthcasedefines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatienthealthcasedefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatienthealthcasedefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatienthealthcasedefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePatienthealthcasedefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatienthealthcasedefine,
    fillPatienthealthcasedefinenotification,
    removePatienthealthcasedefinenotification,
    handleDeletemodal,
} = PatienthealthcasedefinesSlice.actions;

export default PatienthealthcasedefinesSlice.reducer;