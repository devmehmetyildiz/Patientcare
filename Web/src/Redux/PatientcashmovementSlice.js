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
        en: 'Patient cash movement added successfully',
        tr: 'Hasta para hareketi Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Patient cash movement updated successfully',
        tr: 'Hasta para hareketi Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Patient cash movement Deleted successfully',
        tr: 'Hasta para hareketi Başarı ile Silindi'
    },
}

export const GetPatientcashmovements = createAsyncThunk(
    'Patientcashmovements/GetPatientcashmovements',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTCASHMOVEMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientcashmovement = createAsyncThunk(
    'Patientcashmovements/GetPatientcashmovement',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTCASHMOVEMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientcashmovements = createAsyncThunk(
    'Patientcashmovements/AddPatientcashmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTCASHMOVEMENT, data);
            dispatch(fillPatientcashmovementnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PatientcashmovementsCreate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && (redirectUrl === 'GoBack' ? history.goBack() : history.push(redirectUrl ? redirectUrl : '/Patientcashmovements'));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientcashmovements = createAsyncThunk(
    'Patientcashmovements/EditPatientcashmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTCASHMOVEMENT, data);
            dispatch(fillPatientcashmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('PatientcashmovementsUpdate')
            closeModal && closeModal()
            history && (redirectUrl === 'GoBack' ? history.goBack() : history.push(redirectUrl ? redirectUrl : '/Patientcashmovements'));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientcashmovements = createAsyncThunk(
    'Patientcashmovements/DeletePatientcashmovements',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTCASHMOVEMENT}/${data.Uuid}`);
            dispatch(fillPatientcashmovementnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientcashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientcashmovementsSlice = createSlice({
    name: 'Patientcashmovements',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedPatientcashmovement: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientcashmovementnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientcashmovementnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientcashmovements.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientcashmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientcashmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientcashmovement.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientcashmovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientcashmovement.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientcashmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatientcashmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatientcashmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientcashmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatientcashmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatientcashmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientcashmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePatientcashmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientcashmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatientcashmovement,
    fillPatientcashmovementnotification,
    removePatientcashmovementnotification,
    handleDeletemodal
} = PatientcashmovementsSlice.actions;

export default PatientcashmovementsSlice.reducer;