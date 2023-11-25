import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import notification from '../Utils/Notification';

const Literals = {
    addcode: {
        en: 'Data Save',
        tr: 'Veri Kaydetme'
    },
    adddescription: {
        en: 'Personel added successfully',
        tr: 'Çalışan Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Personel updated successfully',
        tr: 'Çalışan Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Personel Deleted successfully',
        tr: 'Çalışan Başarı ile Silindi'
    },
}

export const GetPersonels = createAsyncThunk(
    'Personels/GetPersonels',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PERSONEL);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPersonel = createAsyncThunk(
    'Personels/GetPersonel',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PERSONEL}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPersonels = createAsyncThunk(
    'Personels/AddPersonels',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PERSONEL, data);
            dispatch(fillPersonelnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('PersonelsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Personels');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordPersonels = createAsyncThunk(
    'Personels/AddRecordPersonels',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PERSONEL + '/Addrecord', data);
            dispatch(fillPersonelnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('PersonelsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Personels');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelnotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const EditPersonels = createAsyncThunk(
    'Personels/EditPersonels',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PERSONEL, data);
            dispatch(fillPersonelnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            closeModal && closeModal()
            clearForm && clearForm('PersonelsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Personels');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePersonels = createAsyncThunk(
    'Personels/DeletePersonels',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PERSONEL}/${data.Uuid}`);
            dispatch(fillPersonelnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PersonelsSlice = createSlice({
    name: 'Personels',
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
        handleSelectedPersonel: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPersonelnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePersonelnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPersonels.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPersonels.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPersonels.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPersonel.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPersonel.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPersonel.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPersonels.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddPersonels.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddPersonels.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordPersonels.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordPersonels.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordPersonels.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPersonels.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditPersonels.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditPersonels.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePersonels.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeletePersonels.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeletePersonels.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPersonel,
    fillPersonelnotification,
    removePersonelnotification,
    handleDeletemodal
} = PersonelsSlice.actions;

export default PersonelsSlice.reducer;