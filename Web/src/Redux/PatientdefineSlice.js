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
        en: 'Patient Define added successfully',
        tr: 'Hasta Tanımı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Patient Define updated successfully',
        tr: 'Hasta Tanımı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Patient Define Deleted successfully',
        tr: 'Hasta Tanımı Başarı ile Silindi'
    },
}


export const GetPatientdefines = createAsyncThunk(
    'Patientdefines/GetPatientdefines',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENTDEFINE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientdefine = createAsyncThunk(
    'Patientdefines/GetPatientdefine',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENTDEFINE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientdefines = createAsyncThunk(
    'Patientdefines/AddPatientdefines',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTDEFINE, data);
            dispatch(fillPatientdefinenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillPatientdefinenotification({
                type: 'Clear',
                code: 'PatientdefinesCreate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Patientdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordPatientdefines = createAsyncThunk(
    'Patientdefines/AddRecordPatientdefines',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PATIENTDEFINE + '/AddRecord', data);
            dispatch(fillPatientdefinenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Patientdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientdefines = createAsyncThunk(
    'Patientdefines/EditPatientdefines',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENTDEFINE, data);
            dispatch(fillPatientdefinenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillPatientdefinenotification({
                type: 'Clear',
                code: 'PatientdefinesUpdate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Patientdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientdefines = createAsyncThunk(
    'Patientdefines/DeletePatientdefines',
    async (data, { dispatch, getState }) => {
        try {
          
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENTDEFINE}/${data.Uuid}`);
            dispatch(fillPatientdefinenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientdefinesSlice = createSlice({
    name: 'Patientdefines',
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
        handleSelectedPatientdefine: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientdefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientdefinenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientdefines.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientdefine.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientdefine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientdefine.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatientdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatientdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordPatientdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordPatientdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordPatientdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatientdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatientdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatientdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatientdefine,
    fillPatientdefinenotification,
    removePatientdefinenotification,
    handleDeletemodal
} = PatientdefinesSlice.actions;

export default PatientdefinesSlice.reducer;