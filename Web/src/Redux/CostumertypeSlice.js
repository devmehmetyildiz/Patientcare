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
        en: 'Costumer type added successfully',
        tr: 'Müşteri Türü Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Costumer type updated successfully',
        tr: 'Müşteri Türü Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Costumer type Deleted successfully',
        tr: 'Müşteri Türü Başarı ile Silindi'
    },
}


export const GetCostumertypes = createAsyncThunk(
    'Costumertypes/GetCostumertypes',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.COSTUMERTYPE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCostumertypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetCostumertype = createAsyncThunk(
    'Costumertypes/GetCostumertype',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.COSTUMERTYPE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCostumertypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddCostumertypes = createAsyncThunk(
    'Costumertypes/AddCostumertypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.COSTUMERTYPE, data);
            dispatch(fillCostumertypenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            dispatch(fillCostumertypenotification({
                type: 'Clear',
                code: 'CostumerypesCreate',
                description: '',
            }));
            clearForm && clearForm('CostumerypesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Costumertypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCostumertypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordCostumertypes = createAsyncThunk(
    'Costumertypes/AddRecordCostumertypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.COSTUMERTYPE + '/AddRecord', data);
            dispatch(fillCostumertypenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('CostumerypesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Costumertypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCostumertypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditCostumertypes = createAsyncThunk(
    'Costumertypes/EditCostumertypes',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.COSTUMERTYPE, data);
            dispatch(fillCostumertypenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('CostumertypesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Costumertypes');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCostumertypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteCostumertypes = createAsyncThunk(
    'Costumertypes/DeleteCostumertypes',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.COSTUMERTYPE}/${data.Uuid}`);
            dispatch(fillCostumertypenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCostumertypenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CostumertypesSlice = createSlice({
    name: 'Costumertypes',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedCostumertype: (state, action) => {
            state.selected_record = action.payload;
        },
        fillCostumertypenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeCostumertypenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCostumertypes.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetCostumertypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetCostumertypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetCostumertype.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetCostumertype.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetCostumertype.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddCostumertypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddCostumertypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddCostumertypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordCostumertypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddRecordCostumertypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddRecordCostumertypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditCostumertypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditCostumertypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditCostumertypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteCostumertypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteCostumertypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteCostumertypes.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedCostumertype,
    fillCostumertypenotification,
    removeCostumertypenotification,
    handleDeletemodal
} = CostumertypesSlice.actions;

export default CostumertypesSlice.reducer;