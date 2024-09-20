import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetClaimpaymentparameters = createAsyncThunk(
    'Claimpaymentparameters/GetClaimpaymentparameters',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.CLAIMPAYMENTPARAMETER);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetClaimpaymentparameter = createAsyncThunk(
    'Claimpaymentparameters/GetClaimpaymentparameter',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.CLAIMPAYMENTPARAMETER}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddClaimpaymentparameters = createAsyncThunk(
    'Claimpaymentparameters/AddClaimpaymentparameters',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.CLAIMPAYMENTPARAMETER, data);
            dispatch(fillClaimpaymentparameternotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Claimpaymentparameters.Messages.Savepreview'),
            }));
            clearForm && clearForm('ClaimpaymentparametersCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Claimpaymentparameters');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditClaimpaymentparameters = createAsyncThunk(
    'Claimpaymentparameters/EditClaimpaymentparameters',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.CLAIMPAYMENTPARAMETER, data);
            dispatch(fillClaimpaymentparameternotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Claimpaymentparameters.Messages.Update'),
            }));
            closeModal && closeModal()
            clearForm && clearForm('ClaimpaymentparametersUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Claimpaymentparameters');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveClaimpaymentparameters = createAsyncThunk(
    'Claimpaymentparameters/ApproveClaimpaymentparameters',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CLAIMPAYMENTPARAMETER}/Approve/${data.Uuid}`);
            dispatch(fillClaimpaymentparameternotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Claimpaymentparameters.Messages.Approve'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewClaimpaymentparameters = createAsyncThunk(
    'Claimpaymentparameters/SavepreviewClaimpaymentparameters',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CLAIMPAYMENTPARAMETER}/Savepreview/${data.Uuid}`);
            dispatch(fillClaimpaymentparameternotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Claimpaymentparameters.Messages.Add'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ActivateClaimpaymentparameters = createAsyncThunk(
    'Claimpaymentparameters/ActivateClaimpaymentparameters',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CLAIMPAYMENTPARAMETER}/Activate/${data.Uuid}`);
            dispatch(fillClaimpaymentparameternotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Claimpaymentparameters.Messages.Activate'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeactivateClaimpaymentparameters = createAsyncThunk(
    'Claimpaymentparameters/DeactivateClaimpaymentparameters',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CLAIMPAYMENTPARAMETER}/Deactivate/${data.Uuid}`);
            dispatch(fillClaimpaymentparameternotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Claimpaymentparameters.Messages.Deactivate'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteClaimpaymentparameters = createAsyncThunk(
    'Claimpaymentparameters/DeleteClaimpaymentparameters',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.CLAIMPAYMENTPARAMETER}/${data.Uuid}`);
            dispatch(fillClaimpaymentparameternotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Claimpaymentparameters.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillClaimpaymentparameternotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ClaimpaymentparametersSlice = createSlice({
    name: 'Claimpaymentparameters',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isApprovemodalopen: false,
        isActivatemodalopen: false,
        isDeactivatemodalopen: false,
        isSavepreviewmodalopen: false,
    },
    reducers: {
        handleSelectedClaimpaymentparameter: (state, action) => {
            state.selected_record = action.payload;
        },
        fillClaimpaymentparameternotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeClaimpaymentparameternotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        },
        handleActivatemodal: (state, action) => {
            state.isActivatemodalopen = action.payload
        },
        handleDeactivatemodal: (state, action) => {
            state.isDeactivatemodalopen = action.payload
        },
        handleSavepreviewmodal: (state, action) => {
            state.isSavepreviewmodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetClaimpaymentparameters.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetClaimpaymentparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetClaimpaymentparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetClaimpaymentparameter.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetClaimpaymentparameter.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetClaimpaymentparameter.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddClaimpaymentparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddClaimpaymentparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddClaimpaymentparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditClaimpaymentparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditClaimpaymentparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditClaimpaymentparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveClaimpaymentparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveClaimpaymentparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveClaimpaymentparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewClaimpaymentparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewClaimpaymentparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(SavepreviewClaimpaymentparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ActivateClaimpaymentparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ActivateClaimpaymentparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ActivateClaimpaymentparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeactivateClaimpaymentparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeactivateClaimpaymentparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeactivateClaimpaymentparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteClaimpaymentparameters.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteClaimpaymentparameters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteClaimpaymentparameters.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedClaimpaymentparameter,
    fillClaimpaymentparameternotification,
    removeClaimpaymentparameternotification,
    handleDeletemodal,
    handleApprovemodal,
    handleActivatemodal,
    handleDeactivatemodal,
    handleSavepreviewmodal
} = ClaimpaymentparametersSlice.actions;

export default ClaimpaymentparametersSlice.reducer;