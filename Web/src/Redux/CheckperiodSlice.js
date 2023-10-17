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
        en: 'Check period added successfully',
        tr: 'Kontrol Grubu Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Check period updated successfully',
        tr: 'Kontrol Grubu Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Check period Deleted successfully',
        tr: 'Kontrol Grubu Başarı ile Silindi'
    },
}

export const GetCheckperiods = createAsyncThunk(
    'Checkperiods/GetCheckperiods',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.CHECKPERIOD);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetCheckperiod = createAsyncThunk(
    'Checkperiods/GetCheckperiod',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.CHECKPERIOD}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddCheckperiods = createAsyncThunk(
    'Checkperiods/AddCheckperiods',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.CHECKPERIOD, data);
            dispatch(fillCheckperiodnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillCheckperiodnotification({
                type: 'Clear',
                code: 'CheckperiodsCreate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Checkperiods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordCheckperiods = createAsyncThunk(
    'Checkperiods/AddRecordCheckperiods',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.CHECKPERIOD + '/AddRecord', data);
            dispatch(fillCheckperiodnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Checkperiods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditCheckperiods = createAsyncThunk(
    'Checkperiods/EditCheckperiods',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.CHECKPERIOD, data);
            dispatch(fillCheckperiodnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillCheckperiodnotification({
                type: 'Clear',
                code: 'CheckperiodsUpdate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Checkperiods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteCheckperiods = createAsyncThunk(
    'Checkperiods/DeleteCheckperiods',
    async ({ data }, { dispatch, getState }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.CHECKPERIOD}/${data.Uuid}`);
            dispatch(fillCheckperiodnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CheckperiodsSlice = createSlice({
    name: 'Checkperiods',
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
        handleSelectedCheckperiod: (state, action) => {
            state.selected_record = action.payload;
        },
        fillCheckperiodnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeCheckperiodnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCheckperiods.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetCheckperiods.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetCheckperiods.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetCheckperiod.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetCheckperiod.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetCheckperiod.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddCheckperiods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddCheckperiods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddCheckperiods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordCheckperiods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordCheckperiods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordCheckperiods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditCheckperiods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditCheckperiods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditCheckperiods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteCheckperiods.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteCheckperiods.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteCheckperiods.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedCheckperiod,
    fillCheckperiodnotification,
    removeCheckperiodnotification,
    handleDeletemodal
} = CheckperiodsSlice.actions;

export default CheckperiodsSlice.reducer;