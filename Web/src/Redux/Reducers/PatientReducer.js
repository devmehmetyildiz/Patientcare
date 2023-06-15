import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "../Actions/axios";
import config from "../../Config";

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
    'Patients/GetPatient',
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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Business, ROUTES.PATIENT, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Patients');
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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Patients');
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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/Preregistrations/Editpatientstocks", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Patients');
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
    async ({ data, history, url }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/Preregistrations/Complete", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push(url ? url : '/Patients')
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
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENT}/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
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
        selected_patient: {}
    },
    reducers: {
        RemoveSelectedPatient: (state) => {
            state.selected_record = {};
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
        }
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
            });
    },
});

export const {
    RemoveSelectedPatient,
    fillPatientnotification,
    removePatientnotification,
    setPatient
} = PatientsSlice.actions;

export default PatientsSlice.reducer;