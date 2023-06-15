import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosErrorHelper from '../../Utils/AxiosErrorHelper';
import instance from '../Actions/axios';
import config from '../../Config';
import { ROUTES } from '../../Utils/Constants';

export const GetCases = createAsyncThunk('case/GetCases', async (_, { rejectWithValue }) => {
    try {
        const response = await instance.get(config.services.Setting, ROUTES.CASE);
        return response.data;
    } catch (error) {
        return rejectWithValue(AxiosErrorHelper(error));
    }
});

export const GetCase = createAsyncThunk('case/GetCase', async (guid, { rejectWithValue }) => {
    try {
        const response = await instance.get(`${config.services.Setting}${ROUTES.CASE}/${guid}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(AxiosErrorHelper(error));
    }
});

export const AddCases = createAsyncThunk('case/AddCases', async ({ data, historypusher }, { rejectWithValue }) => {
    try {
        const response = await instance.post(`${config.services.Setting}${ROUTES.CASE}`, data);
        historypusher.push('/Cases');
        return response.data;
    } catch (error) {
        return rejectWithValue(AxiosErrorHelper(error));
    }
});

export const EditCases = createAsyncThunk('case/EditCases', async ({ data, historypusher }, { rejectWithValue }) => {
    try {
        const response = await instance.put(`${config.services.Setting}${ROUTES.CASE}`, data);
        historypusher.push('/Cases');
        return response.data;
    } catch (error) {
        return rejectWithValue(AxiosErrorHelper(error));
    }
});

export const DeleteCases = createAsyncThunk('case/DeleteCases', async (data, { rejectWithValue }) => {
    try {
        await instance.delete(`${config.services.Setting}${ROUTES.CASE}/${data.Uuid}`);
        return data;
    } catch (error) {
        return rejectWithValue(AxiosErrorHelper(error));
    }
});

const caseSlice = createSlice({
    name: 'case',
    initialState: {
        list: [],
        selected_record: {},
        errmsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false,
    },
    reducers: {
        RemoveSelectedCase: (state) => {
            state.selected_record = {};
        },
        fillCasenotification: (state, action) => {
            const messages = Array.isArray(action.payload)
                ? state.notifications.concat(action.payload)
                : state.notifications.concat([action.payload]);
            state.notifications = messages;
        },
        removeCasenotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCases.pending, (state) => {
                state.isLoading = true;
                state.errmsg = null;
                state.list = [];
            })
            .addCase(GetCases.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetCases.rejected, (state, action) => {
                state.isLoading = false;
                state.errmsg = action.payload;
            })
            .addCase(GetCase.pending, (state) => {
                state.isLoading = true;
                state.errmsg = null;
                state.selected_record = {};
            })
            .addCase(GetCase.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetCase.rejected, (state, action) => {
                state.isLoading = false;
                state.errmsg = action.payload;
            })
            .addCase(AddCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
                state.notifications.unshift({
                    type: 'Success',
                    code: 'Durumlar',
                    description: 'Durum Başarı ile Eklendi',
                });
            })
            .addCase(AddCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errmsg = action.payload;
            })
            .addCase(EditCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
                state.notifications.unshift({
                    type: 'Success',
                    code: 'Durumlar',
                    description: 'Durum Başarı ile Güncellendi',
                });
            })
            .addCase(EditCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errmsg = action.payload;
            })
            .addCase(DeleteCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
                state.notifications.unshift({
                    type: 'Success',
                    code: 'Durumlar',
                    description: 'Durum Başarı ile Silindi',
                });
            })
            .addCase(DeleteCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errmsg = action.payload;
            });
    },
});

export const {
    RemoveSelectedCase,
    fillCasenotification,
    removeCasenotification,
} = caseSlice.actions;

export default caseSlice.reducer;