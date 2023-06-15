import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "../Actions/axios";
import config from "../../Config";
import Cookies from 'universal-cookie';
import axios from 'axios';

export const GetFiles = createAsyncThunk(
    'Files/GetFiles',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.File, ROUTES.FILE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFilenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetFile = createAsyncThunk(
    'Files/GetFile',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.File, `${ROUTES.FILE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFilenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddFiles = createAsyncThunk(
    'Files/AddFiles',
    async ({ data, history, url }, { dispatch }) => {
        try {
            const localcookies = new Cookies();
            const response = await axios({
                method: `post`,
                url: config.services.File + `${ROUTES.FILE}`,
                headers: { Authorization: "Bearer  " + localcookies.get('patientcare'), contentType: 'mime/form-data' },
                data: data
            })
            dispatch(fillFilenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push(url ? url : '/Files')
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFilenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditFiles = createAsyncThunk(
    'Files/EditFiles',
    async ({ data, history, url }, { dispatch }) => {
        try {
            const localcookies = new Cookies();
            const response = await axios({
                method: `put`,
                url: config.services.File + `${ROUTES.FILE}`,
                headers: { Authorization: "Bearer  " + localcookies.get('patientcare'), contentType: 'mime/form-data' },
                data: data
            })
            dispatch(fillFilenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history && history.push(url ? url : '/Files')
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFilenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteFiles = createAsyncThunk(
    'Files/DeleteFiles',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.File, `${ROUTES.FILE}/${data.Uuid}`);
            dispatch(fillFilenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFilenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const FilesSlice = createSlice({
    name: 'Files',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedFile: (state) => {
            state.selected_record = {};
        },
        fillFilenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeFilenotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetFiles.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetFile.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetFile.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddFiles.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddFiles.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddFiles.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditFiles.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditFiles.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditFiles.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteFiles.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteFiles.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteFiles.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedFile,
    fillFilenotification,
    removeFilenotification,
} = FilesSlice.actions;

export default FilesSlice.reducer;