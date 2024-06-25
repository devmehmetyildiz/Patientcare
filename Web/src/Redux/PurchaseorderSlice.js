import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import { FileuploadPrepare } from '../Components/Fileupload';

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescription: {
        en: 'Purchase order added successfully',
        tr: 'Satın Alma Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Purchase order updated successfully',
        tr: 'Satın Alma Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Purchase order Deleted successfully',
        tr: 'Satın Alma Başarı ile Silindi'
    },
    checkcode: {
        en: 'Data Check',
        tr: 'Veri Kontrol Etme'
    },
    checkdescription: {
        en: 'Purchase order Checked successfully',
        tr: 'Satın Alma Başarı ile Kontrol Edildi'
    },
    cancelcheckdescription: {
        en: 'Purchase order Check Cancelled successfully',
        tr: 'Satın Alma Kontrolü İptal Edildi'
    },
    approvecode: {
        en: 'Data Approve',
        tr: 'Veri Onaylama'
    },
    approvedescription: {
        en: 'Purchase order Approved successfully',
        tr: 'Satın Alma Başarı ile Onaylandı'
    },
    cancelapprovedescription: {
        en: 'Purchase order Approve canceled successfully',
        tr: 'Satın Alma Onayı İptal Edildi'
    },
    completecode: {
        en: 'Data Complete',
        tr: 'Veri Tamamlama'
    },
    completedescription: {
        en: 'Purchase order Complated successfully',
        tr: 'Satın Alma Başarı ile Tamamlandı'
    },
}

export const GetPurchaseorders = createAsyncThunk(
    'Purchaseorders/GetPurchaseorders',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.PURCHASEORDER);
            return response?.data?.list || [];
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
    async ({ data, files, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.PURCHASEORDER, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Purchaseno}`,
            }));
            clearForm && clearForm('PurchaseordersCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Purchaseorders');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillPurchaseordernotification, Literals, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPurchaseorders = createAsyncThunk(
    'Purchaseorders/EditPurchaseorders',
    async ({ data, files, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.PURCHASEORDER, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Purchaseno}`,
            }));
            clearForm && clearForm('PurchaseordersUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Purchaseorders');
            if (files && files?.length > 0) {
                const reqFiles = FileuploadPrepare(files.map(u => ({ ...u, ParentID: response?.data?.data?.Uuid })), fillPurchaseordernotification, Literals, state.Profile)
                await instanse.put(config.services.File, ROUTES.FILE, reqFiles, 'mime/form-data');
            }
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePurchaseorders = createAsyncThunk(
    'Purchaseorders/DeletePurchaseorders',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/${data.Uuid}`);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Purchaseno}`,
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CheckPurchaseorders = createAsyncThunk(
    'Purchaseorders/CheckPurchaseorders',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/Check`, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: Literals.checkcode[Language],
                description: Literals.checkdescription[Language] + ` : ${data?.Purchaseno}`,
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CancelCheckPurchaseorders = createAsyncThunk(
    'Purchaseorders/CancelCheckPurchaseorders',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/CancelCheck`, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: Literals.checkcode[Language],
                description: Literals.cancelcheckdescription[Language] + ` : ${data?.Purchaseno}`,
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePurchaseorders = createAsyncThunk(
    'Purchaseorders/ApprovePurchaseorders',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/Approve`, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: Literals.approvecode[Language],
                description: Literals.approvedescription[Language] + ` : ${data?.Purchaseno}`,
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CancelApprovePurchaseorders = createAsyncThunk(
    'Purchaseorders/CancelApprovePurchaseorders',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/CancelApprove`, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: Literals.approvecode[Language],
                description: Literals.cancelapprovedescription[Language] + ` : ${data?.Purchaseno}`,
            }));
            return response?.data?.list || [];
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPurchaseordernotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompletePurchaseorders = createAsyncThunk(
    'Purchaseorders/CompletePurchaseorders',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, `${ROUTES.PURCHASEORDER}/Complete`, data);
            dispatch(fillPurchaseordernotification({
                type: 'Success',
                code: Literals.completecode[Language],
                description: Literals.completedescription[Language] + ` : ${data?.Purchaseno}`,
            }));
            return response?.data?.list || [];
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
        isDetailmodalopen: false,
        isDeletemodalopen: false,
        isCheckmodalopen: false,
        isApprovemodalopen: false,
        isCompletemodalopen: false,
        isCheckdeactive: false,
        isApprovedeactive: false,
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
        },
        handleCheckmodal: (state, action) => {
            const { modal, deactive } = action.payload
            state.isCheckmodalopen = modal ? modal : action.payload
            state.isCheckdeactive = deactive ? deactive : false
        },
        handleApprovemodal: (state, action) => {
            const { modal, deactive } = action.payload
            state.isApprovemodalopen = modal ? modal : action.payload
            state.isApprovedeactive = deactive ? deactive : false
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
        handleDetailmodal: (state, action) => {
            state.isDetailmodalopen = action.payload
        },
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
                state.isLoading = true;
            })
            .addCase(AddPurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPurchaseorders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CheckPurchaseorders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CheckPurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CheckPurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CancelCheckPurchaseorders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CancelCheckPurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CancelCheckPurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovePurchaseorders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovePurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovePurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CancelApprovePurchaseorders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CancelApprovePurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CancelApprovePurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePurchaseorders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompletePurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompletePurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePurchaseorders.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePurchaseorders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePurchaseorders.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPurchaseorder,
    fillPurchaseordernotification,
    removePurchaseordernotification,
    handleDeletemodal,
    handleApprovemodal,
    handleCheckmodal,
    handleCompletemodal,
    handleDetailmodal
} = PurchaseordersSlice.actions;

export default PurchaseordersSlice.reducer;