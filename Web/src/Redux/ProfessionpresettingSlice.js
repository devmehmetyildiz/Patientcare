import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetProfessionpresettings = createAsyncThunk(
    'Professionpresettings/GetProfessionpresettings',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PROFESSIONPRESETTING);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetProfessionpresetting = createAsyncThunk(
    'Professionpresettings/GetProfessionpresetting',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddProfessionpresettings = createAsyncThunk(
    'Professionpresettings/AddProfessionpresettings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PROFESSIONPRESETTING, data);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Professionpresettings.Messages.Add'),
            }));
            clearForm && clearForm('ProfessionpresettingsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Professionpresettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditProfessionpresettings = createAsyncThunk(
    'Professionpresettings/EditProfessionpresettings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PROFESSIONPRESETTING, data);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Professionpresettings.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('ProfessionpresettingsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Professionpresettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewProfessionpresettings = createAsyncThunk(
    'Professionpresettings/SavepreviewProfessionpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/Savepreview/${uuid}`);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Professionpresettings.Messages.Savepreview'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveProfessionpresettings = createAsyncThunk(
    'Professionpresettings/ApproveProfessionpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/Approve/${uuid}`);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Professionpresettings.Messages.Approve'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteProfessionpresettings = createAsyncThunk(
    'Professionpresettings/CompleteProfessionpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/Complete/${uuid}`);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Professionpresettings.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ActivateProfessionpresettings = createAsyncThunk(
    'Professionpresettings/ActivateProfessionpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/Activate/${uuid}`);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Professionpresettings.Messages.Activated'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeactivateProfessionpresettings = createAsyncThunk(
    'Professionpresettings/DeactivateProfessionpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/Deactivate/${uuid}`);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Professionpresettings.Messages.Deactivated'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteProfessionpresettings = createAsyncThunk(
    'Professionpresettings/DeleteProfessionpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/${uuid}`);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Professionpresettings.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ProfessionpresettingsSlice = createSlice({
    name: 'Professionpresettings',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        fillProfessionpresettingnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeProfessionpresettingnotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetProfessionpresettings.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
                state.list = [];
            })
            .addCase(GetProfessionpresetting.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetProfessionpresetting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetProfessionpresetting.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(SavepreviewProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompleteProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ActivateProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ActivateProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ActivateProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeactivateProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeactivateProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeactivateProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    fillProfessionpresettingnotification,
    removeProfessionpresettingnotification,
} = ProfessionpresettingsSlice.actions;

export default ProfessionpresettingsSlice.reducer;