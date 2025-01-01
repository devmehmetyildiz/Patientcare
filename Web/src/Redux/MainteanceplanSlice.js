import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import { FileuploadPrepare } from '../Components/Fileupload';

export const GetMainteanceplans = createAsyncThunk(
    'Mainteanceplans/GetMainteanceplans',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.MAINTEANCEPLAN);
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetMainteanceplan = createAsyncThunk(
    'Mainteanceplans/GetMainteanceplan',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.MAINTEANCEPLAN}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddMainteanceplans = createAsyncThunk(
    'Mainteanceplans/AddMainteanceplans',
    async ({ data, files, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.Warehouse, ROUTES.MAINTEANCEPLAN, data);
            dispatch(fillMainteanceplannotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Mainteanceplans.Messages.Add'),
            }));
            clearForm && clearForm('MainteanceplansCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Mainteanceplans');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillMainteanceplannotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditMainteanceplans = createAsyncThunk(
    'Mainteanceplans/EditMainteanceplans',
    async ({ data, files, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Warehouse, ROUTES.MAINTEANCEPLAN, data);
            dispatch(fillMainteanceplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Mainteanceplans.Messages.Update'),
            }));
            clearForm && clearForm('MainteanceplansUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Mainteanceplans');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillMainteanceplannotification, null, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SavepreviewMainteanceplans = createAsyncThunk(
    'Mainteanceplans/SavepreviewMainteanceplans',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.MAINTEANCEPLAN}/Savepreview/${uuid}`);
            dispatch(fillMainteanceplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Mainteanceplans.Messages.Savepreview'),
            }));
            onSuccess && onSuccess()
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveMainteanceplans = createAsyncThunk(
    'Mainteanceplans/ApproveMainteanceplans',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.MAINTEANCEPLAN}/Approve/${uuid}`);
            dispatch(fillMainteanceplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Mainteanceplans.Messages.Appprove'),
            }));
            onSuccess && onSuccess()
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompleteMainteanceplans = createAsyncThunk(
    'Mainteanceplans/CompleteMainteanceplans',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.MAINTEANCEPLAN}/Complete/${uuid}`);
            dispatch(fillMainteanceplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Mainteanceplans.Messages.Complete'),
            }));
            onSuccess && onSuccess()
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const WorkMainteanceplans = createAsyncThunk(
    'Mainteanceplans/WorkMainteanceplans',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.MAINTEANCEPLAN}/Work/${uuid}`);
            dispatch(fillMainteanceplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Mainteanceplans.Messages.Work'),
            }));
            onSuccess && onSuccess()
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const StopMainteanceplans = createAsyncThunk(
    'Mainteanceplans/StopMainteanceplans',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.MAINTEANCEPLAN}/Stop/${uuid}`);
            dispatch(fillMainteanceplannotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Mainteanceplans.Messages.Stop'),
            }));
            onSuccess && onSuccess()
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteMainteanceplans = createAsyncThunk(
    'Mainteanceplans/DeleteMainteanceplans',
    async ({ uuid, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.MAINTEANCEPLAN}/${uuid}`);
            dispatch(fillMainteanceplannotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Mainteanceplans.Messages.Delete'),
            }));
            onSuccess && onSuccess()
            return response?.data || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillMainteanceplannotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const MainteanceplansSlice = createSlice({
    name: 'Mainteanceplans',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        handleSelectedMainteanceplan: (state, action) => {
            state.selected_record = action.payload;
        },
        fillMainteanceplannotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeMainteanceplannotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetMainteanceplans.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetMainteanceplan.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetMainteanceplan.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetMainteanceplan.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddMainteanceplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditMainteanceplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(SavepreviewMainteanceplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(SavepreviewMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(SavepreviewMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveMainteanceplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompleteMainteanceplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompleteMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompleteMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(WorkMainteanceplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(WorkMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(WorkMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(StopMainteanceplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(StopMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(StopMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteMainteanceplans.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteMainteanceplans.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteMainteanceplans.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedMainteanceplan,
    fillMainteanceplannotification,
    removeMainteanceplannotification,
} = MainteanceplansSlice.actions;

export default MainteanceplansSlice.reducer;