import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetCareplanparameters = createAsyncThunk(
    'Careplanparameters/GetCareplanparameters',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.CAREPLANPARAMETER);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplanparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetCareplanparameter = createAsyncThunk(
    'Careplanparameters/GetCareplanparameter',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.CAREPLANPARAMETER}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplanparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddCareplanparameters = createAsyncThunk(
    'Careplanparameters/AddCareplanparameters',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Setting, ROUTES.CAREPLANPARAMETER, data);
            dispatch(fillCareplanparameternotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Careplanparameter.Messages.Add'),
            }));
            dispatch(fillCareplanparameternotification({
                type: 'Clear',
                code: 'CareplanparametersCreate',
                description: '',
            }));
            clearForm && clearForm('CareplanparametersCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Careplanparameters');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplanparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditCareplanparameters = createAsyncThunk(
    'Careplanparameters/EditCareplanparameters',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Setting, ROUTES.CAREPLANPARAMETER, data);
            dispatch(fillCareplanparameternotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Careplanparameter.Messages.Update'),
            }));
            clearForm && clearForm('CareplanparametersUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Careplanparameters');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplanparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteCareplanparameters = createAsyncThunk(
    'Careplanparameters/DeleteCareplanparameters',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Setting, `${ROUTES.CAREPLANPARAMETER}/${data.Uuid}`);
            dispatch(fillCareplanparameternotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Careplanparameter.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplanparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CareplanparametersSlice = createSlice({
    name: 'Careplanparameters',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedCareplanparameter: (state, action) => {
            state.selected_record = action.payload;
        },
        fillCareplanparameternotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeCareplanparameternotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCareplanparameters.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetCareplanparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetCareplanparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetCareplanparameter.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetCareplanparameter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetCareplanparameter.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddCareplanparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddCareplanparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddCareplanparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditCareplanparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditCareplanparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditCareplanparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteCareplanparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteCareplanparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteCareplanparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedCareplanparameter,
    fillCareplanparameternotification,
    removeCareplanparameternotification,
    handleDeletemodal
} = CareplanparametersSlice.actions;

export default CareplanparametersSlice.reducer;