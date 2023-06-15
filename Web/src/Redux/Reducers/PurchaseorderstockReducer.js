import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "../Actions/axios";
import config from "../../Config";

export const GetPurchaseorderstocks = createAsyncThunk(
    'Purchaseorderstocks/GetPurchaseorderstocks',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPurchaseorderstock = createAsyncThunk(
    'Purchaseorderstocks/GetPurchaseorderstock',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCK}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPurchaseorderstocks = createAsyncThunk(
    'Purchaseorderstocks/AddPurchaseorderstocks',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK, data);
            dispatch(fillPurchaseorderstocknotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Purchaseorderstocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPurchaseorderstocks = createAsyncThunk(
    'Purchaseorderstocks/EditPurchaseorderstocks',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK, data);
            dispatch(fillPurchaseorderstocknotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Purchaseorderstocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePurchaseorderstocks = createAsyncThunk(
    'Purchaseorderstocks/DeletePurchaseorderstocks',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCK}/${data.Uuid}`);
            dispatch(fillPurchaseorderstocknotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PurchaseorderstocksSlice = createSlice({
    name: 'Purchaseorderstocks',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedPurchaseorderstock: (state) => {
            state.selected_record = {};
        },
        fillPurchaseorderstocknotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePurchaseorderstocknotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPurchaseorderstocks.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPurchaseorderstocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPurchaseorderstocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPurchaseorderstock.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPurchaseorderstock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPurchaseorderstock.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPurchaseorderstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPurchaseorderstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPurchaseorderstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPurchaseorderstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPurchaseorderstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPurchaseorderstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePurchaseorderstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePurchaseorderstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePurchaseorderstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedPurchaseorderstock,
    fillPurchaseorderstocknotification,
    removePurchaseorderstocknotification,
} = PurchaseorderstocksSlice.actions;

export default PurchaseorderstocksSlice.reducer;