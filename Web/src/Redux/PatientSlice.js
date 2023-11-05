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
        en: 'Patient added successfully',
        tr: 'Hasta Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Patient updated successfully',
        tr: 'Hasta Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Patient Deleted successfully',
        tr: 'Hasta Başarı ile Silindi'
    },
    completedescription: {
        en: 'Patient Entered Organisation successfully',
        tr: 'Hasta Başarı ile Kuruma Girdi'
    },
    outdescription: {
        en: 'Patient left the Organisation successfully',
        tr: 'Hasta Başarı ile Kurumdan ayrıldı'
    },
    indescription: {
        en: 'Patient Entered Organisation successfully',
        tr: 'Hasta Başarı ile Kuruma Girdi'
    },
}

export const GetPatients = createAsyncThunk(
    'Patients/GetPatients',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatient = createAsyncThunk(
    'Patients/GetPatient',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PATIENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const Getpreregistrations = createAsyncThunk(
    'Patients/Getpreregistrations',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENT + "/Preregistrations");
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatients = createAsyncThunk(
    'Patients/AddPatients',
    async ({ data, history, url, closeModal }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PATIENT, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillPatientnotification({
                type: 'Clear',
                code: 'PatientsCreate',
                description: '',
            }));
            closeModal && closeModal()
            history && history.push(url ? url : '/Patients')
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatients = createAsyncThunk(
    'Patients/EditPatients',
    async ({ data, history, url }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            history && history.push(url ? url : '/Patients')
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const Editpatientcase = createAsyncThunk(
    'Patients/Editpatientcase',
    async ({ data, history, redirectUrl, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatientcase", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            history && history.push(redirectUrl ? redirectUrl : (redirectID ? '../' + redirectID : '/Patients'));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);
export const Editpatienttodogroupdefine = createAsyncThunk(
    'Patients/Editpatienttodogroupdefine',
    async ({ data, history, redirectUrl, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatienttodogroupdefine", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            history && history.push(redirectUrl ? redirectUrl : (redirectID ? '../' + redirectID : '/Patients'));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientstocks = createAsyncThunk(
    'Patients/EditPatientstocks',
    async ({ data, history, url }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/Preregistrations/Editpatientstocks", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillPatientnotification({
                type: 'Clear',
                code: 'PatientsUpdate',
                description: '',
            }));
            history && history.push(url ? url : '/Patients')
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);
export const CompletePrepatients = createAsyncThunk(
    'Patients/CompletePrepatients',
    async ({ data, history, url }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/Preregistrations/Complete", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.completedescription[Language],
            }));
            history && history.push(url ? url : '/Patients')
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatients = createAsyncThunk(
    'Patients/DeletePatients',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENT}/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const OutPatients = createAsyncThunk(
    'Patients/OutPatients',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/OutPatient/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.outdescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);
export const InPatients = createAsyncThunk(
    'Patients/InPatients',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/InPatient/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.indescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientsSlice = createSlice({
    name: 'Patients',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
        isCheckperiodloading: false,
        isTodogroupdefineloading: false,
        selected_patient: {},
        isDeletemodalopen: false,
        isCompletemodalopen: false,
        isOutmodalopen: false,
        isInmodalopen: false,
    },
    reducers: {
        handleSelectedPatient: (state, action) => {
            state.selected_record = action.payload;
        },
        setPatient: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientnotification: (state) => {
          state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
        handleOutmodal: (state, action) => {
            state.isOutmodalopen = action.payload
        },
        handleInmodal: (state, action) => {
            state.isInmodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatients.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(Getpreregistrations.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(Getpreregistrations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(Getpreregistrations.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatient.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatient.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatients.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatients.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatients.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatients.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatients.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatients.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePrepatients.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(CompletePrepatients.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(CompletePrepatients.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatientstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatientstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatients.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatients.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatients.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(OutPatients.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(OutPatients.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.selected_record = action.payload;
            })
            .addCase(OutPatients.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(InPatients.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(InPatients.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.selected_record = action.payload;
            })
            .addCase(InPatients.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(Editpatientcase.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(Editpatientcase.fulfilled, (state, action) => {
                state.isDispatching = false;
            })
            .addCase(Editpatientcase.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(Editpatienttodogroupdefine.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(Editpatienttodogroupdefine.fulfilled, (state, action) => {
                state.isDispatching = false;
            })
            .addCase(Editpatienttodogroupdefine.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    handleSelectedPatient,
    fillPatientnotification,
    removePatientnotification,
    setPatient,
    handleDeletemodal,
    handleCompletemodal,
    handleInmodal,
    handleOutmodal
} = PatientsSlice.actions;

export default PatientsSlice.reducer;