import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.PATIENTTYPE, data);
            dispatch(fillPatienttypenotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'Hasta türü başarı ile Eklendi',
            }));
            history.push('/Patienttypes');
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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.PATIENTTYPE, data);
            dispatch(fillPatienttypenotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Hasta türü başarı ile Güncellendi',
            }));
            history.push('/Patienttypes');
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
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.PATIENTTYPE}/${data.Uuid}`);
            dispatch(fillPatienttypenotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'Hasta türü başarı ile Silindi',
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