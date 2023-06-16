import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.COSTUMERTYPE, data);
            dispatch(fillCostumertypenotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'Müşteri türü başarı ile Eklendi',
            }));
            history.push('/Costumertypes');
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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.COSTUMERTYPE, data);
            dispatch(fillCostumertypenotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Müşteri türü başarı ile Güncellendi',
            }));
            history.push('/Costumertypes');
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
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.COSTUMERTYPE}/${data.Uuid}`);
            dispatch(fillCostumertypenotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'Müşteri türü başarı ile Silindi',
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
        isDispatching: false,
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
                state.isDispatching = true;
            })
            .addCase(AddCostumertypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddCostumertypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditCostumertypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditCostumertypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditCostumertypes.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteCostumertypes.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteCostumertypes.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteCostumertypes.rejected, (state, action) => {
                state.isDispatching = false;
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