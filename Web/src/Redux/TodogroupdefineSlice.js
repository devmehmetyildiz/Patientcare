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
        en: 'Todo Group Define added successfully',
        tr: 'Yapılacak Grup Tanımı Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Todo Group Define updated successfully',
        tr: 'Yapılacak Grup Tanımı Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Todo Group Define Deleted successfully',
        tr: 'Yapılacak Grup Tanımı Başarı ile Silindi'
    },
}

export const GetTodogroupdefines = createAsyncThunk(
    'Todogroupdefines/GetTodogroupdefines',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.TODOGROUPDEFINE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodogroupdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetTodogroupdefine = createAsyncThunk(
    'Todogroupdefines/GetTodogroupdefine',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.TODOGROUPDEFINE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodogroupdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddTodogroupdefines = createAsyncThunk(
    'Todogroupdefines/AddTodogroupdefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.TODOGROUPDEFINE, data);
            dispatch(fillTodogroupdefinenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('TodogroupdefinesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Todogroupdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodogroupdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordTodogroupdefines = createAsyncThunk(
    'Todogroupdefines/AddRecordTodogroupdefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.TODOGROUPDEFINE + '/AddRecord', data);
            dispatch(fillTodogroupdefinenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('TodogroupdefinesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Todogroupdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodogroupdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditTodogroupdefines = createAsyncThunk(
    'Todogroupdefines/EditTodogroupdefines',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.TODOGROUPDEFINE, data);
            dispatch(fillTodogroupdefinenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('TodogroupdefinesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Todogroupdefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodogroupdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteTodogroupdefines = createAsyncThunk(
    'Todogroupdefines/DeleteTodogroupdefines',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.TODOGROUPDEFINE}/${data.Uuid}`);
            dispatch(fillTodogroupdefinenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodogroupdefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const TodogroupdefinesSlice = createSlice({
    name: 'Todogroupdefines',
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
        handleSelectedTodogroupdefine: (state, action) => {
            state.selected_record = action.payload;
        },
        fillTodogroupdefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeTodogroupdefinenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetTodogroupdefines.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetTodogroupdefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetTodogroupdefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetTodogroupdefine.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetTodogroupdefine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetTodogroupdefine.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddTodogroupdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddTodogroupdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddTodogroupdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordTodogroupdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordTodogroupdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordTodogroupdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditTodogroupdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditTodogroupdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditTodogroupdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteTodogroupdefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteTodogroupdefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteTodogroupdefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedTodogroupdefine,
    fillTodogroupdefinenotification,
    removeTodogroupdefinenotification,
    handleDeletemodal
} = TodogroupdefinesSlice.actions;

export default TodogroupdefinesSlice.reducer;