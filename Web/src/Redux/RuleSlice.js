import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";


export const GetRules = createAsyncThunk(
    'Rules/GetRules',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, ROUTES.RULE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetRule = createAsyncThunk(
    'Rules/GetRule',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, `${ROUTES.RULE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetRulelogs = createAsyncThunk(
    'Rules/GetRulelogs',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, `${ROUTES.RULE}/Getrulelogs/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetRulelogswithoutloading = createAsyncThunk(
    'Rules/GetRulelogswithoutloading',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, `${ROUTES.RULE}/Getrulelogs/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRules = createAsyncThunk(
    'Rules/AddRules',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.post(config.services.System, ROUTES.RULE, data);
            dispatch(fillRulenotification({
                type: 'Success',
                code: t('Common.Code.Add'),
                description: t('Redux.Rules.Messages.Add'),
            }));
            clearForm && clearForm('RulesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Rules');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditRules = createAsyncThunk(
    'Rules/EditRules',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.put(config.services.System, ROUTES.RULE, data);
            dispatch(fillRulenotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Rules.Messages.Update'),
            }));
            clearForm && clearForm('RulesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Rules');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const StopRules = createAsyncThunk(
    'Rules/StopRules',
    async (guid, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.System, `${ROUTES.RULE}/StopRule/${guid}`);
            dispatch(fillRulenotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Rules.Messages.Stop'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteRules = createAsyncThunk(
    'Rules/DeleteRules',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.System, `${ROUTES.RULE}/${data.Uuid}`);
            dispatch(fillRulenotification({
                type: 'Success',
                code: t('Common.Code.Delete'),
                description: t('Redux.Rules.Messages.Delete'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ClearRulelogs = createAsyncThunk(
    'Rules/ClearRulelogs',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const t = state?.Profile?.i18n?.t || null
            const response = await instanse.delete(config.services.System, `${ROUTES.RULE}/Clearrulelogs/${data.Uuid}`);
            dispatch(fillRulenotification({
                type: 'Success',
                code: t('Common.Code.Update'),
                description: t('Redux.Rules.Messages.Clear'),
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRulenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const RulesSlice = createSlice({
    name: 'Rules',
    initialState: {
        list: [],
        loglist: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        fillRulenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeRulenotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetRules.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetRules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetRules.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetRule.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetRule.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetRule.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetRulelogs.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.loglist = [];
            })
            .addCase(GetRulelogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loglist = action.payload;
            })
            .addCase(GetRulelogs.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetRulelogswithoutloading.pending, (state) => {
                state.errMsg = null;
            })
            .addCase(GetRulelogswithoutloading.fulfilled, (state, action) => {
                state.loglist = action.payload;
            })
            .addCase(GetRulelogswithoutloading.rejected, (state, action) => {
                state.errMsg = action.error.message;
            })
            .addCase(AddRules.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddRules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddRules.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditRules.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditRules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditRules.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(StopRules.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(StopRules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(StopRules.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteRules.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteRules.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteRules.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ClearRulelogs.pending, (state) => {
                state.isLoading = true;
                state.loglist = [];
            })
            .addCase(ClearRulelogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loglist = action.payload;
            })
            .addCase(ClearRulelogs.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    fillRulenotification,
    removeRulenotification,
} = RulesSlice.actions;

export default RulesSlice.reducer;