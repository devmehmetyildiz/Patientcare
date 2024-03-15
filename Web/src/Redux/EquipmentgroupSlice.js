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
        en: 'Equipment group added successfully',
        tr: 'Ekipman Grubu Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Equipment group updated successfully',
        tr: 'Ekipman Grubu Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Equipment group Deleted successfully',
        tr: 'Ekipman Grubu Başarı ile Silindi'
    },
}

export const GetEquipmentgroups = createAsyncThunk(
    'Equipmentgroups/GetEquipmentgroups',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, ROUTES.EQUIPMENTGROUP);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentgroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetEquipmentgroup = createAsyncThunk(
    'Equipmentgroups/GetEquipmentgroup',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Warehouse, `${ROUTES.EQUIPMENTGROUP}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentgroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddEquipmentgroups = createAsyncThunk(
    'Equipmentgroups/AddEquipmentgroups',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Warehouse, ROUTES.EQUIPMENTGROUP, data);
            dispatch(fillEquipmentgroupnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('EquipmentgroupsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Equipmentgroups');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentgroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditEquipmentgroups = createAsyncThunk(
    'Equipmentgroups/EditEquipmentgroups',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Warehouse, ROUTES.EQUIPMENTGROUP, data);
            dispatch(fillEquipmentgroupnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('EquipmentgroupsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Equipmentgroups');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentgroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteEquipmentgroups = createAsyncThunk(
    'Equipmentgroups/DeleteEquipmentgroups',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Warehouse, `${ROUTES.EQUIPMENTGROUP}/${data.Uuid}`);
            dispatch(fillEquipmentgroupnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillEquipmentgroupnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EquipmentgroupsSlice = createSlice({
    name: 'Equipmentgroups',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedEquipmentgroup: (state, action) => {
            state.selected_record = action.payload;
        },
        fillEquipmentgroupnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeEquipmentgroupnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetEquipmentgroups.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetEquipmentgroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetEquipmentgroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetEquipmentgroup.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetEquipmentgroup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetEquipmentgroup.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddEquipmentgroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddEquipmentgroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddEquipmentgroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditEquipmentgroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditEquipmentgroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditEquipmentgroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteEquipmentgroups.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteEquipmentgroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteEquipmentgroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedEquipmentgroup,
    fillEquipmentgroupnotification,
    removeEquipmentgroupnotification,
    handleDeletemodal
} = EquipmentgroupsSlice.actions;

export default EquipmentgroupsSlice.reducer;