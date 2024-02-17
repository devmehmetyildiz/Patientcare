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
        en: 'Helpstatu added successfully',
        tr: 'Bakıma İhtiyaç Durumu Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Helpstatu updated successfully',
        tr: 'Bakıma İhtiyaç Durumu Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Helpstatu Deleted successfully',
        tr: 'Bakıma İhtiyaç Durumu Başarı ile Silindi'
    },
}

export const GetHelpstatus = createAsyncThunk(
    'Helpstatus/GetHelpstatus',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.HELPSTATU);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillHelpstatunotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetHelpstatu = createAsyncThunk(
    'Helpstatus/GetHelpstatu',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.HELPSTATU}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillHelpstatunotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddHelpstatus = createAsyncThunk(
    'Helpstatus/AddHelpstatus',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.HELPSTATU, data);
            dispatch(fillHelpstatunotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            dispatch(fillHelpstatunotification({
                type: 'Clear',
                code: 'HelpstatusCreate',
                description: '',
            }));
            clearForm && clearForm('HelpstatusCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Helpstatus');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillHelpstatunotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditHelpstatus = createAsyncThunk(
    'Helpstatus/EditHelpstatus',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.HELPSTATU, data);
            dispatch(fillHelpstatunotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('HelpstatusUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Helpstatus');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillHelpstatunotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteHelpstatus = createAsyncThunk(
    'Helpstatus/DeleteHelpstatus',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.HELPSTATU}/${data.Uuid}`);
            dispatch(fillHelpstatunotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillHelpstatunotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const HelpstatusSlice = createSlice({
    name: 'Helpstatus',
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
        handleSelectedHelpstatu: (state, action) => {
            state.selected_record = action.payload;
        },
        fillHelpstatunotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeHelpstatunotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetHelpstatus.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetHelpstatus.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetHelpstatus.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetHelpstatu.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetHelpstatu.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetHelpstatu.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddHelpstatus.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddHelpstatus.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddHelpstatus.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditHelpstatus.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditHelpstatus.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditHelpstatus.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteHelpstatus.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteHelpstatus.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteHelpstatus.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedHelpstatu,
    fillHelpstatunotification,
    removeHelpstatunotification,
    handleDeletemodal
} = HelpstatusSlice.actions;

export default HelpstatusSlice.reducer;