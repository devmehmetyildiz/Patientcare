import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import { FileuploadPrepare } from '../Components/Fileupload';

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescription: {
        en: 'Mainteance added successfully',
        tr: 'Malzeme Bakım Talebi Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Mainteance updated successfully',
        tr: 'Malzeme Bakım Talebi Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Mainteance Deleted successfully',
        tr: 'Malzeme Bakım Talebi Başarı ile Silindi'
    },
}

export const GetMainteancies = createAsyncThunk(
    'Mainteancies/GetMainteancies',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.MAINTEANCE);
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteancenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetMaineance = createAsyncThunk(
    'Mainteancies/GetMaineance',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.MAINTEANCE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteancenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddMainteancies = createAsyncThunk(
    'Mainteancies/AddMainteancies',
    async ({ data, history, files, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.MAINTEANCE, data);
            dispatch(fillMainteancenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('MainteanciesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Mainteancies');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillMainteancenotification, Literals, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteancenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditMainteancies = createAsyncThunk(
    'Mainteancies/EditMainteancies',
    async ({ data, history, files, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.MAINTEANCE, data);
            dispatch(fillMainteancenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('MainteanciesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Mainteancies');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillMainteancenotification, Literals, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteancenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteMainteancies = createAsyncThunk(
    'Mainteancies/CompleteMainteancies',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.MAINTEANCE + '/Complete', data);
            dispatch(fillMainteancenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteancenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteMainteancies = createAsyncThunk(
    'Mainteancies/DeleteMainteancies',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.MAINTEANCE}/${data.Uuid}`);
            dispatch(fillMainteancenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteancenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const MainteanciesSlice = createSlice({
    name: 'Mainteancies',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isCompletemodalopen: false,
    },
    reducers: {
        handleSelectedMainteance: (state, action) => {
            state.selected_record = action.payload;
        },
        fillMainteancenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeMainteancenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetMainteancies.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetMainteancies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetMainteancies.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetMaineance.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetMaineance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetMaineance.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddMainteancies.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddMainteancies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddMainteancies.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditMainteancies.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditMainteancies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditMainteancies.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteMainteancies.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteMainteancies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompleteMainteancies.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteMainteancies.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteMainteancies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteMainteancies.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedMainteance,
    fillMainteancenotification,
    removeMainteancenotification,
    handleDeletemodal,
    handleCompletemodal
} = MainteanciesSlice.actions;

export default MainteanciesSlice.reducer;