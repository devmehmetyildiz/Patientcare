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
        en: 'Personelshiftdetail added successfully',
        tr: 'Personel Vardiya Detayı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Personelshiftdetail updated successfully',
        tr: 'Personel Vardiya Detayı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Personelshiftdetail Deleted successfully',
        tr: 'Personel Vardiya Detayı Başarı ile Silindi'
    },
}

export const GetPersonelshiftdetails = createAsyncThunk(
    'Personelshiftdetails/GetPersonelshiftdetails',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.PERSONELSHIFTDETAIL);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftdetailnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPersonelshiftdetail = createAsyncThunk(
    'Personelshiftdetails/GetPersonelshiftdetail',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.PERSONELSHIFTDETAIL}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftdetailnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPersonelshiftdetails = createAsyncThunk(
    'Personelshiftdetails/AddPersonelshiftdetails',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.PERSONELSHIFTDETAIL, data);
            dispatch(fillPersonelshiftdetailnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('PersonelshiftdetailsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Personelshiftdetails');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftdetailnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPersonelshiftdetails = createAsyncThunk(
    'Personelshiftdetails/EditPersonelshiftdetails',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.PERSONELSHIFTDETAIL, data);
            dispatch(fillPersonelshiftdetailnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            closeModal && closeModal()
            clearForm && clearForm('PersonelshiftdetailsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Personelshiftdetails');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftdetailnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePersonelshiftdetails = createAsyncThunk(
    'Personelshiftdetails/DeletePersonelshiftdetails',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.PERSONELSHIFTDETAIL}/${data.Uuid}`);
            dispatch(fillPersonelshiftdetailnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftdetailnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PersonelshiftdetailsSlice = createSlice({
    name: 'Personelshiftdetails',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedPersonelshiftdetail: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPersonelshiftdetailnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePersonelshiftdetailnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPersonelshiftdetails.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPersonelshiftdetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPersonelshiftdetails.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPersonelshiftdetail.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPersonelshiftdetail.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPersonelshiftdetail.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPersonelshiftdetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPersonelshiftdetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPersonelshiftdetails.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPersonelshiftdetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPersonelshiftdetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPersonelshiftdetails.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePersonelshiftdetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePersonelshiftdetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePersonelshiftdetails.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPersonelshiftdetail,
    fillPersonelshiftdetailnotification,
    removePersonelshiftdetailnotification,
    handleDeletemodal
} = PersonelshiftdetailsSlice.actions;

export default PersonelshiftdetailsSlice.reducer;