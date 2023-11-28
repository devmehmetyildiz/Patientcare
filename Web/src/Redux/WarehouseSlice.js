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
        en: 'Warehouse added successfully',
        tr: 'Ambar Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Warehouse updated successfully',
        tr: 'Ambar Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Warehouse Deleted successfully',
        tr: 'Ambar Başarı ile Silindi'
    },
}

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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.WAREHOUSE, data);
            dispatch(fillWarehousenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('WarehousesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Warehouses');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillWarehousenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordWarehouses = createAsyncThunk(
    'Warehouses/AddRecordWarehouses',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.WAREHOUSE + '/AddRecord', data);
            dispatch(fillWarehousenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('WarehousesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Warehouses');
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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.WAREHOUSE, data);
            dispatch(fillWarehousenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('WarehousesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Warehouses');
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
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.WAREHOUSE}/${data.Uuid}`);
            dispatch(fillWarehousenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
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
        isDispatching: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedWarehouse: (state, action) => {
            state.selected_record = action.payload;
        },
        fillWarehousenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeWarehousenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
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
            .addCase(AddRecordWarehouses.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordWarehouses.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordWarehouses.rejected, (state, action) => {
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
    handleSelectedWarehouse,
    fillWarehousenotification,
    removeWarehousenotification,
    handleDeletemodal
} = WarehousesSlice.actions;

export default WarehousesSlice.reducer;