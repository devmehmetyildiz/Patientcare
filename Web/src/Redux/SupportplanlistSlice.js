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
        en: 'Support plan list added successfully',
        tr: 'Destek Plan Listesi Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Support plan list updated successfully',
        tr: 'Destek PLan Listesi Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Support Plan list Deleted successfully',
        tr: 'Destek Plan Lisesi Başarı ile Silindi'
    },
}

export const GetSupportplanlists = createAsyncThunk(
    'Supportplanlists/GetSupportplanlists',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.SUPPORTPLANLIST);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplanlistnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetSupportplanlist = createAsyncThunk(
    'Supportplanlists/GetSupportplanlist',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.SUPPORTPLANLIST}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplanlistnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddSupportplanlists = createAsyncThunk(
    'Supportplanlists/AddSupportplanlists',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.SUPPORTPLANLIST, data);
            dispatch(fillSupportplanlistnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('SupportplanlistsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Supportplanlists');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplanlistnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditSupportplanlists = createAsyncThunk(
    'Supportplanlists/EditSupportplanlists',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.SUPPORTPLANLIST, data);
            dispatch(fillSupportplanlistnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('SupportplanlistsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Supportplanlists');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplanlistnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteSupportplanlists = createAsyncThunk(
    'Supportplanlists/DeleteSupportplanlists',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.SUPPORTPLANLIST}/${data.Uuid}`);
            dispatch(fillSupportplanlistnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSupportplanlistnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SupportplanlistSlice = createSlice({
    name: 'Supportplanlists',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedSupportplanlist: (state, action) => {
            state.selected_record = action.payload;
        },
        fillSupportplanlistnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeSupportplanlistnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetSupportplanlists.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetSupportplanlists.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetSupportplanlists.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetSupportplanlist.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetSupportplanlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetSupportplanlist.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddSupportplanlists.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddSupportplanlists.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddSupportplanlists.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditSupportplanlists.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditSupportplanlists.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditSupportplanlists.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteSupportplanlists.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteSupportplanlists.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteSupportplanlists.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedSupportplanlist,
    fillSupportplanlistnotification,
    removeSupportplanlistnotification,
    handleDeletemodal
} = SupportplanlistSlice.actions;

export default SupportplanlistSlice.reducer;