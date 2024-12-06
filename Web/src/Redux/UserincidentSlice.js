import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetUserincidents = createAsyncThunk(
    'Userincidents/GetUserincidents',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.USERINCIDENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUserincidentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUserincident = createAsyncThunk(
    'Userincidents/GetUserincident',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.USERINCIDENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUserincidentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddUserincidents = createAsyncThunk(
    'Userincidents/AddUserincidents',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.USERINCIDENT, data);
            dispatch(fillUserincidentnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Userincidents.Messages.Add'),
            }));
            clearForm && clearForm('UserincidentsCreate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Userincidents');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUserincidentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUserincidents = createAsyncThunk(
    'Userincidents/EditUserincidents',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.USERINCIDENT, data);
            dispatch(fillUserincidentnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Userincidents.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('UserincidentsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Userincidents');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUserincidentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewUserincidents = createAsyncThunk(
    'Userincidents/SavepreviewUserincidents',
    async ({ userincidentID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.USERINCIDENT}/Savepreview/${userincidentID}`);
            dispatch(fillUserincidentnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Userincidents.Messages.Savepreview'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUserincidentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveUserincidents = createAsyncThunk(
    'Userincidents/ApproveUserincidents',
    async ({ userincidentID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.USERINCIDENT}/Approve/${userincidentID}`);
            dispatch(fillUserincidentnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Userincidents.Messages.Approve'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUserincidentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteUserincidents = createAsyncThunk(
    'Userincidents/CompleteUserincidents',
    async ({ userincidentID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.USERINCIDENT}/Complete/${userincidentID}`);
            dispatch(fillUserincidentnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Userincidents.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUserincidentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteUserincidents = createAsyncThunk(
    'Userincidents/DeleteUserincidents',
    async ({ userincidentID, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.USERINCIDENT}/${userincidentID}`);
            dispatch(fillUserincidentnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Userincidents.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUserincidentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const UserincidentsSlice = createSlice({
    name: 'Userincidents',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedUserincident: (state, action) => {
            state.selected_record = action.payload;
        },
        fillUserincidentnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeUserincidentnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetUserincidents.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetUserincidents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetUserincidents.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUserincident.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetUserincident.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetUserincident.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddUserincidents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddUserincidents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddUserincidents.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUserincidents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditUserincidents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditUserincidents.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUserincidents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteUserincidents.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(DeleteUserincidents.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewUserincidents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewUserincidents.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(SavepreviewUserincidents.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveUserincidents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveUserincidents.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(ApproveUserincidents.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteUserincidents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteUserincidents.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(CompleteUserincidents.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    handleSelectedUserincident,
    fillUserincidentnotification,
    removeUserincidentnotification,
    handleDeletemodal
} = UserincidentsSlice.actions;

export default UserincidentsSlice.reducer;