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
        en: 'Rule added successfully',
        tr: 'Kural Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Rule updated successfully',
        tr: 'Kural Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Rule Deleted successfully',
        tr: 'Kural Başarı ile Silindi'
    },
    cleardescription: {
        en: 'Rule Logs Deleted succesfully',
        tr: 'Kural kayıtları başarı ile temizlendi'
    },
}

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
    async ({ data, history, redirectUrl, closeModal }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.System, ROUTES.RULE, data);
            dispatch(fillRulenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillRulenotification({
                type: 'Clear',
                code: 'RulesCreate',
                description: '',
            }));
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
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.System, ROUTES.RULE, data);
            dispatch(fillRulenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillRulenotification({
                type: 'Clear',
                code: 'RulesUpdate',
                description: '',
            }));
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
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.System, `${ROUTES.RULE}/StopRule/${guid}`);
            dispatch(fillRulenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
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
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.System, `${ROUTES.RULE}/${data.Uuid}`);
            dispatch(fillRulenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
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
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.System, `${ROUTES.RULE}/Clearrulelogs/${data.Uuid}`);
            dispatch(fillRulenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.cleardescription[Language],
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
        privileges: [],
        privilegegroups: [],
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
        isDeletemodalopen: false,
        isLogmodalopen: false,
    },
    reducers: {

        handleSelectedRule: (state, action) => {
            state.selected_record = action.payload;
        },
        fillRulenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeRulenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleLogmodal: (state, action) => {
            state.isLogmodalopen = action.payload
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
                state.isDispatching = true;
            })
            .addCase(AddRules.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRules.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditRules.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditRules.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditRules.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(StopRules.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(StopRules.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(StopRules.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteRules.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteRules.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteRules.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(ClearRulelogs.pending, (state) => {
                state.isDispatching = true;
                state.loglist = [];
            })
            .addCase(ClearRulelogs.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.loglist = action.payload;
            })
            .addCase(ClearRulelogs.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedRule,
    fillRulenotification,
    removeRulenotification,
    handleDeletemodal,
    handleLogmodal
} = RulesSlice.actions;

export default RulesSlice.reducer;