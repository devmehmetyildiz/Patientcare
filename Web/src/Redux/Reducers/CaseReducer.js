import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "../Actions/axios";
import config from "../../Config";

export const GetCases = createAsyncThunk(
    'Cases/GetCases',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.CASE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetCase = createAsyncThunk(
    'Cases/GetCase',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.CASE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddCases = createAsyncThunk(
    'Cases/AddCases',
    async ({data, history}, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.CASE, data);
            dispatch(fillCasenotification({
                type: 'Success',
                code: 'Durumlar',
                description: 'Kontrol grubu başarı ile Eklendi',
            }));
            history.push('/Cases');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditCases = createAsyncThunk(
    'Cases/EditCases',
    async ({data, history}, {dispatch} ) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.CASE, data);
            dispatch(fillCasenotification({
                type: 'Success',
                code: 'Durumlar',
                description: 'Kontrol grubu başarı ile Güncellendi',
            }));
              history.push('/Cases');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteCases = createAsyncThunk(
    'Cases/DeleteCases',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.CASE}/${data.Uuid}`);
            dispatch(fillCasenotification({
                type: 'Success',
                code: 'Durumlar',
                description: 'Kontrol grubu başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CasesSlice = createSlice({
    name: 'Cases',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedCase: (state) => {
            state.selected_record = {};
        },
        fillCasenotification: (state, action) => {
            console.log('state: ', state);
            console.log('action.payload: ', action.payload);
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeCasenotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCases.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetCases.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetCases.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetCase.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetCase.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetCase.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedCase,
    fillCasenotification,
    removeCasenotification,
} = CasesSlice.actions;

export default CasesSlice.reducer;