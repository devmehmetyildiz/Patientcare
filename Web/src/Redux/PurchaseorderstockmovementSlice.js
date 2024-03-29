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
        en: 'Purchaseorder stock movement added successfully',
        tr: 'Satın alma sipariş stok hareketi Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Purchaseorder stock movement updated successfully',
        tr: 'Satın alma sipariş stok hareketi Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Purchaseorder stock movement Deleted successfully',
        tr: 'Satın alma sipariş stok hareketi Başarı ile Silindi'
    },
    approvedescription: {
        en: 'Stock movement approved successfully',
        tr: 'Stok Hareketi Başarı ile Onaylandı'
    },
}

export const GetPurchaseorderstockmovements = createAsyncThunk(
    'Purchaseorderstockmovements/GetPurchaseorderstockmovements',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCKMOVEMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPurchaseorderstockmovement = createAsyncThunk(
    'Purchaseorderstockmovements/GetPurchaseorderstockmovement',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCKMOVEMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPurchaseorderstockmovements = createAsyncThunk(
    'Purchaseorderstockmovements/AddPurchaseorderstockmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCKMOVEMENT, data);
            dispatch(fillPurchaseorderstockmovementnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PurchaseorderstockmovementsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Purchaseorderstockmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPurchaseorderstockmovements = createAsyncThunk(
    'Purchaseorderstockmovements/EditPurchaseorderstockmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDERSTOCKMOVEMENT, data);
            dispatch(fillPurchaseorderstockmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('PurchaseorderstockmovementsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Purchaseorderstockmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePurchaseorderstockmovements = createAsyncThunk(
    'Purchaseorderstockmovements/DeletePurchaseorderstockmovements',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCKMOVEMENT}/${data.Uuid}`);
            dispatch(fillPurchaseorderstockmovementnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePurchaseorderstockmovements = createAsyncThunk(
    'Purchaseorderstockmovements/ApprovePurchaseorderstockmovements',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCKMOVEMENT}/Approve/${data.Uuid}`);
            dispatch(fillPurchaseorderstockmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovemultiplePurchaseorderstockmovements = createAsyncThunk(
    'Purchaseorderstockmovements/ApprovemultiplePurchaseorderstockmovements',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.PURCHASEORDERSTOCKMOVEMENT}/Approve`, data);
            dispatch(fillPurchaseorderstockmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseorderstockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const PurchaseorderstockmovementsSlice = createSlice({
    name: 'Purchaseorderstockmovements',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isApprovemodalopen: false
    },
    reducers: {
        handleSelectedPurchaseorderstockmovement: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPurchaseorderstockmovementnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePurchaseorderstockmovementnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPurchaseorderstockmovements.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPurchaseorderstockmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPurchaseorderstockmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPurchaseorderstockmovement.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPurchaseorderstockmovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPurchaseorderstockmovement.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPurchaseorderstockmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPurchaseorderstockmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPurchaseorderstockmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPurchaseorderstockmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPurchaseorderstockmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPurchaseorderstockmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovePurchaseorderstockmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovePurchaseorderstockmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovePurchaseorderstockmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovemultiplePurchaseorderstockmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovemultiplePurchaseorderstockmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovemultiplePurchaseorderstockmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePurchaseorderstockmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePurchaseorderstockmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePurchaseorderstockmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPurchaseorderstockmovement,
    fillPurchaseorderstockmovementnotification,
    removePurchaseorderstockmovementnotification,
    handleDeletemodal,
    handleApprovemodal
} = PurchaseorderstockmovementsSlice.actions;

export default PurchaseorderstockmovementsSlice.reducer;