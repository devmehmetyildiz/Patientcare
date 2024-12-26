import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FileuploadPrepare } from "../Components/Fileupload";
import config from "../Config";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper";
import { ROUTES } from "../Utils/Constants";
import instanse from './axios';

export const GetPatients = createAsyncThunk(
    'Patients/GetPatients',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PATIENT);
            return response?.data?.list || [];
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
            return response?.data?.list || [];
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

export const GetPatientByPlace = createAsyncThunk(
    'Patients/GetPatientByPlace',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Business, ROUTES.PATIENT + '/GetPatientByPlace', data);
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
    async ({ data, history, files, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.PATIENT, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patients.Messages.Add'),
            }));
            clearForm && clearForm('PatientsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patients');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillPatientnotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientsRollCall = createAsyncThunk(
    'Patients/GetPatientsRollCall',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Business, `${ROUTES.PATIENT}/GetPatientRollCall`, data);
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatienteventmovements = createAsyncThunk(
    'Patients/AddPatienteventmovements',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, `${ROUTES.PATIENT}/AddPatienteventmovement`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Patients.Messages.Addeventmovements'),
            }));
            onSuccess && onSuccess()
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatients = createAsyncThunk(
    'Patients/EditPatients',
    async ({ data, files, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Update'),
            }));
            clearForm && clearForm('PatientsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patients');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillPatientnotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientdates = createAsyncThunk(
    'Patients/EditPatientdates',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        console.log('data: ', data);
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            await instanse.put(config.services.Business, ROUTES.PATIENT + '/UpdatePatientDates', data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Update'),
            }));
            clearForm && clearForm('PatientsUpdate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Patients');
            return null
        } catch (error) {
            console.log('error: ', error);
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientmovements = createAsyncThunk(
    'Patients/EditPatientmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            await instanse.put(config.services.Business, ROUTES.PATIENT + '/UpdatePatientmovements', data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Updatemovements'),
            }));
            clearForm && clearForm('PatientsUpdate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Patients');
            return null
        } catch (error) {
            console.log('error: ', error);
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatienteventmovements = createAsyncThunk(
    'Patients/EditPatienteventmovements',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            await instanse.put(config.services.Business, ROUTES.PATIENT + '/UpdatePatienteventmovements', data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Updateeventmovements'),
            }));
            onSuccess && onSuccess()
            return null
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
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENT}/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Patients.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CheckPatients = createAsyncThunk(
    'Patients/CheckPatients',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/Check`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Check'),
                description: t('Redux.Patients.Messages.Check'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CancelCheckPatients = createAsyncThunk(
    'Patients/CancelCheckPatients',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/CancelCheck`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Check'),
                description: t('Redux.Patients.Messages.CancelCheck'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePatients = createAsyncThunk(
    'Patients/ApprovePatients',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/Approve`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Approve'),
                description: t('Redux.Patients.Messages.Approve'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CancelApprovePatients = createAsyncThunk(
    'Patients/CancelApprovePatients',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/CancelApprove`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Approve'),
                description: t('Redux.Patients.Messages.CancelApprove'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompletePatients = createAsyncThunk(
    'Patients/CompletePatients',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/Complete`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Complete'),
                description: t('Redux.Patients.Messages.Complete'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const RemovePatients = createAsyncThunk(
    'Patients/RemovePatients',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/PatientsRemove`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Remove'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);
export const MakeactivePatients = createAsyncThunk(
    'Patients/MakeactivePatients',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/PatientsMakeactive`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Makeactive'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeadPatients = createAsyncThunk(
    'Patients/DeadPatients',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.PATIENT}/PatientsDead`, data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Dead'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientmovements = createAsyncThunk(
    'Patients/DeletePatientmovements',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENT}/DeletePatientmovement/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Patients.Messages.Deletemovement'),
            }));
            onSuccess && onSuccess()
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatienteventmovements = createAsyncThunk(
    'Patients/DeletePatienteventmovements',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENT}/DeletePatienteventmovement/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Patients.Messages.Deleteeventmovement'),
            }));
            onSuccess && onSuccess()
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePreregisrations = createAsyncThunk(
    'Patients/DeletePreregisrations',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENT}/DeletePreregisrations/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Patients.Messages.Delete'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatient = createAsyncThunk(
    'Patients/DeletePatient',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.PATIENT}/DeletePatient/${data.Uuid}`);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Patients.Messages.Delete'),
            }));
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
    async ({ data, history, redirectUrl, redirectID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatientcase", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Update'),
            }));
            history && history.push(redirectUrl ? redirectUrl : (redirectID ? '../' + redirectID : '/Patients'));
            onSuccess && onSuccess()
            return null;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const Editpatientplace = createAsyncThunk(
    'Patients/Editpatientplace',
    async ({ data, history, redirectUrl, closeModal, clearForm, redirectID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatientplace", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Update'),
            }));
            history && history.push(redirectUrl ? redirectUrl : (redirectID ? '../' + redirectID : '/Patients'));
            onSuccess && onSuccess()
            return null;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const Editpatientscase = createAsyncThunk(
    'Patients/Editpatientscase',
    async ({ data, history, redirectUrl, closeModal, clearForm, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatientscase", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Update'),
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
    async ({ data, history, redirectUrl, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/TransferPatientplace", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Update'),
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
    async ({ data, history, redirectUrl, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatienttododefines", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Update'),
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
    async ({ data, history, redirectUrl, redirectID }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.PATIENT + "/UpdatePatientsupportplans", data);
            dispatch(fillPatientnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Patients.Messages.Update'),
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


export const PatientsSlice = createSlice({
    name: 'Patients',
    initialState: {
        list: [],
        patientRollCallList: [],
        listsearch: [],
        patientByPlace: {},
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isPatientRollCallListLoading: false,
        isPatientByPlaceLoading: false,
        isLoadingsearch: false,
        selected_patient: {},
        isDetailmodalopen: false,
        isDeletemodalopen: false,
        isCheckmodalopen: false,
        isApprovemodalopen: false,
        isCompletemodalopen: false,
        isCheckdeactive: false,
        isApprovedeactive: false,
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
        handleCheckmodal: (state, action) => {
            const { modal, deactive } = action.payload
            state.isCheckmodalopen = modal ? modal : action.payload
            state.isCheckdeactive = deactive ? deactive : false
        },
        handleApprovemodal: (state, action) => {
            const { modal, deactive } = action.payload
            state.isApprovemodalopen = modal ? modal : action.payload
            state.isApprovedeactive = deactive ? deactive : false
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
        handleDetailmodal: (state, action) => {
            state.isDetailmodalopen = action.payload
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
            .addCase(GetPatientByPlace.pending, (state) => {
                state.isPatientByPlaceLoading = true;
                state.errMsg = null;
                state.patientByPlace = {};
            })
            .addCase(GetPatientByPlace.fulfilled, (state, action) => {
                state.isPatientByPlaceLoading = false;
                state.patientByPlace = action.payload;
            })
            .addCase(GetPatientByPlace.rejected, (state, action) => {
                state.isPatientByPlaceLoading = false;
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
            .addCase(EditPatientdates.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatientdates.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(EditPatientdates.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatientmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatientmovements.fulfilled, (state,) => {
                state.isLoading = false;
            })
            .addCase(EditPatientmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatienteventmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPatienteventmovements.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(EditPatienteventmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatienteventmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPatienteventmovements.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(AddPatienteventmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CheckPatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CheckPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CheckPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CancelCheckPatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CancelCheckPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CancelCheckPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovePatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovePatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovePatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompletePatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompletePatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(RemovePatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(RemovePatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(RemovePatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(MakeactivePatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(MakeactivePatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(MakeactivePatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeadPatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeadPatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeadPatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePreregisrations.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePreregisrations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePreregisrations.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePatientmovements.fulfilled, (state,) => {
                state.isLoading = false;
            })
            .addCase(DeletePatientmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatienteventmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePatienteventmovements.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(DeletePatienteventmovements.rejected, (state, action) => {
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
            .addCase(CancelApprovePatients.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CancelApprovePatients.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CancelApprovePatients.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(Editpatientcase.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(Editpatientcase.fulfilled, (state,) => {
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
            })
            .addCase(Editpatientplace.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(Editpatientscase.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(Editpatientscase.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(Editpatientscase.rejected, (state, action) => {
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
            .addCase(UpdatePatienttododefines.fulfilled, (state,) => {
                state.isLoading = false;
            })
            .addCase(UpdatePatienttododefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(UpdatePatientsupportplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(UpdatePatientsupportplans.fulfilled, (state,) => {
                state.isLoading = false;
            })
            .addCase(UpdatePatientsupportplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientsRollCall.pending, (state) => {
                state.isPatientRollCallListLoading = true;
                state.patientRollCallList = [];
            })
            .addCase(GetPatientsRollCall.fulfilled, (state, action) => {
                state.isPatientRollCallListLoading = false;
                state.patientRollCallList = action.payload;
            })
            .addCase(GetPatientsRollCall.rejected, (state, action) => {
                state.isPatientRollCallListLoading = false;
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
    handleApprovemodal,
    handleCheckmodal,
    handleCompletemodal,
    handleDetailmodal
} = PatientsSlice.actions;

export default PatientsSlice.reducer;