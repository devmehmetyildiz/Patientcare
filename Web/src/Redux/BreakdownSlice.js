import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import { FileuploadPrepare } from '../Components/Fileupload';

export const GetBreakdowns = createAsyncThunk(
    'Breakdowns/GetBreakdowns',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.BREAKDOWN);
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetBreakdown = createAsyncThunk(
    'Breakdowns/GetBreakdown',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.BREAKDOWN}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddBreakdowns = createAsyncThunk(
    'Breakdowns/AddBreakdowns',
    async ({ data, files, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Warehouse, ROUTES.BREAKDOWN, data);
            dispatch(fillBreakdownnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Breakdowns.Messages.Add'),
            }));
            clearForm && clearForm('BreakdownsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Breakdowns');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillBreakdownnotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditBreakdowns = createAsyncThunk(
    'Breakdowns/EditBreakdowns',
    async ({ data, files, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Warehouse, ROUTES.BREAKDOWN, data);
            dispatch(fillBreakdownnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Breakdowns.Messages.Update'),
            }));
            clearForm && clearForm('BreakdownsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Breakdowns');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillBreakdownnotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteBreakdowns = createAsyncThunk(
    'Breakdowns/CompleteBreakdowns',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Warehouse, ROUTES.BREAKDOWN + '/Complete', data);
            dispatch(fillBreakdownnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Breakdowns.Messages.Complete'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteBreakdowns = createAsyncThunk(
    'Breakdowns/DeleteBreakdowns',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.BREAKDOWN}/${data.Uuid}`);
            dispatch(fillBreakdownnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Breakdowns.Messages.Delete'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const BreakdownsSlice = createSlice({
    name: 'Breakdowns',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isCompletemodalopen: false,
    },
    reducers: {
        handleSelectedBreakdown: (state, action) => {
            state.selected_record = action.payload;
        },
        fillBreakdownnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeBreakdownnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetBreakdowns.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetBreakdowns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetBreakdowns.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetBreakdown.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetBreakdown.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetBreakdown.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddBreakdowns.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddBreakdowns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddBreakdowns.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditBreakdowns.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditBreakdowns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditBreakdowns.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteBreakdowns.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteBreakdowns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompleteBreakdowns.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteBreakdowns.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteBreakdowns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteBreakdowns.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedBreakdown,
    fillBreakdownnotification,
    removeBreakdownnotification,
    handleDeletemodal,
    handleCompletemodal
} = BreakdownsSlice.actions;

export default BreakdownsSlice.reducer;