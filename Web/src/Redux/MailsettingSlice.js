import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.System, ROUTES.MAILSETTING, data);
            dispatch(fillMailsettingnotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'Mail Ayarı başarı ile Eklendi',
            }));
            history.push('/Mailsettings');
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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.System, ROUTES.MAILSETTING, data);
            dispatch(fillMailsettingnotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Mail Ayarı başarı ile Güncellendi',
            }));
            history.push('/Mailsettings');
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
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.System, `${ROUTES.MAILSETTING}/${data.Uuid}`);
            dispatch(fillMailsettingnotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'Mail Ayarı başarı ile Silindi',
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