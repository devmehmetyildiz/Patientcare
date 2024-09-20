import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetClaimpayments = createAsyncThunk(
    'Claimpayments/GetClaimpayments',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.CLAIMPAYMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetClaimpayment = createAsyncThunk(
    'Claimpayments/GetClaimpayment',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.CLAIMPAYMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddClaimpayments = createAsyncThunk(
    'Claimpayments/AddClaimpayments',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.CLAIMPAYMENT, data);
            dispatch(fillClaimpaymentnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Claimpayments.Messages.Add'),
            }));
            clearForm && clearForm('ClaimpaymentsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Claimpayments');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveClaimpayments = createAsyncThunk(
    'Claimpayments/ApproveClaimpayments',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CLAIMPAYMENT}/Approve/${data.Uuid}`);
            dispatch(fillClaimpaymentnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Claimpayments.Messages.Approve'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewClaimpayments = createAsyncThunk(
    'Claimpayments/SavepreviewClaimpayments',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CLAIMPAYMENT}/Savepreview/${data?.Uuid}`);
            dispatch(fillClaimpaymentnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Claimpayments.Messages.Savepreview'),
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Claimpayments');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteClaimpayments = createAsyncThunk(
    'Claimpayments/DeleteClaimpayments',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.CLAIMPAYMENT}/${data.Uuid}`);
            dispatch(fillClaimpaymentnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Claimpayments.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ClaimpaymentsSlice = createSlice({
    name: 'Claimpayments',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isApprovemodalopen: false,
    },
    reducers: {
        handleSelectedClaimpayment: (state, action) => {
            state.selected_record = action.payload;
        },
        fillClaimpaymentnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeClaimpaymentnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetClaimpayments.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetClaimpayments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetClaimpayments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetClaimpayment.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetClaimpayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetClaimpayment.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddClaimpayments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddClaimpayments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddClaimpayments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveClaimpayments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveClaimpayments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveClaimpayments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewClaimpayments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewClaimpayments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(SavepreviewClaimpayments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteClaimpayments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteClaimpayments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteClaimpayments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedClaimpayment,
    fillClaimpaymentnotification,
    removeClaimpaymentnotification,
    handleDeletemodal,
    handleApprovemodal,
} = ClaimpaymentsSlice.actions;

export default ClaimpaymentsSlice.reducer;