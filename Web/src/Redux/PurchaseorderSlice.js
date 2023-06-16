import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetPurchaseorders = createAsyncThunk(
    'Purchaseorders/GetPurchaseorders',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.PURCHASEORDER);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPurchaseorder = createAsyncThunk(
    'Purchaseorders/GetPurchaseorder',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPurchaseorders = createAsyncThunk(
    'Purchaseorders/AddPurchaseorders',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Warehouse, ROUTES.PURCHASEORDER, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'Satın alma başarı ile Eklendi',
            }));
            history.push('/Purchaseorders');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPurchaseorders = createAsyncThunk(
    'Purchaseorders/EditPurchaseorders',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDER, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Satın alma başarı ile Güncellendi',
            }));
            history.push('/Purchaseorders');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompletePurchaseorders = createAsyncThunk(
    'Purchaseorders/CompletePurchaseorders',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDER + `/Complete`, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Satın alma başarı ile Tamamlandı',
            }));
            history.push('/Purchaseorders');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePurchaseorders = createAsyncThunk(
    'Purchaseorders/DeletePurchaseorders',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/${data.Uuid}`);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'Satın alma başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PurchaseordersSlice = createSlice({
    name: 'Purchaseorders',
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
        handleSelectedPurchaseorder: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPurchaseordernotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePurchaseordernotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPurchaseorders.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPurchaseorder.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPurchaseorder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPurchaseorder.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPurchaseorders.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPurchaseorders.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPurchaseorders.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPurchaseorders.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPurchaseorders.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPurchaseorders.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePurchaseorders.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(CompletePurchaseorders.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(CompletePurchaseorders.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePurchaseorders.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePurchaseorders.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePurchaseorders.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPurchaseorder,
    fillPurchaseordernotification,
    removePurchaseordernotification,
    handleDeletemodal
} = PurchaseordersSlice.actions;

export default PurchaseordersSlice.reducer;