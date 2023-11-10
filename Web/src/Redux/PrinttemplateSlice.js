import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import notification from '../Utils/Notification';

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescription: {
        en: 'Print template added successfully',
        tr: 'Yazdırma taslağı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Print template updated successfully',
        tr: 'Yazdırma taslağı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Print template Deleted successfully',
        tr: 'Yazdırma taslağı Başarı ile Silindi'
    },
}

export const GetPrinttemplates = createAsyncThunk(
    'Printtemplates/GetPrinttemplates',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, ROUTES.PRINTTEMPLATE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPrinttemplate = createAsyncThunk(
    'Printtemplates/GetPrinttemplate',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, `${ROUTES.PRINTTEMPLATE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPrinttemplates = createAsyncThunk(
    'Printtemplates/AddPrinttemplates',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.System, ROUTES.PRINTTEMPLATE, data);
            dispatch(fillPrinttemplatenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('PrinttemplatesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Printtemplates');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPrinttemplates = createAsyncThunk(
    'Printtemplates/EditPrinttemplates',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.System, ROUTES.PRINTTEMPLATE, data);
            dispatch(fillPrinttemplatenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('PrinttemplatesEdit')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Printtemplates');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePrinttemplates = createAsyncThunk(
    'Printtemplates/DeletePrinttemplates',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'

            const response = await instanse.delete(config.services.System, `${ROUTES.PRINTTEMPLATE}/${data.Uuid}`);
            dispatch(fillPrinttemplatenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PrinttemplatesSlice = createSlice({
    name: 'Printtemplates',
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
        handleSelectedPrinttemplate: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPrinttemplatenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePrinttemplatenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPrinttemplates.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPrinttemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPrinttemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPrinttemplate.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPrinttemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPrinttemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPrinttemplates.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPrinttemplates.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPrinttemplates.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPrinttemplates.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPrinttemplates.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPrinttemplates.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePrinttemplates.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePrinttemplates.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePrinttemplates.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPrinttemplate,
    fillPrinttemplatenotification,
    removePrinttemplatenotification,
    handleDeletemodal
} = PrinttemplatesSlice.actions;

export default PrinttemplatesSlice.reducer;