import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPersonelshifts = createAsyncThunk(
    'Personelshifts/GetPersonelshifts',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PERSONELSHIFT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPersonelshift = createAsyncThunk(
    'Personelshifts/GetPersonelshift',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PERSONELSHIFT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPersonelshifts = createAsyncThunk(
    'Personelshifts/AddPersonelshifts',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PERSONELSHIFT, data);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Personelshifts.Messages.Add'),
            }));
            clearForm && clearForm('PersonelshiftsCreate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Personelshifts');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPersonelshifts = createAsyncThunk(
    'Personelshifts/EditPersonelshifts',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PERSONELSHIFT, data);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelshifts.Messages.Update'),
            }));
            clearForm && clearForm('PersonelshiftsUpdate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Personelshifts');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewPersonelshifts = createAsyncThunk(
    'Personelshifts/SavepreviewPersonelshifts',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELSHIFT}/Savepreview/${uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelshifts.Messages.Savepreview'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePersonelshifts = createAsyncThunk(
    'Personelshifts/ApprovePersonelshifts',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELSHIFT}/Approve/${uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelshifts.Messages.Approve'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompletePersonelshifts = createAsyncThunk(
    'Personelshifts/CompletePersonelshifts',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELSHIFT}/Complete/${uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelshifts.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ActivatePersonelshifts = createAsyncThunk(
    'Personelshifts/ActivatePersonelshifts',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELSHIFT}/Activate/${uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelshifts.Messages.Activated'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeactivatePersonelshifts = createAsyncThunk(
    'Personelshifts/DeactivatePersonelshifts',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELSHIFT}/Deactivate/${uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Personelshifts.Messages.Deactivated'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePersonelshifts = createAsyncThunk(
    'Personelshifts/DeletePersonelshifts',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PERSONELSHIFT}/${uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Personelshifts.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PersonelshiftsSlice = createSlice({
    name: 'Personelshifts',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        fillPersonelshiftnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePersonelshiftnotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPersonelshifts.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPersonelshifts.rejected, (state, action) => {
                state.list = [];
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPersonelshift.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPersonelshift.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPersonelshift.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewPersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(SavepreviewPersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompletePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompletePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ActivatePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ActivatePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ActivatePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeactivatePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeactivatePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeactivatePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    fillPersonelshiftnotification,
    removePersonelshiftnotification,
} = PersonelshiftsSlice.actions;

export default PersonelshiftsSlice.reducer;