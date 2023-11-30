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
        en: 'Personel Shift added successfully',
        tr: 'Personel Vardiyası Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Personel Shift updated successfully',
        tr: 'Vardiya Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Personel Shift Deleted successfully',
        tr: 'Personel Vardiyası Başarı ile Silindi'
    },
}


export const GetPersonelshifts = createAsyncThunk(
    'Personelshifts/GetPersonelshifts',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.SHIFT}/GetShiftrequests`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPersonelshift = createAsyncThunk(
    'Personelshifts/GetPersonelshift',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.SHIFT}/GetPersonelshifts/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPersonelshifts = createAsyncThunk(
    'Personelshifts/AddPersonelshifts',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.SHIFT + '/Addshiftperiod', data);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PerosnelshiftsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Personelshifts');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePersonelshifts = createAsyncThunk(
    'Personelshifts/DeletePersonelshifts',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.SHIFT}/DeleteShiftrequest/${data.Uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const PerosnelshiftsSlice = createSlice({
    name: 'Perosnelshifts',
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
        handleSelectedPersonelshift: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPersonelshiftnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePersonelshiftnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPersonelshifts.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPersonelshift.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPersonelshift.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPersonelshift.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPersonelshifts.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPersonelshifts.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPersonelshifts.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePersonelshifts.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePersonelshifts.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePersonelshifts.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    handleSelectedPersonelshift,
    fillPersonelshiftnotification,
    removePersonelshiftnotification,
    handleDeletemodal
} = PerosnelshiftsSlice.actions;

export default PerosnelshiftsSlice.reducer;