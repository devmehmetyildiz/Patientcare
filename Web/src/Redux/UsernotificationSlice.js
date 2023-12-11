import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescription: {
        en: 'Notification added successfully',
        tr: 'Bildirim Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Notification updated successfully',
        tr: 'Bildirim Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Notification Deleted successfully',
        tr: 'Bildirim Başarı ile Silindi'
    },
}

export const GetUsernotifications = createAsyncThunk(
    'Usernotifications/GetUsernotifications',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USERNOTIFICATION + '/GetUsernotificationsbyUserid/' + guid);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUsernotification = createAsyncThunk(
    'Usernotifications/GetUsernotification',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, `${ROUTES.USERNOTIFICATION}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddUsernotifications = createAsyncThunk(
    'Usernotifications/AddUsernotifications',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Userrole, ROUTES.USERNOTIFICATION, data);
            dispatch(fillUsernotificationnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('UsernotificationsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Usernotifications');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotificationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUsernotifications = createAsyncThunk(
    'Usernotifications/EditUsernotifications',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Userrole, ROUTES.USERNOTIFICATION, data);
            dispatch(fillUsernotificationnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('UsernotificationsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Usernotifications');
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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Userrole, ROUTES.USERNOTIFICATION + '/Editrecord', data);
            dispatch(fillUsernotificationnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('UsernotificationsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Usernotifications');
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
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Userrole, `${ROUTES.USERNOTIFICATION}/${data.Uuid}`);
            dispatch(fillUsernotificationnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
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
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
        isDeletemodalopen: false,
        isViewmodalopen: false,
    },
    reducers: {
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
            .addCase(GetUsernotifications.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetUsernotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetUsernotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUsernotification.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetUsernotification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetUsernotification.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddUsernotifications.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddUsernotifications.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddUsernotifications.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUsernotifications.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditUsernotifications.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditUsernotifications.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditRecordUsernotifications.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditRecordUsernotifications.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditRecordUsernotifications.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUsernotifications.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteUsernotifications.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteUsernotifications.rejected, (state, action) => {
                state.isDispatching = false;
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
} = UsernotificationsSlice.actions;

export default UsernotificationsSlice.reducer;