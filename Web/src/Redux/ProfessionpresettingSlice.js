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
        en: 'Professionpresetting added successfully',
        tr: 'Meslek Ön Ayarı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Professionpresetting updated successfully',
        tr: 'Meslek Ön Ayarı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Professionpresetting Deleted successfully',
        tr: 'Meslek Ön Ayarı Başarı ile Silindi'
    },
}

export const GetProfessionpresettings = createAsyncThunk(
    'Professionpresettings/GetProfessionpresettings',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PROFESSIONPRESETTING);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetProfessionpresetting = createAsyncThunk(
    'Professionpresettings/GetProfessionpresetting',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddProfessionpresettings = createAsyncThunk(
    'Professionpresettings/AddProfessionpresettings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PROFESSIONPRESETTING, data);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('ProfessionpresettingsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Professionpresettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditProfessionpresettings = createAsyncThunk(
    'Professionpresettings/EditProfessionpresettings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PROFESSIONPRESETTING, data);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            closeModal && closeModal()
            clearForm && clearForm('ProfessionpresettingsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Professionpresettings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteProfessionpresettings = createAsyncThunk(
    'Professionpresettings/DeleteProfessionpresettings',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PROFESSIONPRESETTING}/${data.Uuid}`);
            dispatch(fillProfessionpresettingnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionpresettingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ProfessionpresettingsSlice = createSlice({
    name: 'Professionpresettings',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedProfessionpresetting: (state, action) => {
            state.selected_record = action.payload;
        },
        fillProfessionpresettingnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeProfessionpresettingnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetProfessionpresettings.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetProfessionpresetting.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetProfessionpresetting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetProfessionpresetting.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteProfessionpresettings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteProfessionpresettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteProfessionpresettings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedProfessionpresetting,
    fillProfessionpresettingnotification,
    removeProfessionpresettingnotification,
    handleDeletemodal
} = ProfessionpresettingsSlice.actions;

export default ProfessionpresettingsSlice.reducer;