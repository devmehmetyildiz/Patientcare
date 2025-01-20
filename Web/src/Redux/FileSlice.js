import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES, STORAGE_KEY_PATIENTCARE_ACCESSTOKEN } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import axios from 'axios';

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescription: {
        en: 'File added successfully',
        tr: 'Dosya Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'File updated successfully',
        tr: 'Dosya Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'File Deleted successfully',
        tr: 'Dosya Başarı ile Silindi'
    },
}

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

export const GetCompanyFiles = createAsyncThunk(
    'Files/GetCompanyFiles',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.File, ROUTES.FILE, data);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillFilenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPPFiles = createAsyncThunk(
    'Files/GetPPFiles',
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
    async ({ data, history, url, closeModal }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await axios({
                method: `post`,
                url: config.services.File + `${ROUTES.FILE}`,
                headers: { Authorization: "Bearer " + localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN), contentType: 'mime/form-data' },
                data: data
            })
            dispatch(fillFilenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillFilenotification({
                type: 'Clear',
                code: 'FilesCreate',
                description: '',
            }));
            closeModal && closeModal()
            history && history.push(url ? url : '/Files')
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
    async ({ data, history, url }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await axios({
                method: `put`,
                url: config.services.File + `${ROUTES.FILE}`,
                headers: { Authorization: "Bearer " + localStorage.getItem(STORAGE_KEY_PATIENTCARE_ACCESSTOKEN), contentType: 'mime/form-data' },
                data: data
            })
            dispatch(fillFilenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillFilenotification({
                type: 'Clear',
                code: 'FilesEdit',
                description: '',
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
    async ({ guid, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'

            const response = await instanse.delete(config.services.File, `${ROUTES.FILE}/${guid}`);
            dispatch(fillFilenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            onSuccess && onSuccess()
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
        ppList: [],
        list: [],
        companyFileList: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isCompanyFileListLoading: false,
    },
    reducers: {
        fillFilenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeFilenotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCompanyFiles.pending, (state) => {
                state.isCompanyFileListLoading = true;
                state.errMsg = null;
            })
            .addCase(GetCompanyFiles.fulfilled, (state, action) => {
                state.isCompanyFileListLoading = false;
                state.companyFileList = action.payload;
            })
            .addCase(GetCompanyFiles.rejected, (state, action) => {
                state.companyFileList = [];
                state.isCompanyFileListLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetFiles.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetFiles.rejected, (state, action) => {
                state.list = [];
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPPFiles.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.ppList = [];
            })
            .addCase(GetPPFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.ppList = action.payload;
            })
            .addCase(GetPPFiles.rejected, (state, action) => {
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
                state.isLoading = true;
            })
            .addCase(AddFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditFiles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteFiles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    fillFilenotification,
    removeFilenotification,
} = FilesSlice.actions;

export default FilesSlice.reducer;