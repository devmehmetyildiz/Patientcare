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
        en: 'Stock define added successfully',
        tr: 'Ürün Tanımı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Stock define updated successfully',
        tr: 'Ürün Tanımı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Stock define Deleted successfully',
        tr: 'Ürün Tanımı Başarı ile Silindi'
    },
}

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
    async ({ data, history, redirectUrl, closeModal }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCKDEFINE, data);
            dispatch(fillStockdefinenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillStockdefinenotification({
                type: 'Clear',
                code: 'StockdefinesCreate',
                description: '',
            }));
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stockdefines');
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
    async ({ data, history, redirectUrl }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.STOCKDEFINE, data);
            dispatch(fillStockdefinenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillStockdefinenotification({
                type: 'Clear',
                code: 'StockdefinesUpdate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Stockdefines');
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
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.STOCKDEFINE}/${data.Uuid}`);
            dispatch(fillStockdefinenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
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
        isDispatching: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedStockdefine: (state, action) => {
            state.selected_record = action.payload;
        },
        fillStockdefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeStockdefinenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
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
    handleSelectedStockdefine,
    fillStockdefinenotification,
    removeStockdefinenotification,
    handleDeletemodal
} = StockdefinesSlice.actions;

export default StockdefinesSlice.reducer;