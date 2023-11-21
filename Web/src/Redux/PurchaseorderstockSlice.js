import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import notification from '../Utils/Notification';

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescription: {
        en: 'Purchaseorder stock added successfully',
        tr: 'Satın alma stoğu Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Purchaseorder stock updated successfully',
        tr: 'Satın alma stoğu Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Purchaseorder stock Deleted successfully',
        tr: 'Satın alma stoğu Başarı ile Silindi'
    },
    approvedescription: {
        en: 'Purchaseorder stock Approved successfully',
        tr: 'Satın alma stoğu Başarı ile Onaylandı'
    },
}

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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK, data);
            dispatch(fillPurchaseorderstocknotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PurchaseorderstocksCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Purchaseorderstocks');
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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCK, data);
            dispatch(fillPurchaseorderstocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('PurchaseorderstocksUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Purchaseorderstocks');
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
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCK}/${data.Uuid}`);
            dispatch(fillPurchaseorderstocknotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePurchaseorderstocks = createAsyncThunk(
    'Purchaseorderstocks/ApprovePurchaseorderstocks',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCK}/Approve/${data.Uuid}`);
            dispatch(fillPurchaseorderstocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovemultiplePurchaseorderstocks = createAsyncThunk(
    'Purchaseorderstocks/ApprovemultiplePurchaseorderstocks',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCK}/Approve`, data);
            dispatch(fillPurchaseorderstocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
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
        isDispatching: false,
        isDeletemodalopen: false,
        isApprovemodalopen: false
    },
    reducers: {
        handleSelectedPurchaseorderstock: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPurchaseorderstocknotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePurchaseorderstocknotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
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
            .addCase(ApprovePurchaseorderstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(ApprovePurchaseorderstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(ApprovePurchaseorderstocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovemultiplePurchaseorderstocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(ApprovemultiplePurchaseorderstocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(ApprovemultiplePurchaseorderstocks.rejected, (state, action) => {
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
    handleSelectedPurchaseorderstock,
    fillPurchaseorderstocknotification,
    removePurchaseorderstocknotification,
    handleDeletemodal,
    handleApprovemodal
} = PurchaseorderstocksSlice.actions;

export default PurchaseorderstocksSlice.reducer;