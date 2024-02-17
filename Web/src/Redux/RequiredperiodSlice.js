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
        en: 'Requiredperiod added successfully',
        tr: 'Hizmet sunulma sıklığı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Requiredperiod updated successfully',
        tr: 'Hizmet sunulma sıklığı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Requiredperiod Deleted successfully',
        tr: 'Hizmet sunulma sıklığı Başarı ile Silindi'
    },
}

export const GetRequiredperiods = createAsyncThunk(
    'Requiredperiods/GetRequiredperiods',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.REQUIREDPERIOD);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRequiredperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetRequiredperiod = createAsyncThunk(
    'Requiredperiods/GetRequiredperiod',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.REQUIREDPERIOD}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRequiredperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRequiredperiods = createAsyncThunk(
    'Requiredperiods/AddRequiredperiods',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.REQUIREDPERIOD, data);
            dispatch(fillRequiredperiodnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            dispatch(fillRequiredperiodnotification({
                type: 'Clear',
                code: 'RequiredperiodsCreate',
                description: '',
            }));
            clearForm && clearForm('RequiredperiodsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Requiredperiods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRequiredperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditRequiredperiods = createAsyncThunk(
    'Requiredperiods/EditRequiredperiods',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.REQUIREDPERIOD, data);
            dispatch(fillRequiredperiodnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('RequiredperiodsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Requiredperiods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRequiredperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteRequiredperiods = createAsyncThunk(
    'Requiredperiods/DeleteRequiredperiods',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.REQUIREDPERIOD}/${data.Uuid}`);
            dispatch(fillRequiredperiodnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRequiredperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const RequiredperiodsSlice = createSlice({
    name: 'Requiredperiods',
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
        handleSelectedRequiredperiod: (state, action) => {
            state.selected_record = action.payload;
        },
        fillRequiredperiodnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeRequiredperiodnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetRequiredperiods.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetRequiredperiods.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetRequiredperiods.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetRequiredperiod.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetRequiredperiod.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetRequiredperiod.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRequiredperiods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRequiredperiods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRequiredperiods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditRequiredperiods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditRequiredperiods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditRequiredperiods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteRequiredperiods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteRequiredperiods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteRequiredperiods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedRequiredperiod,
    fillRequiredperiodnotification,
    removeRequiredperiodnotification,
    handleDeletemodal
} = RequiredperiodsSlice.actions;

export default RequiredperiodsSlice.reducer;