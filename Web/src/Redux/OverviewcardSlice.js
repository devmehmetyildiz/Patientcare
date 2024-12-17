import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetTrainingCountPersonel = createAsyncThunk(
    'Overviewcards/GetTrainingCountPersonel',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.OVERVIEWCARD}/GetTrainingCountPersonel`, data);
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillOverviewcardnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetTrainingCountPatientcontact = createAsyncThunk(
    'Overviewcards/GetTrainingCountPatientcontact',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.OVERVIEWCARD}/GetTrainingCountPatientcontact`, data);
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillOverviewcardnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPatientvisitcount = createAsyncThunk(
    'Overviewcards/GetPatientvisitcount',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.OVERVIEWCARD}/GetPatientvisitCount`, data);
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillOverviewcardnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUserincidentcount = createAsyncThunk(
    'Overviewcards/GetUserincidentcount',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.OVERVIEWCARD}/GetUserincidentcount`, data);
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillOverviewcardnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUserleftcount = createAsyncThunk(
    'Overviewcards/GetUserLeftCount',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.OVERVIEWCARD}/GetUserLeftCount`, data);
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillOverviewcardnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetCompletedFileCountForPatients = createAsyncThunk(
    'Overviewcards/GetCompletedFileCountForPatients',
    async ({ data }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.OVERVIEWCARD}/GetCompletedFileCountForPatients`, data);
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillOverviewcardnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const OverviewcardsSlice = createSlice({
    name: 'Overviewcards',
    initialState: {
        completedFileCountPatient: [],
        isCompletedFileCountPatientLoading: false,
        userLeftCount: [],
        isuserLeftCountLoading: false,
        userIncidentCount: [],
        isUserIncidentCountLoading: false,
        patientVisitCount: [],
        isPatientVisitCountLoading: false,
        trainingCountPersonel: [],
        isTrainingCountPersonelLoading: false,
        trainingCountPatientcontact: [],
        isTrainingCountPatientcontactLoading: false,
        errMsg: null,
        notifications: [],
    },
    reducers: {
        fillOverviewcardnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeOverviewcardnotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetTrainingCountPersonel.pending, (state) => {
                state.isTrainingCountPersonelLoading = true;
                state.errMsg = null;
                state.trainingCountPersonel = [];
            })
            .addCase(GetTrainingCountPersonel.fulfilled, (state, action) => {
                state.isTrainingCountPersonelLoading = false;
                state.trainingCountPersonel = action.payload;
            })
            .addCase(GetTrainingCountPersonel.rejected, (state, action) => {
                state.isTrainingCountPersonelLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetTrainingCountPatientcontact.pending, (state) => {
                state.isTrainingCountPatientcontactLoading = true;
                state.errMsg = null;
                state.trainingCountPatientcontact = [];
            })
            .addCase(GetTrainingCountPatientcontact.fulfilled, (state, action) => {
                state.isTrainingCountPatientcontactLoading = false;
                state.trainingCountPatientcontact = action.payload;
            })
            .addCase(GetTrainingCountPatientcontact.rejected, (state, action) => {
                state.isTrainingCountPatientcontactLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPatientvisitcount.pending, (state) => {
                state.isPatientVisitCountLoading = true;
                state.errMsg = null;
                state.patientVisitCount = [];
            })
            .addCase(GetPatientvisitcount.fulfilled, (state, action) => {
                state.isPatientVisitCountLoading = false;
                state.patientVisitCount = action.payload;
            })
            .addCase(GetPatientvisitcount.rejected, (state, action) => {
                state.isPatientVisitCountLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUserincidentcount.pending, (state) => {
                state.isUserIncidentCountLoading = true;
                state.errMsg = null;
                state.userIncidentCount = [];
            })
            .addCase(GetUserincidentcount.fulfilled, (state, action) => {
                state.isUserIncidentCountLoading = false;
                state.userIncidentCount = action.payload;
            })
            .addCase(GetUserincidentcount.rejected, (state, action) => {
                state.isUserIncidentCountLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUserleftcount.pending, (state) => {
                state.isuserLeftCountLoading = true;
                state.errMsg = null;
                state.userLeftCount = [];
            })
            .addCase(GetUserleftcount.fulfilled, (state, action) => {
                state.isuserLeftCountLoading = false;
                state.userLeftCount = action.payload;
            })
            .addCase(GetUserleftcount.rejected, (state, action) => {
                state.isuserLeftCountLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetCompletedFileCountForPatients.pending, (state) => {
                state.isCompletedFileCountPatientLoading = true;
                state.errMsg = null;
                state.completedFileCountPatient = [];
            })
            .addCase(GetCompletedFileCountForPatients.fulfilled, (state, action) => {
                state.isCompletedFileCountPatientLoading = false;
                state.completedFileCountPatient = action.payload;
            })
            .addCase(GetCompletedFileCountForPatients.rejected, (state, action) => {
                state.isCompletedFileCountPatientLoading = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    fillOverviewcardnotification,
    removeOverviewcardnotification
} = OverviewcardsSlice.actions;

export default OverviewcardsSlice.reducer;