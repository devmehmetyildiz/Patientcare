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
        en: 'Patient Movement added successfully',
        tr: 'Hasta Hareketi Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Patient Movement updated successfully',
        tr: 'Hasta Hareketi Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Patient Movement Deleted successfully',
        tr: 'Hasta Hareketi Başarı ile Silindi'
    },
}

export const GetPatientmovements = createAsyncThunk(
    'Patientmovements/GetPatientmovements',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTMOVEMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientmovement = createAsyncThunk(
    'Patientmovements/GetPatientmovement',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTMOVEMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientmovements = createAsyncThunk(
    'Patientmovements/AddPatientmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTMOVEMENT, data);
            dispatch(fillPatientmovementnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PatientmovementsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patientmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientmovements = createAsyncThunk(
    'Patientmovements/EditPatientmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm}, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTMOVEMENT, data);
            dispatch(fillPatientmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('PatientmovementsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patientmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientmovements = createAsyncThunk(
    'Patientmovements/DeletePatientmovements',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTMOVEMENT}/${data.Uuid}`);
            dispatch(fillPatientmovementnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientmovementsSlice = createSlice({
    name: 'Patientmovements',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedPatientmovement: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientmovementnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientmovementnotification: (state) => {
          state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientmovements.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientmovement.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientmovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientmovement.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatientmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatientmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatientmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatientmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePatientmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatientmovement,
    fillPatientmovementnotification,
    removePatientmovementnotification,
    handleDeletemodal
} = PatientmovementsSlice.actions;

export default PatientmovementsSlice.reducer;