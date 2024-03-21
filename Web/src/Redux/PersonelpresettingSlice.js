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
        en: 'Personelpresetting added successfully',
        tr: 'Personel Ön Ayarı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Personelpresetting updated successfully',
        tr: 'Personel Ön Ayarı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Personelpresetting Deleted successfully',
        tr: 'Personel Ön Ayarı Başarı ile Silindi'
    },
}

export const GetPersonelpresettings = createAsyncThunk(
    'Personelpresettings/GetPersonelpresettings',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PERSONELPRESETTING);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPersonelpresetting = createAsyncThunk(
    'Personelpresettings/GetPersonelpresetting',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PERSONELPRESETTING}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPersonelpresettings = createAsyncThunk(
    'Personelpresettings/AddPersonelpresettings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PERSONELPRESETTING, data);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PersonelpresettingsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Personelpresettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPersonelpresettings = createAsyncThunk(
    'Personelpresettings/EditPersonelpresettings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PERSONELPRESETTING, data);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            closeModal && closeModal()
            clearForm && clearForm('PersonelpresettingsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Personelpresettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePersonelpresettings = createAsyncThunk(
    'Personelpresettings/DeletePersonelpresettings',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PERSONELPRESETTING}/${data.Uuid}`);
            dispatch(fillPersonelpresettingnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PersonelpresettingsSlice = createSlice({
    name: 'Personelpresettings',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedPersonelpresetting: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPersonelpresettingnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePersonelpresettingnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPersonelpresettings.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPersonelpresetting.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPersonelpresetting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPersonelpresetting.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePersonelpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePersonelpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePersonelpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPersonelpresetting,
    fillPersonelpresettingnotification,
    removePersonelpresettingnotification,
    handleDeletemodal
} = PersonelpresettingsSlice.actions;

export default PersonelpresettingsSlice.reducer;