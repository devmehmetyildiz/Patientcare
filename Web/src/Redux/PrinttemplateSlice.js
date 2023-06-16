import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPrinttemplates = createAsyncThunk(
    'Printtemplates/GetPrinttemplates',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, ROUTES.PRINTTEMPLATE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPrinttemplate = createAsyncThunk(
    'Printtemplates/GetPrinttemplate',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.System, `${ROUTES.PRINTTEMPLATE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPrinttemplates = createAsyncThunk(
    'Printtemplates/AddPrinttemplates',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.System, ROUTES.PRINTTEMPLATE, data);
            dispatch(fillPrinttemplatenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Printtemplates');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPrinttemplates = createAsyncThunk(
    'Printtemplates/EditPrinttemplates',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.System, ROUTES.PRINTTEMPLATE, data);
            dispatch(fillPrinttemplatenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Printtemplates');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePrinttemplates = createAsyncThunk(
    'Printtemplates/DeletePrinttemplates',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.System, `${ROUTES.PRINTTEMPLATE}/${data.Uuid}`);
            dispatch(fillPrinttemplatenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPrinttemplatenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PrinttemplatesSlice = createSlice({
    name: 'Printtemplates',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedPrinttemplate: (state) => {
            state.selected_record = {};
        },
        fillPrinttemplatenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePrinttemplatenotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPrinttemplates.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPrinttemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPrinttemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPrinttemplate.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPrinttemplate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPrinttemplate.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPrinttemplates.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPrinttemplates.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPrinttemplates.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPrinttemplates.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPrinttemplates.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPrinttemplates.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePrinttemplates.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePrinttemplates.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePrinttemplates.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedPrinttemplate,
    fillPrinttemplatenotification,
    removePrinttemplatenotification,
} = PrinttemplatesSlice.actions;

export default PrinttemplatesSlice.reducer;