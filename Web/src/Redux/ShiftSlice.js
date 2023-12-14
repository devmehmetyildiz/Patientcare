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
        en: 'Shift added successfully',
        tr: 'Vardiya Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Shift updated successfully',
        tr: 'Vardiya Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Shift Deleted successfully',
        tr: 'Vardiya Başarı ile Silindi'
    },
}

export const GetShifts = createAsyncThunk(
    'Shifts/GetShifts',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.SHIFT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetShift = createAsyncThunk(
    'Shifts/GetShift',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.SHIFT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddShifts = createAsyncThunk(
    'Shifts/AddShifts',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.SHIFT, data);
            dispatch(fillShiftnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('ShiftsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Shifts');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditShifts = createAsyncThunk(
    'Shifts/EditShifts',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.SHIFT, data);
            dispatch(fillShiftnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('ShiftsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Shifts');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteShifts = createAsyncThunk(
    'Shifts/DeleteShifts',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.SHIFT}/${data.Uuid}`);
            dispatch(fillShiftnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillShiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ShiftsSlice = createSlice({
    name: 'Shifts',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
        isDeletemodalopen: false,
    },
    reducers: {
        handleSelectedShift: (state, action) => {
            state.selected_record = action.payload;
        },
        fillShiftnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeShiftnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetShifts.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetShifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetShifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetShift.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetShift.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetShift.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddShifts.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddShifts.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddShifts.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditShifts.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditShifts.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditShifts.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteShifts.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteShifts.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteShifts.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    handleSelectedShift,
    fillShiftnotification,
    removeShiftnotification,
    handleDeletemodal
} = ShiftsSlice.actions;

export default ShiftsSlice.reducer;