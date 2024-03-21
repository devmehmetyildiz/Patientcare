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
        en: 'Shiftdefine added successfully',
        tr: 'Vardiya Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Shiftdefine updated successfully',
        tr: 'Vardiya Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Shiftdefine Deleted successfully',
        tr: 'Vardiya Başarı ile Silindi'
    },
}

export const GetShiftdefines = createAsyncThunk(
    'Shiftdefines/GetShiftdefines',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.SHIFTDEFINE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetShiftdefine = createAsyncThunk(
    'Shiftdefines/GetShiftdefine',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.SHIFTDEFINE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddShiftdefines = createAsyncThunk(
    'Shiftdefines/AddShiftdefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.SHIFTDEFINE, data);
            dispatch(fillShiftdefinenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('ShiftdefinesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Shiftdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditShiftdefines = createAsyncThunk(
    'Shiftdefines/EditShiftdefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.SHIFTDEFINE, data);
            dispatch(fillShiftdefinenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('ShiftdefinesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Shiftdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteShiftdefines = createAsyncThunk(
    'Shiftdefines/DeleteShiftdefines',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.SHIFTDEFINE}/${data.Uuid}`);
            dispatch(fillShiftdefinenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ShiftdefinesSlice = createSlice({
    name: 'Shiftdefines',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
    },
    reducers: {
        handleSelectedShiftdefine: (state, action) => {
            state.selected_record = action.payload;
        },
        fillShiftdefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeShiftdefinenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetShiftdefines.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetShiftdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetShiftdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetShiftdefine.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetShiftdefine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetShiftdefine.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddShiftdefines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddShiftdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddShiftdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditShiftdefines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditShiftdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditShiftdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteShiftdefines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteShiftdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteShiftdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    handleSelectedShiftdefine,
    fillShiftdefinenotification,
    removeShiftdefinenotification,
    handleDeletemodal
} = ShiftdefinesSlice.actions;

export default ShiftdefinesSlice.reducer;