import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetSurveys = createAsyncThunk(
    'Surveys/GetSurveys',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.SURVEY);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetSurvey = createAsyncThunk(
    'Surveys/GetSurvey',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.SURVEY}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddSurveys = createAsyncThunk(
    'Surveys/AddSurveys',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.SURVEY, data);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Surveys.Messages.Add'),
            }));
            clearForm && clearForm('SurveysCreate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Surveys');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const FillSurveys = createAsyncThunk(
    'Surveys/FillSurveys',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, `${ROUTES.SURVEY}/FillSurvey`, data);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Surveys.Messages.Fill'),
            }));
            clearForm && clearForm('SurveysCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Surveys');
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditSurveys = createAsyncThunk(
    'Surveys/EditSurveys',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.SURVEY, data);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Surveys.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('SurveysUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Surveys');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewSurveys = createAsyncThunk(
    'Surveys/SavepreviewSurveys',
    async ({ surveyID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.SURVEY}/Savepreview/${surveyID}`);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Surveys.Messages.Savepreview'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveSurveys = createAsyncThunk(
    'Surveys/ApproveSurveys',
    async ({ surveyID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.SURVEY}/Approve/${surveyID}`);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Surveys.Messages.Approve'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteSurveys = createAsyncThunk(
    'Surveys/CompleteSurveys',
    async ({ surveyID, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.SURVEY}/Complete/${surveyID}`);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Surveys.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteSurveys = createAsyncThunk(
    'Surveys/DeleteSurveys',
    async ({ surveyID, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.SURVEY}/${surveyID}`);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Surveys.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const RemoveSurveyanswer = createAsyncThunk(
    'Surveys/RemoveSurveyanswer',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.SURVEY}/RemoveSurveyanswer/${data.Uuid}`);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Surveys.Messages.DeleteSurveyAnswer'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ClearSurvey = createAsyncThunk(
    'Surveys/ClearSurvey',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.SURVEY}/ClearSurvey/${data.Uuid}`);
            dispatch(fillSurveynotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Surveys.Messages.CleanSurvey'),
            }));
            onSuccess && onSuccess()
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillSurveynotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SurveysSlice = createSlice({
    name: 'Surveys',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        fillSurveynotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeSurveynotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetSurveys.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetSurvey.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetSurvey.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetSurvey.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddSurveys.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditSurveys.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteSurveys.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(DeleteSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewSurveys.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(SavepreviewSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveSurveys.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(ApproveSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteSurveys.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(CompleteSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(RemoveSurveyanswer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(RemoveSurveyanswer.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(RemoveSurveyanswer.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ClearSurvey.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ClearSurvey.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(ClearSurvey.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(FillSurveys.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(FillSurveys.fulfilled, (state, action) => {
                state.isLoading = false;
            })
            .addCase(FillSurveys.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
    },
});

export const {
    fillSurveynotification,
    removeSurveynotification,
} = SurveysSlice.actions;

export default SurveysSlice.reducer;