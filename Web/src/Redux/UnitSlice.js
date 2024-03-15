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
        en: 'Unit added successfully',
        tr: 'Birim Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Unit updated successfully',
        tr: 'Birim Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Unit Deleted successfully',
        tr: 'Birim Başarı ile Silindi'
    },
}

export const GetUnits = createAsyncThunk(
    'Units/GetUnits',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.UNIT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUnit = createAsyncThunk(
    'Units/GetUnit',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.UNIT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddUnits = createAsyncThunk(
    'Units/AddUnits',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.UNIT, data);
            dispatch(fillUnitnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('UnitsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Units');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordUnits = createAsyncThunk(
    'Units/AddRecordUnits',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.UNIT + '/AddRecord', data);
            dispatch(fillUnitnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('UnitsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Units');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUnits = createAsyncThunk(
    'Units/EditUnits',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.UNIT, data);
            dispatch(fillUnitnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('UnitsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Units');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteUnits = createAsyncThunk(
    'Units/DeleteUnits',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.UNIT}/${data.Uuid}`);
            dispatch(fillUnitnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const UnitsSlice = createSlice({
    name: 'Units',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedUnit: (state, action) => {
            state.selected_record = action.payload;
        },
        fillUnitnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeUnitnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetUnits.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUnit.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetUnit.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetUnit.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddUnits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordUnits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddRecordUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddRecordUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUnits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUnits.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedUnit,
    fillUnitnotification,
    removeUnitnotification,
    handleDeletemodal
} = UnitsSlice.actions;

export default UnitsSlice.reducer;