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
        en: 'Stock added successfully',
        tr: 'Stok Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Stock updated successfully',
        tr: 'Stok Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Stock Deleted successfully',
        tr: 'Stok Başarı ile Silindi'
    },
    movedescription: {
        en: 'Stock Moved  Successfully',
        tr: 'Stok Başarı ile taşındı'
    },
    deactivedescription: {
        en: 'Stock Deactivated  Successfully',
        tr: 'Stok Başarı ile İn Aktif edildi'
    },
    approvedescription: {
        en: 'Stock Approved Successfully',
        tr: 'Stok Başarı ile Onaylandı'
    },
}

export const GetStocks = createAsyncThunk(
    'Stocks/GetStocks',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.STOCK);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetStock = createAsyncThunk(
    'Stocks/GetStock',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.STOCK}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddStocks = createAsyncThunk(
    'Stocks/AddStocks',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCK, data);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('StocksCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CreateStockFromStock = createAsyncThunk(
    'Stocks/CreateStockFromStock',
    async ({ data, history, redirectUrl, closeModal, clearForm, onSuccess }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCK + '/CreateStockFromStock', data);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('StocksCreate')
            closeModal && closeModal()
            onSuccess && onSuccess()
            history && history.push(redirectUrl ? redirectUrl : '/Stocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);




export const EditStocks = createAsyncThunk(
    'Stocks/EditStocks',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.STOCK, data);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('StocksUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteStocks = createAsyncThunk(
    'Stocks/DeleteStocks',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.STOCK}/${data.Uuid}`);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveStocks = createAsyncThunk(
    'Stocks/ApproveStocks',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.STOCK}/Approve/${data.Uuid}`);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovemultipleStocks = createAsyncThunk(
    'Stocks/ApprovemultipleStocks',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.STOCK}/Approve`, data);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const StocksSlice = createSlice({
    name: 'Stocks',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
    },
    reducers: {
        fillStocknotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeStocknotification: (state) => {
            state.notifications.splice(0, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetStocks.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetStock.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetStock.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddStocks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CreateStockFromStock.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CreateStockFromStock.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CreateStockFromStock.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveStocks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovemultipleStocks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovemultipleStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovemultipleStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditStocks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteStocks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteStocks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteStocks.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    fillStocknotification,
    removeStocknotification,
} = StocksSlice.actions;

export default StocksSlice.reducer;