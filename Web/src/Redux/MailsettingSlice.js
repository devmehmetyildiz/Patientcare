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
        en: 'Mailsetting added successfully',
        tr: 'Mail Ayarı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Mailsetting updated successfully',
        tr: 'Mail Ayarı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Mailsetting Deleted successfully',
        tr: 'Mail Ayarı Başarı ile Silindi'
    },
}

export const GetMailsettings = createAsyncThunk(
    'Mailsettings/GetMailsettings',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, ROUTES.MAILSETTING);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMailsettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetMailsetting = createAsyncThunk(
    'Mailsettings/GetMailsetting',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, `${ROUTES.MAILSETTING}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMailsettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddMailsettings = createAsyncThunk(
    'Mailsettings/AddMailsettings',
    async ({ data, history, redirectUrl, closeModal }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.System, ROUTES.MAILSETTING, data);
            dispatch(fillMailsettingnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillMailsettingnotification({
                type: 'Clear',
                code: 'MailsettingsCreate',
                description: '',
            }));
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Mailsettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMailsettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditMailsettings = createAsyncThunk(
    'Mailsettings/EditMailsettings',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.System, ROUTES.MAILSETTING, data);
            dispatch(fillMailsettingnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillMailsettingnotification({
                type: 'Clear',
                code: 'MailsettingsEdit',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Mailsettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMailsettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteMailsettings = createAsyncThunk(
    'Mailsettings/DeleteMailsettings',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'

            const response = await instanse.delete(config.services.System, `${ROUTES.MAILSETTING}/${data.Uuid}`);
            dispatch(fillMailsettingnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMailsettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const MailsettingsSlice = createSlice({
    name: 'Mailsettings',
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
        handleSelectedMailsetting: (state, action) => {
            state.selected_record = action.payload;
        },
        fillMailsettingnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeMailsettingnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetMailsettings.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetMailsettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetMailsettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetMailsetting.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetMailsetting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetMailsetting.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddMailsettings.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddMailsettings.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddMailsettings.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditMailsettings.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditMailsettings.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditMailsettings.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteMailsettings.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteMailsettings.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteMailsettings.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedMailsetting,
    fillMailsettingnotification,
    removeMailsettingnotification,
    handleDeletemodal
} = MailsettingsSlice.actions;

export default MailsettingsSlice.reducer;