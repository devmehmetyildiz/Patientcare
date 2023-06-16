import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetCheckperiods = createAsyncThunk(
    'checkperiods/GetCheckperiods',
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
    'checkperiods/GetCheckperiod',
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
    'checkperiods/AddCheckperiods',
    async ({data, history}, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.CHECKPERIOD, data);
            dispatch(fillCheckperiodnotification({
                type: 'Success',
                code: 'Kontrol Grupları',
                description: 'Kontrol grubu başarı ile Eklendi',
            }));
            history.push('/Checkperiods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditCheckperiods = createAsyncThunk(
    'checkperiods/EditCheckperiods',
    async ({data, history}, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.CHECKPERIOD, data);
            dispatch(fillCheckperiodnotification({
                type: 'Success',
                code: 'Kontrol Grupları',
                description: 'Kontrol grubu başarı ile Güncellendi',
            }));
            history.push('/Checkperiods');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteCheckperiods = createAsyncThunk(
    'checkperiods/DeleteCheckperiods',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.CHECKPERIOD}/${data.Uuid}`);
            dispatch(fillCheckperiodnotification({
                type: 'Success',
                code: 'Kontrol Grupları',
                description: 'Kontrol grubu başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCheckperiodnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const checkperiodsSlice = createSlice({
    name: 'checkperiods',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedCheckperiod: (state) => {
            state.selected_record = {};
        },
        fillCheckperiodnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeCheckperiodnotification: (state) => {
            state.notifications.splice(0, 1);
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
    RemoveSelectedCheckperiod,
    fillCheckperiodnotification,
    removeCheckperiodnotification,
} = checkperiodsSlice.actions;

export default checkperiodsSlice.reducer;