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
        en: 'Company cash movement added successfully',
        tr: 'Kurum Para Harekti Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Company cash movement updated successfully',
        tr: 'Kurum Para Harekti Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Company cash movement Deleted successfully',
        tr: 'Kurum Para Harekti Başarı ile Silindi'
    },
}

export const GetCompanycashmovements = createAsyncThunk(
    'Companycashmovements/GetCompanycashmovements',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.COMPANYCASHMOVEMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCompanycashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetCompanycashmovement = createAsyncThunk(
    'Companycashmovements/GetCompanycashmovement',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.COMPANYCASHMOVEMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCompanycashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddCompanycashmovements = createAsyncThunk(
    'Companycashmovements/AddCompanycashmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.COMPANYCASHMOVEMENT, data);
            dispatch(fillCompanycashmovementnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('CompanycashmovementsCreate')
            closeModal && closeModal()
            history && (redirectUrl === 'GoBack' ? history.goBack() : history.push(redirectUrl ? redirectUrl : '/Companycashmovements'));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCompanycashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditCompanycashmovements = createAsyncThunk(
    'Companycashmovements/EditCompanycashmovements',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.COMPANYCASHMOVEMENT, data);
            dispatch(fillCompanycashmovementnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillCompanycashmovementnotification({
                type: 'Clear',
                code: 'CompanycashmovementsUpdate',
                description: '',
            }));
            history && history.push(redirectUrl ? redirectUrl : '/Companycashmovements');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCompanycashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteCompanycashmovements = createAsyncThunk(
    'Companycashmovements/DeleteCompanycashmovements',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.COMPANYCASHMOVEMENT}/${data.Uuid}`);
            dispatch(fillCompanycashmovementnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCompanycashmovementnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompanycashmovementsSlice = createSlice({
    name: 'Companycashmovements',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedCompanycashmovement: (state, action) => {
            state.selected_record = action.payload;
        },
        fillCompanycashmovementnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeCompanycashmovementnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCompanycashmovements.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetCompanycashmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetCompanycashmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetCompanycashmovement.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetCompanycashmovement.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetCompanycashmovement.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddCompanycashmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddCompanycashmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddCompanycashmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditCompanycashmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditCompanycashmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditCompanycashmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteCompanycashmovements.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteCompanycashmovements.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteCompanycashmovements.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedCompanycashmovement,
    fillCompanycashmovementnotification,
    removeCompanycashmovementnotification,
    handleDeletemodal
} = CompanycashmovementsSlice.actions;

export default CompanycashmovementsSlice.reducer;