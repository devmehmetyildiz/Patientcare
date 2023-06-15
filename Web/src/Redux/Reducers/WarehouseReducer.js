import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "../Actions/axios";
import config from "../../Config";

export const GetWarehouses = createAsyncThunk(
    'Warehouses/GetWarehouses',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.WAREHOUSE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillWarehousenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetWarehouse = createAsyncThunk(
    'Warehouses/GetWarehouse',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.WAREHOUSE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillWarehousenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddWarehouses = createAsyncThunk(
    'Warehouses/AddWarehouses',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Warehouse, ROUTES.WAREHOUSE, data);
            dispatch(fillWarehousenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Warehouses');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillWarehousenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditWarehouses = createAsyncThunk(
    'Warehouses/EditWarehouses',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Warehouse, ROUTES.WAREHOUSE, data);
            dispatch(fillWarehousenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Warehouses');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillWarehousenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteWarehouses = createAsyncThunk(
    'Warehouses/DeleteWarehouses',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.WAREHOUSE}/${data.Uuid}`);
            dispatch(fillWarehousenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillWarehousenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const WarehousesSlice = createSlice({
    name: 'Warehouses',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedWarehouse: (state) => {
            state.selected_record = {};
        },
        fillWarehousenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeWarehousenotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetWarehouses.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetWarehouses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetWarehouses.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetWarehouse.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetWarehouse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetWarehouse.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddWarehouses.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddWarehouses.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddWarehouses.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditWarehouses.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditWarehouses.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditWarehouses.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteWarehouses.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteWarehouses.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteWarehouses.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedWarehouse,
    fillWarehousenotification,
    removeWarehousenotification,
} = WarehousesSlice.actions;

export default WarehousesSlice.reducer;