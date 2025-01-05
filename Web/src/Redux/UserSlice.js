import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import { FileuploadPrepare } from '../Components/Fileupload';

export const GetUsers = createAsyncThunk(
    'Users/GetUsers',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USER);
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUsersforsearch = createAsyncThunk(
    'Users/GetUsersforsearch',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USER);
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUser = createAsyncThunk(
    'Users/GetUser',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, `${ROUTES.USER}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddUsers = createAsyncThunk(
    'Users/AddUsers',
    async ({ data, history, files, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Userrole, ROUTES.USER, data);
            dispatch(fillUsernotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Users.Messages.Add'),
            }));
            clearForm && clearForm('UsersCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Users');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillUsernotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUsers = createAsyncThunk(
    'Users/EditUsers',
    async ({ data, history, files, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Userrole, ROUTES.USER, data);
            dispatch(fillUsernotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Users.Messages.Update'),
            }));
            clearForm && clearForm('UsersEdit')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Users');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillUsernotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const RemoveUsers = createAsyncThunk(
    'Users/RemoveUsers',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Userrole, `${ROUTES.USER}/RemoveUsers`, data);
            dispatch(fillUsernotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Users.Messages.Remove'),
            }));
            onSuccess && onSuccess()
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteUsers = createAsyncThunk(
    'Users/DeleteUsers',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Userrole, `${ROUTES.USER}/${data.Uuid}`);
            dispatch(fillUsernotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Users.Messages.Delete'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteUsermovements = createAsyncThunk(
    'Users/DeleteUsermovements',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Userrole, `${ROUTES.USER}/DeleteUsermovement/${data.Uuid}`);
            dispatch(fillUsernotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Users.Messages.Deletemovement'),
            }));
            onSuccess && onSuccess()
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUsercase = createAsyncThunk(
    'Users/EditUsercase',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            await instanse.put(config.services.Userrole, ROUTES.USER + "/UpdateUsercase", data);
            dispatch(fillUsernotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Users.Messages.Updatecase'),
            }));
            onSuccess && onSuccess()
            return null;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUsermovements = createAsyncThunk(
    'Users/EditUsermovements',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            await instanse.put(config.services.Userrole, ROUTES.USER + '/UpdateUsermovement', data);
            dispatch(fillUsernotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Users.Messages.Updatemovements'),
            }));
            onSuccess && onSuccess()
            return null
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const UsersSlice = createSlice({
    name: 'Users',
    initialState: {
        list: [],
        listsearch: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isLoadingsearch: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedUser: (state, action) => {
            state.selected_record = action.payload;
        },
        fillUsernotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeUsernotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetUsers.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.list = [];
                state.errMsg = action.error.message;
            })
            .addCase(GetUsersforsearch.pending, (state) => {
                state.isLoadingsearch = true;
                state.errMsg = null;
                state.listsearch = [];
            })
            .addCase(GetUsersforsearch.fulfilled, (state, action) => {
                state.isLoadingsearch = false;
                state.listsearch = action.payload;
            })
            .addCase(GetUsersforsearch.rejected, (state, action) => {
                state.isLoadingsearch = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUser.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUsercase.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditUsercase.fulfilled, (state,) => {
                state.isLoading = false;
            })
            .addCase(EditUsercase.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUsermovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditUsermovements.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(EditUsermovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUsermovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteUsermovements.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(DeleteUsermovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(RemoveUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(RemoveUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(RemoveUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedUser,
    fillUsernotification,
    removeUsernotification,
    handleDeletemodal
} = UsersSlice.actions;

export default UsersSlice.reducer;