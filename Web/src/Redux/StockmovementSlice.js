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
        en: 'Stock movement added successfully',
        tr: 'Stok Hareketi Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Stock movement updated successfully',
        tr: 'Stok Hareketi Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Stock movement Deleted successfully',
        tr: 'Stok Hareketi Başarı ile Silindi'
    },
    approvedescription: {
        en: 'Stock movement approved successfully',
        tr: 'Stok Hareketi Başarı ile Onaylandı'
    },
}

export const GetStockmovements = createAsyncThunk(
    'Stockmovements/GetStockmovements',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.STOCKMOVEMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetStockmovement = createAsyncThunk(
    'Stockmovements/GetStockmovement',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.STOCKMOVEMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddStockmovements = createAsyncThunk(
    'Stockmovements/AddStockmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.STOCKMOVEMENT, data);
            dispatch(fillStockmovementnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('StockmovementsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stockmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditStockmovements = createAsyncThunk(
    'Stockmovements/EditStockmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.STOCKMOVEMENT, data);
            dispatch(fillStockmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('StockmovementsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Stockmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteStockmovements = createAsyncThunk(
    'Stockmovements/DeleteStockmovements',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.STOCKMOVEMENT}/${data.Uuid}`);
            dispatch(fillStockmovementnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveStockmovements = createAsyncThunk(
    'Stockmovements/ApproveStockmovements',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.STOCKMOVEMENT}/Approve/${data.Uuid}`);
            dispatch(fillStockmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovemultipleStockmovements = createAsyncThunk(
    'Stockmovements/ApprovemultipleStockmovements',
    async (data, { dispatch, getState }) => {
        try {
            
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, `${ROUTES.STOCKMOVEMENT}/Approve`, data);
            dispatch(fillStockmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStockmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const StockmovementsSlice = createSlice({
    name: 'Stockmovements',
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
        handleSelectedStockmovement: (state, action) => {
            state.selected_record = action.payload;
        },
        fillStockmovementnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeStockmovementnotification: (state) => {
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
            .addCase(GetStockmovements.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetStockmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetStockmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetStockmovement.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetStockmovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetStockmovement.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddStockmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddStockmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddStockmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditStockmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditStockmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditStockmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveStockmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(ApproveStockmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(ApproveStockmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovemultipleStockmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(ApprovemultipleStockmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(ApprovemultipleStockmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteStockmovements.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteStockmovements.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteStockmovements.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedStockmovement,
    fillStockmovementnotification,
    removeStockmovementnotification,
    handleDeletemodal,
    handleApprovemodal
} = StockmovementsSlice.actions;

export default StockmovementsSlice.reducer;