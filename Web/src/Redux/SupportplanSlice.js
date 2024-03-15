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
        en: 'Support plan added successfully',
        tr: 'Destek PLanı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Support plan updated successfully',
        tr: 'Destek Planı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Support PLan Deleted successfully',
        tr: 'Destek Planı Başarı ile Silindi'
    },
}

export const GetSupportplans = createAsyncThunk(
    'Supportplans/GetSupportplans',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.SUPPORTPLAN);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetSupportplan = createAsyncThunk(
    'Supportplans/GetSupportplan',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.SUPPORTPLAN}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddSupportplans = createAsyncThunk(
    'Supportplans/AddSupportplans',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.SUPPORTPLAN, data);
            dispatch(fillSupportplannotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('SupportplansCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Supportplans');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditSupportplans = createAsyncThunk(
    'Supportplans/EditSupportplans',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.SUPPORTPLAN, data);
            dispatch(fillSupportplannotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('SupportplansUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Supportplans');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteSupportplans = createAsyncThunk(
    'Supportplans/DeleteSupportplans',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.SUPPORTPLAN}/${data.Uuid}`);
            dispatch(fillSupportplannotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SupportplansSlice = createSlice({
    name: 'Supportplans',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedSupportplan: (state, action) => {
            state.selected_record = action.payload;
        },
        fillSupportplannotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeSupportplannotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetSupportplans.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetSupportplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetSupportplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetSupportplan.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetSupportplan.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetSupportplan.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddSupportplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddSupportplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddSupportplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditSupportplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditSupportplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditSupportplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteSupportplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteSupportplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteSupportplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedSupportplan,
    fillSupportplannotification,
    removeSupportplannotification,
    handleDeletemodal
} = SupportplansSlice.actions;

export default SupportplansSlice.reducer;