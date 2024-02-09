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
        en: 'Usage type added successfully',
        tr: 'Kullanım türü Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Usage type updated successfully',
        tr: 'Kullanım türü Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Usage type Deleted successfully',
        tr: 'Kullanım türü Başarı ile Silindi'
    },
}

export const GetUsagetypes = createAsyncThunk(
    'Usagetypes/GetUsagetypes',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.USAGETYPE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsagetypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUsagetype = createAsyncThunk(
    'Usagetypes/GetUsagetype',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.USAGETYPE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsagetypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddUsagetypes = createAsyncThunk(
    'Usagetypes/AddUsagetypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.USAGETYPE, data);
            dispatch(fillUsagetypenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('UsagetypesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Usagetypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsagetypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordUsagetypes = createAsyncThunk(
    'Usagetypes/AddRecordUsagetypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.USAGETYPE + '/AddRecord', data);
            dispatch(fillUsagetypenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('UsagetypesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Usagetypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsagetypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUsagetypes = createAsyncThunk(
    'Usagetypes/EditUsagetypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.USAGETYPE, data);
            dispatch(fillUsagetypenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            closeModal && closeModal()
            clearForm && clearForm('UsagetypesUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Usagetypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsagetypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteUsagetypes = createAsyncThunk(
    'Usagetypes/DeleteUsagetypes',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.USAGETYPE}/${data.Uuid}`);
            dispatch(fillUsagetypenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUsagetypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const UsagetypesSlice = createSlice({
    name: 'Usagetypes',
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
        handleSelectedUsagetype: (state, action) => {
            state.selected_record = action.payload;
        },
        fillUsagetypenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeUsagetypenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetUsagetypes.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetUsagetypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetUsagetypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUsagetype.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetUsagetype.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetUsagetype.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddUsagetypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddUsagetypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddUsagetypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordUsagetypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordUsagetypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordUsagetypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUsagetypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditUsagetypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditUsagetypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUsagetypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteUsagetypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteUsagetypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleDeletemodal,
    fillUsagetypenotification,
    removeUsagetypenotification,
    handleSelectedUsagetype
} = UsagetypesSlice.actions;

export default UsagetypesSlice.reducer;