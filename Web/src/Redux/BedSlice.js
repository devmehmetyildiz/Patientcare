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
        en: 'Bed added successfully',
        tr: 'Yatak Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Bed updated successfully',
        tr: 'Yatak Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Bed Deleted successfully',
        tr: 'Yatak Başarı ile Silindi'
    },
}

export const GetBeds = createAsyncThunk(
    'Beds/GetBeds',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.BED);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBednotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetBed = createAsyncThunk(
    'Beds/GetBed',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.BED}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBednotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddBeds = createAsyncThunk(
    'Beds/AddBeds',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.BED, data);
            dispatch(fillBednotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('BedsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Beds');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBednotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordBeds = createAsyncThunk(
    'Beds/AddRecordBeds',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.BED + '/AddRecord', data);
            dispatch(fillBednotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('BedsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Beds');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBednotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditBeds = createAsyncThunk(
    'Beds/EditBeds',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.BED, data);
            dispatch(fillBednotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            closeModal && closeModal()
            clearForm && clearForm('BedsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Beds');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBednotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteBeds = createAsyncThunk(
    'Beds/DeleteBeds',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.BED}/${data.Uuid}`);
            dispatch(fillBednotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBednotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const BedsSlice = createSlice({
    name: 'Beds',
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
        handleSelectedBed: (state, action) => {
            state.selected_record = action.payload;
        },
        fillBednotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeBednotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetBeds.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetBeds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetBeds.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetBed.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetBed.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetBed.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddBeds.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddBeds.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddBeds.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordBeds.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordBeds.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordBeds.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditBeds.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditBeds.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditBeds.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteBeds.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteBeds.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteBeds.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedBed,
    fillBednotification,
    removeBednotification,
    handleDeletemodal
} = BedsSlice.actions;

export default BedsSlice.reducer;