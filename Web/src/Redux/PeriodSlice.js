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
        en: 'Periods added successfully',
        tr: 'Periyot Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Periods updated successfully',
        tr: 'Periyot Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Periods Deleted successfully',
        tr: 'Periyot Başarı ile Silindi'
    },
}

export const GetPeriods = createAsyncThunk(
    'Periods/GetPeriods',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.PERIOD);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPeriodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPeriod = createAsyncThunk(
    'Periods/GetPeriod',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.PERIOD}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPeriodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPeriods = createAsyncThunk(
    'Periods/AddPeriods',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.PERIOD, data);
            dispatch(fillPeriodnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('PeriodsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Periods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPeriodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordPeriods = createAsyncThunk(
    'Periods/AddRecordPeriods',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.PERIOD + '/AddRecord', data);
            dispatch(fillPeriodnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('PeriodsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Periods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPeriodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPeriods = createAsyncThunk(
    'Periods/EditPeriods',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.PERIOD, data);
            dispatch(fillPeriodnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('PeriodsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Periods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPeriodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePeriods = createAsyncThunk(
    'Periods/DeletePeriods',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.PERIOD}/${data.Uuid}`);
            dispatch(fillPeriodnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPeriodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PeriodsSlice = createSlice({
    name: 'Periods',
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
        handleSelectedPeriod: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPeriodnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePeriodnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPeriods.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPeriods.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPeriods.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPeriod.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPeriod.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPeriod.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPeriods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPeriods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPeriods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordPeriods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordPeriods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordPeriods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPeriods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPeriods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPeriods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePeriods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePeriods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePeriods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPeriod,
    fillPeriodnotification,
    removePeriodnotification,
    handleDeletemodal
} = PeriodsSlice.actions;

export default PeriodsSlice.reducer;