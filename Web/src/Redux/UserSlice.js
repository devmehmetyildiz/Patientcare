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
        en: 'User added successfully',
        tr: 'Kullanıcı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'User updated successfully',
        tr: 'Kullanıcı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'User Deleted successfully',
        tr: 'Kullanıcı Başarı ile Silindi'
    },
}

export const GetUsers = createAsyncThunk(
    'Users/GetUsers',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USER);
            return response.data;
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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Userrole, ROUTES.USER, data);
            dispatch(fillUsernotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Username}`,
            }));
            clearForm && clearForm('UsersCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Users');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUsers = createAsyncThunk(
    'Users/EditUsers',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Userrole, ROUTES.USER, data);
            dispatch(fillUsernotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Username}`,
            }));
            clearForm && clearForm('UsersEdit')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Users');
            return response.data;
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
            const Language = state.Profile.Language || 'en'

            const response = await instanse.delete(config.services.Userrole, `${ROUTES.USER}/${data.Uuid}`);
            dispatch(fillUsernotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Username}`,
            }));
            return response.data;
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
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
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
                state.list = [];
            })
            .addCase(GetUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetUsers.rejected, (state, action) => {
                state.isLoading = false;
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
                state.isDispatching = true;
            })
            .addCase(AddUsers.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddUsers.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUsers.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditUsers.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditUsers.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUsers.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteUsers.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteUsers.rejected, (state, action) => {
                state.isDispatching = false;
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