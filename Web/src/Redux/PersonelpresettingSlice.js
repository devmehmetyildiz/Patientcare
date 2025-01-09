import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";


export const GetPersonelpresettings = createAsyncThunk(
    'Personelpresettings/GetPersonelpresettings',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PERSONELPRESETTING);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPersonelpresetting = createAsyncThunk(
    'Personelpresettings/GetPersonelpresetting',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PERSONELPRESETTING}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPersonelpresettings = createAsyncThunk(
    'Personelpresettings/AddPersonelpresettings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PERSONELPRESETTING, data);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Personelpresettings.Messages.Add'),
            }));
            clearForm && clearForm('PersonelpresettingsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Personelpresettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPersonelpresettings = createAsyncThunk(
    'Personelpresettings/EditPersonelpresettings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PERSONELPRESETTING, data);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelpresettings.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('PersonelpresettingsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Personelpresettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewPersonelpresettings = createAsyncThunk(
    'Personelpresettings/SavepreviewPersonelpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELPRESETTING}/Savepreview/${uuid}`);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelpresettings.Messages.Savepreview'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePersonelpresettings = createAsyncThunk(
    'Personelpresettings/ApprovePersonelpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELPRESETTING}/Approve/${uuid}`);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelpresettings.Messages.Approve'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompletePersonelpresettings = createAsyncThunk(
    'Personelpresettings/CompletePersonelpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELPRESETTING}/Complete/${uuid}`);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelpresettings.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ActivatePersonelpresettings = createAsyncThunk(
    'Personelpresettings/ActivatePersonelpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELPRESETTING}/Activate/${uuid}`);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelpresettings.Messages.Activated'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeactivatePersonelpresettings = createAsyncThunk(
    'Personelpresettings/DeactivatePersonelpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELPRESETTING}/Deactivate/${uuid}`);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelpresettings.Messages.Deactivated'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);
export const DeletePersonelpresettings = createAsyncThunk(
    'Personelpresettings/DeletePersonelpresettings',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PERSONELPRESETTING}/${uuid}`);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Personelpresettings.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PersonelpresettingsSlice = createSlice({
    name: 'Personelpresettings',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        fillPersonelpresettingnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePersonelpresettingnotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPersonelpresettings.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetPersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPersonelpresettings.rejected, (state, action) => {
                state.list = [];
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPersonelpresetting.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPersonelpresetting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPersonelpresetting.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewPersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewPersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(SavepreviewPersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovePersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovePersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovePersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompletePersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompletePersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ActivatePersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ActivatePersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ActivatePersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeactivatePersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeactivatePersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeactivatePersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });

    },
});

export const {
    fillPersonelpresettingnotification,
    removePersonelpresettingnotification,
} = PersonelpresettingsSlice.actions;

export default PersonelpresettingsSlice.reducer;