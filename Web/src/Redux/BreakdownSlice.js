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
        en: 'Breakdown added successfully',
        tr: 'Arıza Talebi Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Breakdown updated successfully',
        tr: 'Arıza Talebi Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Breakdown Deleted successfully',
        tr: 'Arıza Talebi Başarı ile Silindi'
    },
}

export const GetBreakdowns = createAsyncThunk(
    'Breakdowns/GetBreakdowns',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.BREAKDOWN);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetBreakdown = createAsyncThunk(
    'Breakdowns/GetBreakdown',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.BREAKDOWN}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddBreakdowns = createAsyncThunk(
    'Breakdowns/AddBreakdowns',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.BREAKDOWN, data);
            dispatch(fillBreakdownnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('BreakdownsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Breakdowns');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditBreakdowns = createAsyncThunk(
    'Breakdowns/EditBreakdowns',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.BREAKDOWN, data);
            dispatch(fillBreakdownnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('BreakdownsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Breakdowns');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteBreakdowns = createAsyncThunk(
    'Breakdowns/CompleteBreakdowns',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.BREAKDOWN + '/Complete', data);
            dispatch(fillBreakdownnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteBreakdowns = createAsyncThunk(
    'Breakdowns/DeleteBreakdowns',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.BREAKDOWN}/${data.Uuid}`);
            dispatch(fillBreakdownnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillBreakdownnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const BreakdownsSlice = createSlice({
    name: 'Breakdowns',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
        isDeletemodalopen: false,
        isCompletemodalopen: false,
    },
    reducers: {
        handleSelectedBreakdown: (state, action) => {
            state.selected_record = action.payload;
        },
        fillBreakdownnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeBreakdownnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetBreakdowns.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetBreakdowns.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetBreakdowns.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetBreakdown.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetBreakdown.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetBreakdown.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddBreakdowns.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddBreakdowns.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddBreakdowns.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditBreakdowns.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditBreakdowns.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditBreakdowns.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteBreakdowns.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(CompleteBreakdowns.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(CompleteBreakdowns.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteBreakdowns.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteBreakdowns.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteBreakdowns.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedBreakdown,
    fillBreakdownnotification,
    removeBreakdownnotification,
    handleDeletemodal,
    handleCompletemodal
} = BreakdownsSlice.actions;

export default BreakdownsSlice.reducer;