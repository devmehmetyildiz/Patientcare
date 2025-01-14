import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetCareplans = createAsyncThunk(
    'Careplans/GetCareplans',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.CAREPLAN);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetCareplan = createAsyncThunk(
    'Careplans/GetCareplan',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.CAREPLAN}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddCareplans = createAsyncThunk(
    'Careplans/AddCareplans',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Business, ROUTES.CAREPLAN, data);
            dispatch(fillCareplannotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Careplans.Messages.Add'),
            }));
            clearForm && clearForm('CareplansCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Careplans');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditCareplans = createAsyncThunk(
    'Careplans/EditCareplans',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, ROUTES.CAREPLAN, data);
            dispatch(fillCareplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Careplans.Messages.Update'),
            }));
            clearForm && clearForm('CareplansUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Careplans');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplannotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const SavepreviewCareplans = createAsyncThunk(
    'Careplans/SavepreviewCareplans',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CAREPLAN}/Savepreview/${data.Uuid}`);
            dispatch(fillCareplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Careplans.Messages.Savepreview'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteCareplans = createAsyncThunk(
    'Careplans/CompleteCareplans',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CAREPLAN}/Complete/${data.Uuid}`);
            dispatch(fillCareplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Careplans.Messages.Complete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveCareplans = createAsyncThunk(
    'Careplans/ApproveCareplans',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Business, `${ROUTES.CAREPLAN}/Approve/${data.Uuid}`);
            dispatch(fillCareplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Careplans.Messages.Approve'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplannotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const DeleteCareplans = createAsyncThunk(
    'Careplans/DeleteCareplans',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Business, `${ROUTES.CAREPLAN}/${data.Uuid}`);
            dispatch(fillCareplannotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Careplans.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCareplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CareplansSlice = createSlice({
    name: 'Careplans',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isCompletemodalopen: false,
        isApprovemodalopen: false,
        isSavepreviewmodalopen: false,
        isDetailmodalopen: false,
    },
    reducers: {
        handleSelectedCareplan: (state, action) => {
            state.selected_record = action.payload;
        },
        fillCareplannotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeCareplannotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
        handleSavepreviewmodal: (state, action) => {
            state.isSavepreviewmodalopen = action.payload
        },
        handleDetailmodal: (state, action) => {
            state.isDetailmodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCareplans.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetCareplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetCareplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetCareplan.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetCareplan.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetCareplan.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddCareplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddCareplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddCareplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditCareplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditCareplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditCareplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveCareplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveCareplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveCareplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewCareplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewCareplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(SavepreviewCareplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteCareplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteCareplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompleteCareplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteCareplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteCareplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteCareplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedCareplan,
    fillCareplannotification,
    removeCareplannotification,
    handleDeletemodal,
    handleCompletemodal,
    handleApprovemodal,
    handleSavepreviewmodal,
    handleDetailmodal,
} = CareplansSlice.actions;

export default CareplansSlice.reducer;