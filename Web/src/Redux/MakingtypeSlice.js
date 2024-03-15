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
        en: 'Makingtype added successfully',
        tr: 'Hizmetin verilme şekli Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Makingtype updated successfully',
        tr: 'Hizmetin verilme şekli Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Makingtype Deleted successfully',
        tr: 'Hizmetin verilme şekli Başarı ile Silindi'
    },
}

export const GetMakingtypes = createAsyncThunk(
    'Makingtypes/GetMakingtypes',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.MAKINGTYPE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMakingtypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetMakingtype = createAsyncThunk(
    'Makingtypes/GetMakingtype',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.MAKINGTYPE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMakingtypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddMakingtypes = createAsyncThunk(
    'Makingtypes/AddMakingtypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.MAKINGTYPE, data);
            dispatch(fillMakingtypenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            dispatch(fillMakingtypenotification({
                type: 'Clear',
                code: 'MakingtypesCreate',
                description: '',
            }));
            clearForm && clearForm('MakingtypesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Makingtypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMakingtypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditMakingtypes = createAsyncThunk(
    'Makingtypes/EditMakingtypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.MAKINGTYPE, data);
            dispatch(fillMakingtypenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('MakingtypesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Makingtypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMakingtypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteMakingtypes = createAsyncThunk(
    'Makingtypes/DeleteMakingtypes',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.MAKINGTYPE}/${data.Uuid}`);
            dispatch(fillMakingtypenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMakingtypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const MakingtypesSlice = createSlice({
    name: 'Makingtypes',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedMakingtype: (state, action) => {
            state.selected_record = action.payload;
        },
        fillMakingtypenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeMakingtypenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetMakingtypes.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetMakingtypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetMakingtypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetMakingtype.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetMakingtype.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetMakingtype.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddMakingtypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddMakingtypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddMakingtypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditMakingtypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditMakingtypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditMakingtypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteMakingtypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteMakingtypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteMakingtypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedMakingtype,
    fillMakingtypenotification,
    removeMakingtypenotification,
    handleDeletemodal
} = MakingtypesSlice.actions;

export default MakingtypesSlice.reducer;