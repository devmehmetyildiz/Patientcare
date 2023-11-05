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
        en: 'Patient Stock Added successfully',
        tr: 'Hasta Stoğu Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Patient Stock updated successfully',
        tr: 'Hasta Stoğu Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Patient Stock Deleted successfully',
        tr: 'Hasta Stoğu Başarı ile Silindi'
    },
    approvedescription: {
        en: 'Patient Stock Approved Successfully',
        tr: 'Hasta Stoğu Başarı ile Onaylandı'
    },
}

export const GetPatientstocks = createAsyncThunk(
    'Patientstocks/GetPatientstocks',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.PATIENTSTOCK);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientstock = createAsyncThunk(
    'Patientstocks/GetPatientstock',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.PATIENTSTOCK}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPatientstocks = createAsyncThunk(
    'Patientstocks/AddPatientstocks',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.PATIENTSTOCK, data);
            dispatch(fillPatientstocknotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillPatientstocknotification({
                type: 'Clear',
                code: 'PatientstocksCreate',
                description: '',
            }));
            clearForm && clearForm('PatientstocksCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patientstocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPatientstocks = createAsyncThunk(
    'Patientstocks/EditPatientstocks',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.PATIENTSTOCK, data);
            dispatch(fillPatientstocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('PatientstocksUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Patientstocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePatientstocks = createAsyncThunk(
    'Patientstocks/DeletePatientstocks',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.PATIENTSTOCK}/${data.Uuid}`);
            dispatch(fillPatientstocknotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePatientstocks = createAsyncThunk(
    'Patientstocks/ApprovePatientstocks',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.PATIENTSTOCK}/Approve/${data.Uuid}`);
            dispatch(fillPatientstocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPatientstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PatientstocksSlice = createSlice({
    name: 'Patientstocks',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
        isDeletemodalopen: false,
        isApprovemodalopen: false
    },
    reducers: {
        handleSelectedPatientstock: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPatientstocknotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePatientstocknotification: (state) => {
          state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPatientstocks.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPatientstocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPatientstocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientstock.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPatientstock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPatientstock.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPatientstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPatientstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPatientstocks.rejected, (state, action) => {
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
            .addCase(ApprovePatientstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(ApprovePatientstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(ApprovePatientstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePatientstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePatientstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePatientstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPatientstock,
    fillPatientstocknotification,
    removePatientstocknotification,
    handleDeletemodal,
    handleApprovemodal
} = PatientstocksSlice.actions;

export default PatientstocksSlice.reducer;