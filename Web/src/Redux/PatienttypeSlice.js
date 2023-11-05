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
        en: 'Patient type added successfully',
        tr: 'Hasta Türü Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Patient type updated successfully',
        tr: 'Hasta Türü Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Patient type Deleted successfully',
        tr: 'Hasta Türü Başarı ile Silindi'
    },
}

export const GetPatienttypes = createAsyncThunk(
    'Patienttypes/GetPatienttypes',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.PATIENTTYPE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienttypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatienttype = createAsyncThunk(
    'Patienttypes/GetPatienttype',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.PATIENTTYPE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienttypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatienttypes = createAsyncThunk(
    'Patienttypes/AddPatienttypes',
    async ({ data, history, redirectUrl, closeModal }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.PATIENTTYPE, data);
            dispatch(fillPatienttypenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillPatienttypenotification({
                type: 'Clear',
                code: 'PatienttypesCreate',
                description: '',
            }));
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patienttypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienttypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordPatienttypes = createAsyncThunk(
    'Patienttypes/AddRecordPatienttypes',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.PATIENTTYPE + '/AddRecord', data);
            dispatch(fillPatienttypenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Patienttypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienttypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatienttypes = createAsyncThunk(
    'Patienttypes/EditPatienttypes',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.PATIENTTYPE, data);
            dispatch(fillPatienttypenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillPatienttypenotification({
                type: 'Clear',
                code: 'PatienttypesUpdate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Patienttypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienttypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatienttypes = createAsyncThunk(
    'Patienttypes/DeletePatienttypes',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.PATIENTTYPE}/${data.Uuid}`);
            dispatch(fillPatienttypenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatienttypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatienttypesSlice = createSlice({
    name: 'Patienttypes',
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
        handleSelectedPatienttype: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatienttypenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatienttypenotification: (state) => {
          state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatienttypes.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatienttypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatienttypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatienttype.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatienttype.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatienttype.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatienttypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatienttypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatienttypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordPatienttypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordPatienttypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordPatienttypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPatienttypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPatienttypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPatienttypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatienttypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatienttypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatienttypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatienttype,
    fillPatienttypenotification,
    removePatienttypenotification,
    handleDeletemodal
} = PatienttypesSlice.actions;

export default PatienttypesSlice.reducer;