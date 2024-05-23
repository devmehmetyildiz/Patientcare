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
        en: 'Stock type group added successfully',
        tr: 'Stok tür grubu Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Stock type group updated successfully',
        tr: 'Stok tür grubu Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Stock type group Deleted successfully',
        tr: 'Stok tür grubu Başarı ile Silindi'
    },
    approvedescription: {
        en: 'Stock type group approved successfully',
        tr: 'Stok tür grubu Başarı ile Onaylandı'
    },
}

export const GetStocktypegroups = createAsyncThunk(
    'Stocktypegroups/GetStocktypegroups',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.STOCKTYPEGROUP);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypegroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetStocktypegroup = createAsyncThunk(
    'Stocktypegroups/GetStocktypegroup',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.STOCKTYPEGROUP}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypegroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddStocktypegroups = createAsyncThunk(
    'Stocktypegroups/AddStocktypegroups',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCKTYPEGROUP, data);
            dispatch(fillStocktypegroupnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('StocktypegroupsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stocktypegroups');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypegroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditStocktypegroups = createAsyncThunk(
    'Stocktypegroups/EditStocktypegroups',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.STOCKTYPEGROUP, data);
            dispatch(fillStocktypegroupnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('StocktypegroupsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stocktypegroups');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypegroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteStocktypegroups = createAsyncThunk(
    'Stocktypegroups/DeleteStocktypegroups',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.STOCKTYPEGROUP}/${data.Uuid}`);
            dispatch(fillStocktypegroupnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStocktypegroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const StocktypegroupsSlice = createSlice({
    name: 'Stocktypegroups',
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
        handleSelectedStocktypegroup: (state, action) => {
            state.selected_record = action.payload;
        },
        fillStocktypegroupnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeStocktypegroupnotification: (state) => {
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
            .addCase(GetStocktypegroups.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetStocktypegroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetStocktypegroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetStocktypegroup.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetStocktypegroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetStocktypegroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddStocktypegroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddStocktypegroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddStocktypegroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditStocktypegroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditStocktypegroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditStocktypegroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteStocktypegroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteStocktypegroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteStocktypegroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedStocktypegroup,
    fillStocktypegroupnotification,
    removeStocktypegroupnotification,
    handleDeletemodal,
    handleApprovemodal
} = StocktypegroupsSlice.actions;

export default StocktypegroupsSlice.reducer;