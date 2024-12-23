import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPatienthealthcases = createAsyncThunk(
    'Patienthealthcases/GetPatienthealthcases',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTHEALTHCASE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatienthealthcase = createAsyncThunk(
    'Patienthealthcases/GetPatienthealthcase',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTHEALTHCASE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatienthealthcases = createAsyncThunk(
    'Patienthealthcases/AddPatienthealthcases',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTHEALTHCASE, data);
            dispatch(fillPatienthealthcasenotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patienthealthcases.Messages.Add'),
            }));
            clearForm && clearForm('PatienthealthcasesCreate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Patienthealthcases');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatienthealthcases = createAsyncThunk(
    'Patienthealthcases/EditPatienthealthcases',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTHEALTHCASE, data);
            dispatch(fillPatienthealthcasenotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patienthealthcases.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('PatienthealthcasesUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Patienthealthcases');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatienthealthcases = createAsyncThunk(
    'Patienthealthcases/DeletePatienthealthcases',
    async ({ patienthealthcaseID, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTHEALTHCASE}/${patienthealthcaseID}`);
            dispatch(fillPatienthealthcasenotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patienthealthcases.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienthealthcasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatienthealthcasesSlice = createSlice({
    name: 'Patienthealthcases',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
    },
    reducers: {
        handleSelectedPatienthealthcase: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatienthealthcasenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatienthealthcasenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatienthealthcases.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatienthealthcases.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatienthealthcases.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatienthealthcase.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatienthealthcase.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatienthealthcase.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatienthealthcases.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatienthealthcases.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatienthealthcases.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatienthealthcases.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatienthealthcases.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatienthealthcases.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatienthealthcases.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePatienthealthcases.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatienthealthcase,
    fillPatienthealthcasenotification,
    removePatienthealthcasenotification,
    handleDeletemodal,
} = PatienthealthcasesSlice.actions;

export default PatienthealthcasesSlice.reducer;