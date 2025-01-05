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
        en: 'Stock type added successfully',
        tr: 'Stok türü Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Stock type updated successfully',
        tr: 'Stok türü Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Stock type Deleted successfully',
        tr: 'Stok türü Başarı ile Silindi'
    },
}

export const GetStocktypes = createAsyncThunk(
    'Stocktypes/GetStocktypes',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.STOCKTYPE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetStocktype = createAsyncThunk(
    'Stocktypes/GetStocktype',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.STOCKTYPE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddStocktypes = createAsyncThunk(
    'Stocktypes/AddStocktypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCKTYPE, data);
            dispatch(fillStocktypenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('StocktypesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stocktypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditStocktypes = createAsyncThunk(
    'Stocktypes/EditStocktypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.STOCKTYPE, data);
            dispatch(fillStocktypenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('StocktypesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stocktypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteStocktypes = createAsyncThunk(
    'Stocktypes/DeleteStocktypes',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.STOCKTYPE}/${data.Uuid}`);
            dispatch(fillStocktypenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypenotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const StocktypesSlice = createSlice({
    name: 'Stocktypes',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
    },
    reducers: {
        handleSelectedStocktype: (state, action) => {
            state.selected_record = action.payload;
        },
        fillStocktypenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeStocktypenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetStocktypes.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
            })
            .addCase(GetStocktypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetStocktypes.rejected, (state, action) => {
                state.list = [];
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetStocktype.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetStocktype.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetStocktype.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddStocktypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddStocktypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddStocktypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditStocktypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditStocktypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditStocktypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteStocktypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteStocktypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteStocktypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedStocktype,
    fillStocktypenotification,
    removeStocktypenotification,
    handleDeletemodal,
} = StocktypesSlice.actions;

export default StocktypesSlice.reducer;