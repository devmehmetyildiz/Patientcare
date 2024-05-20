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
    fastcreatecode: {
        en: 'Fast Create',
        tr: 'Hızlı Oluşturma'
    },
    adddescription: {
        en: 'Personelshift added successfully',
        tr: 'Personel Vardiyası Başarı ile eklendi'
    },
    fastcreatedescription: {
        en: 'Fast create completed',
        tr: 'Hızlı oluşturma tamamlandı'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Personelshift updated successfully',
        tr: 'Personel Vardiyası Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Personelshift Deleted successfully',
        tr: 'Personel Vardiyası Başarı ile Silindi'
    },
}

export const GetPersonelshifts = createAsyncThunk(
    'Personelshifts/GetPersonelshifts',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PERSONELSHIFT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPersonelshift = createAsyncThunk(
    'Personelshifts/GetPersonelshift',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PERSONELSHIFT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddPersonelshifts = createAsyncThunk(
    'Personelshifts/AddPersonelshifts',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PERSONELSHIFT, data);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('PersonelshiftsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Personelshifts');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditPersonelshifts = createAsyncThunk(
    'Personelshifts/EditPersonelshifts',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PERSONELSHIFT, data);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            closeModal && closeModal()
            clearForm && clearForm('PersonelshiftsUpdate')
            history && history.push(redirectUrl ? redirectUrl : '/Personelshifts');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovePersonelshifts = createAsyncThunk(
    'Personelshifts/ApprovePersonelshifts',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELSHIFT}/Approve/${data?.Uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CompletePersonelshifts = createAsyncThunk(
    'Personelshifts/CompletePersonelshifts',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELSHIFT}/Complete/${data?.Uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeactivePersonelshifts = createAsyncThunk(
    'Personelshifts/DeactivePersonelshifts',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, `${ROUTES.PERSONELSHIFT}/Deactive/${data?.Uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeletePersonelshifts = createAsyncThunk(
    'Personelshifts/DeletePersonelshifts',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PERSONELSHIFT}/${data.Uuid}`);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetfastcreatedPersonelshifts = createAsyncThunk(
    'Personelshifts/GetfastcreatedPersonelshifts',
    async ({ data }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PERSONELSHIFT + "/Getpeparedpersonelshift", data);
            dispatch(fillPersonelshiftnotification({
                type: 'Success',
                code: Literals.fastcreatecode[Language],
                description: Literals.fastcreatedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillPersonelshiftnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const PersonelshiftsSlice = createSlice({
    name: 'Personelshifts',
    initialState: {
        list: [],
        fastcreatedlist: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isFastcreatesuccess: false,
        isDeletemodalopen: false,
        isApprovemodalopen: false,
        isCompletemodalopen: false,
        isDeactivemodalopen: false,
    },
    reducers: {
        handleSelectedPersonelshift: (state, action) => {
            state.selected_record = action.payload;
        },
        fillPersonelshiftnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removePersonelshiftnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
        handleDeactivemodal: (state, action) => {
            state.isDeactivemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetPersonelshifts.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetPersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetfastcreatedPersonelshifts.pending, (state) => {
                state.isLoading = true;
                state.isFastcreatesuccess = false;
                state.errMsg = null;
                state.fastcreatedlist = [];
            })
            .addCase(GetfastcreatedPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isFastcreatesuccess = true;
                state.fastcreatedlist = action.payload;
            })
            .addCase(GetfastcreatedPersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.isFastcreatesuccess = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPersonelshift.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetPersonelshift.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetPersonelshift.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddPersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddPersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditPersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditPersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditPersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(CompletePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(CompletePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(CompletePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeactivePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeactivePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeactivePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeletePersonelshifts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeletePersonelshifts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeletePersonelshifts.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedPersonelshift,
    fillPersonelshiftnotification,
    removePersonelshiftnotification,
    handleDeletemodal,
    handleApprovemodal,
    handleCompletemodal,
    handleDeactivemodal,
} = PersonelshiftsSlice.actions;

export default PersonelshiftsSlice.reducer;