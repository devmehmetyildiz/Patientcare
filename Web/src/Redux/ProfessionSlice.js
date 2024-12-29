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
        en: 'Profession added successfully',
        tr: 'Meslek Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Profession updated successfully',
        tr: 'Meslek Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Profession Deleted successfully',
        tr: 'Meslek Başarı ile Silindi'
    },
    approvedescription: {
        en: 'Profession approved successfully',
        tr: 'Meslek Başarı ile Onaylandı'
    },
}

export const GetProfessions = createAsyncThunk(
    'Professions/GetProfessions',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.PROFESSION);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetProfession = createAsyncThunk(
    'Professions/GetProfession',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.PROFESSION}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddProfessions = createAsyncThunk(
    'Professions/AddProfessions',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.PROFESSION, data);
            dispatch(fillProfessionnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('ProfessionsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Professions');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditProfessions = createAsyncThunk(
    'Professions/EditProfessions',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.PROFESSION, data);
            dispatch(fillProfessionnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('ProfessionsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Professions');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionnotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const ApproveProfessions = createAsyncThunk(
    'Professions/ApproveProfessions',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, `${ROUTES.PROFESSION}/Approve/${data.Uuid}`);
            dispatch(fillProfessionnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.approvedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionnotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const DeleteProfessions = createAsyncThunk(
    'Professions/DeleteProfessions',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.PROFESSION}/${data.Uuid}`);
            dispatch(fillProfessionnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillProfessionnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ProfessionsSlice = createSlice({
    name: 'Professions',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isCompletemodalopen: false,
        isApprovemodalopen: false
    },
    reducers: {
        handleSelectedProfession: (state, action) => {
            state.selected_record = action.payload;
        },
        fillProfessionnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeProfessionnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleCompletemodal: (state, action) => {
            state.isCompletemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetProfessions.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetProfessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetProfessions.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetProfession.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetProfession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetProfession.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddProfessions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddProfessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddProfessions.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditProfessions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditProfessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditProfessions.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveProfessions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveProfessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveProfessions.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteProfessions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteProfessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteProfessions.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedProfession,
    fillProfessionnotification,
    removeProfessionnotification,
    handleDeletemodal,
    handleCompletemodal,
    handleApprovemodal,
} = ProfessionsSlice.actions;

export default ProfessionsSlice.reducer;