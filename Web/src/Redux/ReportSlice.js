import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

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

export const GetLogsByQuerry = createAsyncThunk(
    'ReportsSlice/GetLogsByQuerry',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Log, `${ROUTES.LOG}/GetByQuerry`, data);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillReportnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUsagecountbyUserMontly = createAsyncThunk(
    'ReportsSlice/GetUsagecountbyUserMontly',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Log, `${ROUTES.LOG}/GetUsagecountbyUserMontly`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillReportnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetProcessCount = createAsyncThunk(
    'ReportsSlice/GetProcessCount',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Log, `${ROUTES.LOG}/GetProcessCount`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillReportnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetServiceUsageCount = createAsyncThunk(
    'ReportsSlice/GetServiceUsageCount',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Log, `${ROUTES.LOG}/GetServiceUsageCount`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillReportnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetServiceUsageCountDaily = createAsyncThunk(
    'ReportsSlice/GetServiceUsageCountDaily',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Log, `${ROUTES.LOG}/GetServiceUsageCountDaily`);
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
        serviceUsageCount: [],
        serviceUsageCountDaily: [],
        usagecountbyUserMontly: [],
        processCount: [],
        isServiceUsageCountLoading: false,
        isServiceUsageCountDailyLoading: false,
        isUsagecountbyUserMontlyLoading: false,
        isProcessCountLoading: false,
        isLoading: false,
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
            .addCase(GetLogsByQuerry.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.logs = [];
            })
            .addCase(GetLogsByQuerry.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = action.payload;
            })
            .addCase(GetLogsByQuerry.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })

            .addCase(GetUsagecountbyUserMontly.pending, (state) => {
                state.isUsagecountbyUserMontlyLoading = true;
                state.errMsg = null;
                state.usagecountbyUserMontly = [];
            })
            .addCase(GetUsagecountbyUserMontly.fulfilled, (state, action) => {
                state.isUsagecountbyUserMontlyLoading = false;
                state.usagecountbyUserMontly = action.payload;
            })
            .addCase(GetUsagecountbyUserMontly.rejected, (state, action) => {
                state.isUsagecountbyUserMontlyLoading = false;
                state.errMsg = action.error.message;
            })

            .addCase(GetProcessCount.pending, (state) => {
                state.isProcessCountLoading = true;
                state.errMsg = null;
                state.processCount = [];
            })
            .addCase(GetProcessCount.fulfilled, (state, action) => {
                state.isProcessCountLoading = false;
                state.processCount = action.payload;
            })
            .addCase(GetProcessCount.rejected, (state, action) => {
                state.isProcessCountLoading = false;
                state.errMsg = action.error.message;
            })

            .addCase(GetServiceUsageCount.pending, (state) => {
                state.isServiceUsageCountLoading = true;
                state.errMsg = null;
                state.serviceUsageCount = [];
            })
            .addCase(GetServiceUsageCount.fulfilled, (state, action) => {
                state.isServiceUsageCountLoading = false;
                state.serviceUsageCount = action.payload;
            })
            .addCase(GetServiceUsageCount.rejected, (state, action) => {
                state.isServiceUsageCountLoading = false;
                state.errMsg = action.error.message;
            })

            .addCase(GetServiceUsageCountDaily.pending, (state) => {
                state.isServiceUsageCountDailyLoading = true;
                state.errMsg = null;
                state.serviceUsageCountDaily = [];
            })
            .addCase(GetServiceUsageCountDaily.fulfilled, (state, action) => {
                state.isServiceUsageCountDailyLoading = false;
                state.serviceUsageCountDaily = action.payload;
            })
            .addCase(GetServiceUsageCountDaily.rejected, (state, action) => {
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