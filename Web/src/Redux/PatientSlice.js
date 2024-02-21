import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import Cookies from 'universal-cookie';
import config from "../Config";
import axios from 'axios'
import validator from '../Utils/Validator';

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescriptionpatientfull: {
        en: 'Patient added successfully, Files will Add',
        tr: 'Hasta Başarı ile eklendi, Dosyalar Eklenecek'
    },
    adddescriptionfilefull: {
        en: 'Patient files added successfully, Stocks will Add',
        tr: 'Hasta dosyaları Başarı ile eklendi, Stoklar Eklenecek'
    },
    adddescriptionstocksfull: {
        en: 'Patient Stocks added successfully, Patient will Enter to Facility',
        tr: 'Hasta Stokları Başarı ile eklendi, Hasta Kuruma Alınacak'
    },
    adddescriptioncompletefull: {
        en: 'Patient Entered Facility',
        tr: 'Hasta Kuruma Alındı'
    },
    addpatienterror: {
        en: 'Ekleme Sırasında hasta Id değeri gelmedi',
        tr: 'Ekleme Sırasında hasta Id değeri gelmedi'
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

export const GetPatientforsearch = createAsyncThunk(
    'Patients/GetPatientforsearch',
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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PATIENT, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PatientsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patients');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientReturnPatient = createAsyncThunk(
    'Patients/AddPatientReturnPatient',
    async ({ Patientdata, files, stocks, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const createdpatientresponse = await instanse.post(config.services.Business, ROUTES.PATIENT + '/AddPatientReturnPatient', Patientdata);
            const createdpatient = createdpatientresponse.data
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescriptionpatientfull[Language],
            }));

            if (validator.isUUID(createdpatient?.Uuid)) {
                if ((files || []).length > 0) {
                    const formData = new FormData();
                    const newFiles = (files || []).map(u => {
                        return { ...u, ParentID: createdpatient?.Uuid }
                    })
                    newFiles.forEach((data, index) => {
                        Object.keys(data).forEach(element => {
                            formData.append(`list[${index}].${element}`, data[element])
                        });
                    })

                    const localcookies = new Cookies();
                    await axios({
                        method: `put`,
                        url: config.services.File + `${ROUTES.FILE}`,
                        headers: { Authorization: "Bearer  " + localcookies.get('patientcare'), contentType: 'mime/form-data' },
                        data: formData
                    })
                    dispatch(fillPatientnotification({
                        type: 'Success',
                        code: Literals.addcode[Language],
                        description: Literals.adddescriptionfilefull[Language],
                    }));
                }
                if ((stocks || []).length > 0) {
                    const newStocks = (stocks || []).map(u => {
                        return { ...u, PatientID: createdpatient?.Uuid }
                    })
                    await instanse.put(config.services.Business, ROUTES.PATIENT + "/Preregistrations/Editpatientstocks", newStocks);
                    dispatch(fillPatientnotification({
                        type: 'Success',
                        code: Literals.addcode[Language],
                        description: Literals.adddescriptionstocksfull[Language],
                    }));
                }
                const completebody = {
                    ...createdpatient,
                    WarehouseID: Patientdata.WarehouseID,
                    RoomID: Patientdata.RoomID,
                    FloorID: Patientdata.FloorID,
                    BedID: Patientdata.BedID,
                    Iswilltransfer: Patientdata.Iswilltransfer
                }
                const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/Preregistrations/Complete", completebody);
                dispatch(fillPatientnotification({
                    type: 'Success',
                    code: Literals.addcode[Language],
                    description: Literals.adddescriptioncompletefull[Language],
                }));
                clearForm && clearForm('PatientsCreate')
                closeModal && closeModal()
                history && history.push(redirectUrl ? redirectUrl : '/Patients');
                return response.data;
            } else {
                dispatch(fillPatientnotification({
                    type: 'Error',
                    code: Literals.addcode[Language],
                    description: Literals.addpatienterror[Language],
                }));
            }
            return [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatients = createAsyncThunk(
    'Patients/EditPatients',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PatientsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patients');
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
    async ({ data, history, redirectUrl, closeModal, clearForm, redirectID }, { dispatch, getState }) => {
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

export const Editpatientplace = createAsyncThunk(
    'Patients/Editpatientplace',
    async ({ data, history, redirectUrl, closeModal, clearForm, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatientplace", data);
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
export const Transferpatientplace = createAsyncThunk(
    'Patients/Transferpatientplace',
    async ({ data, history, redirectUrl, closeModal, clearForm, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/TransferPatientplace", data);
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
export const UpdatePatienttododefines = createAsyncThunk(
    'Patients/UpdatePatienttododefines',
    async ({ data, history, redirectUrl, closeModal, clearForm, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatienttododefines", data);
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
export const UpdatePatientsupportplans = createAsyncThunk(
    'Patients/UpdatePatientsupportplans',
    async ({ data, history, redirectUrl, closeModal, clearForm, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatientsupportplans", data);
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
    async ({ data, history, redirectUrl, closeModal, clearForm, }, { dispatch, getState }) => {
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
            history && history.push(redirectUrl ? redirectUrl : '/Patients')
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
    async ({ data, history, redirectUrl, closeModal, clearForm, }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/Preregistrations/Complete", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.completedescription[Language],
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Patients')
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
        listsearch: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isLoadingsearch: false,
        isDispatching: false,
        isCheckperiodloading: false,
        isTodogroupdefineloading: false,
        selected_patient: {},
        isDeletemodalopen: false,
        isCompletemodalopen: false,
        isOutmodalopen: false,
        isInmodalopen: false,
        isPlacemodalopen: false,
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
        handlePlacemodal: (state, action) => {
            state.isPlacemodalopen = action.payload
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
            .addCase(GetPatientforsearch.pending, (state) => {
                state.isLoadingsearch = true;
                state.errMsg = null;
                state.listsearch = [];
            })
            .addCase(GetPatientforsearch.fulfilled, (state, action) => {
                state.isLoadingsearch = false;
                state.listsearch = action.payload;
            })
            .addCase(GetPatientforsearch.rejected, (state, action) => {
                state.isLoadingsearch = false;
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
                state.isLoading = true;
            })
            .addCase(AddPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientReturnPatient.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatientReturnPatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPatientReturnPatient.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePrepatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompletePrepatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompletePrepatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientstocks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatientstocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPatientstocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(OutPatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(OutPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(OutPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(InPatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(InPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(InPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(Editpatientcase.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(Editpatientcase.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(Editpatientcase.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(Editpatientplace.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(Editpatientplace.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload
            })
            .addCase(Editpatientplace.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(Transferpatientplace.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(Transferpatientplace.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload
            })
            .addCase(Transferpatientplace.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(UpdatePatienttododefines.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(UpdatePatienttododefines.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(UpdatePatienttododefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(UpdatePatientsupportplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(UpdatePatientsupportplans.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(UpdatePatientsupportplans.rejected, (state, action) => {
                state.isLoading = false;
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
    handleOutmodal,
    handlePlacemodal
} = PatientsSlice.actions;

export default PatientsSlice.reducer;