import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import { FileuploadPrepare } from '../Components/Fileupload';

export const GetTrainings = createAsyncThunk(
    'Trainings/GetTrainings',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.TRAINING);
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetTraining = createAsyncThunk(
    'Trainings/GetTraining',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.TRAINING}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddTrainings = createAsyncThunk(
    'Trainings/AddTrainings',
    async ({ data, history, files, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.TRAINING, data);
            dispatch(fillTrainingnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Trainings.Messages.Savepreview'),
            }));
            clearForm && clearForm('TrainingsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Trainings');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillTrainingnotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditTrainings = createAsyncThunk(
    'Trainings/EditTrainings',
    async ({ data, history, redirectUrl, files, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.TRAINING, data);
            dispatch(fillTrainingnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Trainings.Messages.Update'),
            }));
            clearForm && clearForm('TrainingsEdit')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Trainings');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillTrainingnotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveTrainings = createAsyncThunk(
    'Trainings/ApproveTrainings',
    async ({ data }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.TRAINING}/Approve/${data.Uuid}`);
            dispatch(fillTrainingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Trainings.Messages.Approve'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteTrainingusers = createAsyncThunk(
    'Trainings/CompleteTrainingusers',
    async ({ data, onSuccess }, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.TRAINING}/CompleteTraininguser/${data.Uuid}`);
            dispatch(fillTrainingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Trainings.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewTrainings = createAsyncThunk(
    'Trainings/SavepreviewTrainings',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.TRAINING}/Savepreview/${data?.Uuid}`);
            dispatch(fillTrainingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Trainings.Messages.Savepreview'),
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Trainings');
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteTrainings = createAsyncThunk(
    'Trainings/CompleteTrainings',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.TRAINING}/Complete/${data?.Uuid}`);
            dispatch(fillTrainingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Trainings.Messages.Complete'),
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Trainings');
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteAllTrainings = createAsyncThunk(
    'Trainings/CompleteAllTrainings',
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.TRAINING}/CompleteAll/${data?.Uuid}`);
            dispatch(fillTrainingnotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Trainings.Messages.Complete'),
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Trainings');
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteTrainings = createAsyncThunk(
    'Trainings/DeleteTrainings',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.TRAINING}/${data.Uuid}`);
            dispatch(fillTrainingnotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Trainings.Messages.Delete'),
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTrainingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const TrainingsSlice = createSlice({
    name: 'Trainings',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isApprovemodalopen: false,
        isSavepreviewmodalopen: false,
        isCompletemodalopen: false,
    },
    reducers: {
        handleSelectedTraining: (state, action) => {
            state.selected_record = action.payload;
        },
        fillTrainingnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeTrainingnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        },
        handleSavepreviewmodal: (state, action) => {
            state.isSavepreviewmodalopen = action.payload
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetTrainings.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetTrainings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetTrainings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetTraining.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetTraining.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetTraining.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddTrainings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddTrainings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddTrainings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveTrainings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveTrainings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveTrainings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewTrainings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewTrainings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(SavepreviewTrainings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteTrainingusers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteTrainingusers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompleteTrainingusers.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteTrainings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteTrainings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompleteTrainings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteAllTrainings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteAllTrainings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompleteAllTrainings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteTrainings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteTrainings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteTrainings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedTraining,
    fillTrainingnotification,
    removeTrainingnotification,
    handleDeletemodal,
    handleApprovemodal,
    handleSavepreviewmodal,
    handleCompletemodal
} = TrainingsSlice.actions;

export default TrainingsSlice.reducer;