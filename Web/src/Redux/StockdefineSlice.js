import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetStockdefines = createAsyncThunk(
    'Stockdefines/GetStockdefines',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.STOCKDEFINE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetStockdefine = createAsyncThunk(
    'Stockdefines/GetStockdefine',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.STOCKDEFINE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddStockdefines = createAsyncThunk(
    'Stockdefines/AddStockdefines',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCKDEFINE, data);
            dispatch(fillStockdefinenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Stockdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditStockdefines = createAsyncThunk(
    'Stockdefines/EditStockdefines',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Warehouse, ROUTES.STOCKDEFINE, data);
            dispatch(fillStockdefinenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Stockdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteStockdefines = createAsyncThunk(
    'Stockdefines/DeleteStockdefines',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.STOCKDEFINE}/${data.Uuid}`);
            dispatch(fillStockdefinenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const StockdefinesSlice = createSlice({
    name: 'Stockdefines',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedStockdefine: (state) => {
            state.selected_record = {};
        },
        fillStockdefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeStockdefinenotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetStockdefines.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetStockdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetStockdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetStockdefine.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetStockdefine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetStockdefine.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddStockdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddStockdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddStockdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditStockdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditStockdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditStockdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteStockdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteStockdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteStockdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedStockdefine,
    fillStockdefinenotification,
    removeStockdefinenotification,
} = StockdefinesSlice.actions;

export default StockdefinesSlice.reducer;