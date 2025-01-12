import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import validator from '../Utils/Validator';

export const GetUsernotifications = createAsyncThunk(
    'Usernotifications/GetUsernotifications',
    async ({ guid, onSuccess }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/GetUsernotificationsbyUserid/' + guid);
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUsernotificationsFreezed = createAsyncThunk(
    'Usernotifications/GetUsernotificationsFreezed',
    async ({ guid, onSuccess }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/GetUsernotificationsbyUserid/' + guid);
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetLastUsernotificationsbyUserid = createAsyncThunk(
    'Usernotifications/GetLastUsernotificationsbyUserid',
    async ({ guid, onSuccess }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/GetLastUsernotificationsbyUserid/' + guid);
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetLastUsernotificationsbyUseridFreezed = createAsyncThunk(
    'Usernotifications/GetLastUsernotificationsbyUseridFreezed',
    async ({ guid, onSuccess }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/GetLastUsernotificationsbyUserid/' + guid);
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUnreadNotificationCountByUser = createAsyncThunk(
    'Usernotifications/GetUnreadNotificationCountByUser',
    async ({ guid, onSuccess }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/GetUnreadNotificationCountByUser/' + guid);
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUnshowedNotificationCountByUser = createAsyncThunk(
    'Usernotifications/GetUnshowedNotificationCountByUser',
    async ({ guid, onSuccess }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/GetUnshowedNotificationCountByUser/' + guid);
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ReadAllNotificationByUser = createAsyncThunk(
    'Usernotifications/ReadAllNotificationByUser',
    async ({ guid, onSuccess }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/ReadAllNotificationByUser/' + guid);
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ShowAllNotificationByUser = createAsyncThunk(
    'Usernotifications/ShowAllNotificationByUser',
    async ({ guid, onSuccess }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/ShowAllNotificationByUser/' + guid);
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditRecordUsernotifications = createAsyncThunk(
    'Usernotifications/EditRecordUsernotifications',
    async ({ data, history, redirectUrl, closeModal, clearForm, dontShownotification, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Userrole, ROUTES.USERNOTIFICATION + '/Editrecord', data);
            !dontShownotification && dispatch(fillUsernotificationnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Usernotifications.Messages.Update'),
            }));
            clearForm && clearForm('UsernotificationsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Usernotifications');
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteUsernotifications = createAsyncThunk(
    'Usernotifications/DeleteUsernotifications',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Userrole, `${ROUTES.USERNOTIFICATION}/${data.Uuid}`);
            dispatch(fillUsernotificationnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Usernotifications.Messages.Delete'),
            }));
            const userId = state.Profile?.meta?.Uuid
            if (validator.isUUID(userId)) {
                const notificaitonResponse = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/GetUsernotificationsbyUserid/' + userId);
                return notificaitonResponse.data
            }
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteReadByUserID = createAsyncThunk(
    'Usernotifications/DeleteUsernotificationbyidreaded',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Userrole, `${ROUTES.USERNOTIFICATION}/DeleteUsernotificationbyidreaded/${data}`);
            dispatch(fillUsernotificationnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Usernotifications.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteByUserID = createAsyncThunk(
    'Usernotifications/DeleteUsernotificationbyid',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Userrole, `${ROUTES.USERNOTIFICATION}/DeleteUsernotificationbyid/${data}`);
            dispatch(fillUsernotificationnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Usernotifications.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const UsernotificationsSlice = createSlice({
    name: 'Usernotifications',
    initialState: {
        open: false,
        modalList: [],
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        unShowedCount: 0,
        unReadCount: 0,
        isUnShowedCountLoading: false,
        isUnReadCountLoading: false,
        isModalListLoading: false,
        isLoading: false,
        isEditLoading: false,
        isDeletemodalopen: false,
        isViewmodalopen: false,
    },
    reducers: {
        handleNotificationSidebar: (state) => {
            state.open = !state.open;
        },
        handleOpen: (state, action) => {
            state.open = action.payload;
        },
        openSidebar: (state) => {
            state.open = true;
        },
        closeSidebar: (state) => {
            state.open = false;
        },
        toggleSidebar: (state) => {
            state.open = !state.open;
        },
        handleSelectedUsernotification: (state, action) => {
            state.selected_record = action.payload;
        },
        fillUsernotificationnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeUsernotificationnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleViewmodal: (state, action) => {
            state.isViewmodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(ShowAllNotificationByUser.pending, (state) => {
                state.errMsg = null;
            })
            .addCase(ShowAllNotificationByUser.fulfilled, (state) => {
            })
            .addCase(ShowAllNotificationByUser.rejected, (state, action) => {
                state.errMsg = action.error.message;
            })
            .addCase(ReadAllNotificationByUser.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(ReadAllNotificationByUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(ReadAllNotificationByUser.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUnshowedNotificationCountByUser.pending, (state) => {
                state.isUnShowedCountLoading = true;
                state.errMsg = null;
                state.unShowedCount = 0;
            })
            .addCase(GetUnshowedNotificationCountByUser.fulfilled, (state, action) => {
                state.isUnShowedCountLoading = false;
                state.unShowedCount = action.payload;
            })
            .addCase(GetUnshowedNotificationCountByUser.rejected, (state, action) => {
                state.isUnShowedCountLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUnreadNotificationCountByUser.pending, (state) => {
                state.isUnReadCountLoading = true;
                state.errMsg = null;
                state.unReadCount = 0;
            })
            .addCase(GetUnreadNotificationCountByUser.fulfilled, (state, action) => {
                state.isUnReadCountLoading = false;
                state.unReadCount = action.payload;
            })
            .addCase(GetUnreadNotificationCountByUser.rejected, (state, action) => {
                state.isUnReadCountLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetLastUsernotificationsbyUseridFreezed.pending, (state) => {
                state.errMsg = null;
            })
            .addCase(GetLastUsernotificationsbyUseridFreezed.fulfilled, (state, action) => {
                state.modalList = action.payload;
            })
            .addCase(GetLastUsernotificationsbyUseridFreezed.rejected, (state, action) => {
                state.errMsg = action.error.message;
            })
            .addCase(GetLastUsernotificationsbyUserid.pending, (state) => {
                state.isModalListLoading = true;
                state.errMsg = null;
            })
            .addCase(GetLastUsernotificationsbyUserid.fulfilled, (state, action) => {
                state.isModalListLoading = false;
                state.modalList = action.payload;
            })
            .addCase(GetLastUsernotificationsbyUserid.rejected, (state, action) => {
                state.isModalListLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUsernotifications.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetUsernotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetUsernotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUsernotificationsFreezed.pending, (state) => {
                state.errMsg = null;
            })
            .addCase(GetUsernotificationsFreezed.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(GetUsernotificationsFreezed.rejected, (state, action) => {
                state.errMsg = action.error.message;
            })
            .addCase(EditRecordUsernotifications.pending, (state) => {
                state.isEditLoading = true;
            })
            .addCase(EditRecordUsernotifications.fulfilled, (state) => {
                state.isEditLoading = false;
            })
            .addCase(EditRecordUsernotifications.rejected, (state, action) => {
                state.isEditLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUsernotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteUsernotifications.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(DeleteUsernotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteReadByUserID.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteReadByUserID.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(DeleteReadByUserID.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteByUserID.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteByUserID.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(DeleteByUserID.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedUsernotification,
    fillUsernotificationnotification,
    removeUsernotificationnotification,
    handleDeletemodal,
    handleViewmodal,
    handleOpen,
    handleNotificationSidebar,
    openSidebar,
    closeSidebar,
    toggleSidebar
} = UsernotificationsSlice.actions;

export default UsernotificationsSlice.reducer;