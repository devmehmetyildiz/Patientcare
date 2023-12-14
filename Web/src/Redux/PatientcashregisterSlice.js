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
        en: 'Patient cash register added successfully',
        tr: 'Hasta para türü Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Patient cash register updated successfully',
        tr: 'Hasta para türü Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Patient cash register Deleted successfully',
        tr: 'Hasta para türü Başarı ile Silindi'
    },
}

export const GetPatientcashregisters = createAsyncThunk(
    'Patientcashregisters/GetPatientcashregisters',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTCASHREGISTER);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashregisternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientcashregister = createAsyncThunk(
    'Patientcashregisters/GetPatientcashregister',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTCASHREGISTER}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashregisternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientcashregisters = createAsyncThunk(
    'Patientcashregisters/AddPatientcashregisters',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTCASHREGISTER, data);
            dispatch(fillPatientcashregisternotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PatientcashregistersCreate')
            closeModal && closeModal()
            history && (redirectUrl === 'GoBack' ? history.goBack() : history.push(redirectUrl ? redirectUrl : '/Patientcashregisters'));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashregisternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientcashregisters = createAsyncThunk(
    'Patientcashregisters/EditPatientcashregisters',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTCASHREGISTER, data);
            dispatch(fillPatientcashregisternotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('PatientcashregistersUpdate')
            closeModal && closeModal()
            history && (redirectUrl === 'GoBack' ? history.goBack() : history.push(redirectUrl ? redirectUrl : '/Patientcashregisters'));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashregisternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientcashregisters = createAsyncThunk(
    'Patientcashregisters/DeletePatientcashregisters',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTCASHREGISTER}/${data.Uuid}`);
            dispatch(fillPatientcashregisternotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashregisternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientcashregistersSlice = createSlice({
    name: 'Patientcashregisters',
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
        handleSelectedPatientcashregister: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientcashregisternotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientcashregisternotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientcashregisters.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientcashregisters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientcashregisters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientcashregister.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientcashregister.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientcashregister.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientcashregisters.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatientcashregisters.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatientcashregisters.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientcashregisters.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatientcashregisters.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatientcashregisters.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientcashregisters.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatientcashregisters.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientcashregisters.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatientcashregister,
    fillPatientcashregisternotification,
    removePatientcashregisternotification,
    handleDeletemodal
} = PatientcashregistersSlice.actions;

export default PatientcashregistersSlice.reducer;