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
    async ({ data, history }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCK, data);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillStocknotification({
                type: 'Clear',
                code: 'StocksCreate',
                description: '',
            }));
            history && history.push('/Stocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const MoveStocks = createAsyncThunk(
    'Stocks/MoveStocks',
    async ({ data, history }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCK + "/Movestock", data);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.movedescription[Language],
            }));
            history && history.push('/Stocks');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocknotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeactivateStocks = createAsyncThunk(
    'Stocks/DeactivateStocks',
    async ({ data, history }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCK + "/Deactivestocks", data);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.deactivedescription[Language],
            }));
            history && history.push('/Stocks');
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
    async ({ data, history }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.STOCK, data);
            dispatch(fillStocknotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillStocknotification({
                type: 'Clear',
                code: 'StocksUpdate',
                description: '',
            }));
            history && history.push('/Stocks');
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
            delete data['edit'];
            delete data['delete'];
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

export const StocksSlice = createSlice({
    name: 'Stocks',
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
        handleSelectedStock: (state, action) => {
            state.selected_record = action.payload;
        },
        fillStocknotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeStocknotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
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
                state.isDispatching = true;
            })
            .addCase(AddStocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddStocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(MoveStocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(MoveStocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(MoveStocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeactivateStocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeactivateStocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeactivateStocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditStocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditStocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditStocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteStocks.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteStocks.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteStocks.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedStock,
    fillStocknotification,
    removeStocknotification,
    handleDeletemodal
} = StocksSlice.actions;

export default StocksSlice.reducer;