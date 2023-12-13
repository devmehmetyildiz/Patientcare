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
        en: 'Record type added successfully',
        tr: 'Kayıt türü Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Record type updated successfully',
        tr: 'Kayıt türü Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Record type Deleted successfully',
        tr: 'Kayıt türü Başarı ile Silindi'
    },
}

export const GetLogs = createAsyncThunk(
    'ReportsSlice/GetLogs',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Log, `${ROUTES.LOG}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillReportnotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const ReportsSlice = createSlice({
    name: 'Reports',
    initialState: {
        errMsg: null,
        notifications: [],
        logs: [],
        isLoading: false,
        isDispatching: false,
    },
    reducers: {
        fillReportnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeReportnotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetLogs.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.logs = [];
            })
            .addCase(GetLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = action.payload;
            })
            .addCase(GetLogs.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
    }
});

export const {
    fillReportnotification,
    removeReportnotification
} = ReportsSlice.actions;

export default ReportsSlice.reducer;