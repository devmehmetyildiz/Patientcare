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
        en: 'Equipment added successfully',
        tr: 'Ekipman Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Equipment updated successfully',
        tr: 'Ekipman Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Equipment Deleted successfully',
        tr: 'Ekipman Başarı ile Silindi'
    },
}

export const GetEquipments = createAsyncThunk(
    'Equipments/GetEquipments',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.EQUIPMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetEquipment = createAsyncThunk(
    'Equipments/GetEquipment',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.EQUIPMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddEquipments = createAsyncThunk(
    'Equipments/AddEquipments',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.EQUIPMENT, data);
            dispatch(fillEquipmentnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('EquipmentsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Equipments');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditEquipments = createAsyncThunk(
    'Equipments/EditEquipments',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.EQUIPMENT, data);
            dispatch(fillEquipmentnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('EquipmentsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Equipments');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteEquipments = createAsyncThunk(
    'Equipments/DeleteEquipments',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.EQUIPMENT}/${data.Uuid}`);
            dispatch(fillEquipmentnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EquipmentsSlice = createSlice({
    name: 'Equipments',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedEquipment: (state, action) => {
            state.selected_record = action.payload;
        },
        fillEquipmentnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeEquipmentnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetEquipments.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetEquipments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetEquipments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetEquipment.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetEquipment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetEquipment.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddEquipments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddEquipments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddEquipments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditEquipments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditEquipments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditEquipments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteEquipments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteEquipments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteEquipments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedEquipment,
    fillEquipmentnotification,
    removeEquipmentnotification,
    handleDeletemodal
} = EquipmentsSlice.actions;

export default EquipmentsSlice.reducer;