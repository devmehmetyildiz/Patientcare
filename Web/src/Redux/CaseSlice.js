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
        en: 'Case added successfully',
        tr: 'Durum Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Case updated successfully',
        tr: 'Durum Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Case Deleted successfully',
        tr: 'Durum Başarı ile Silindi'
    },
}


export const GetCases = createAsyncThunk(
    'Cases/GetCases',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.CASE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetCase = createAsyncThunk(
    'Cases/GetCase',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.CASE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddCases = createAsyncThunk(
    'Cases/AddCases',
    async ({ data, history }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.CASE, data);
            dispatch(fillCasenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            dispatch(fillCasenotification({
                type: 'Clear',
                code: 'CasesCreate',
                description: '',
            }));
            history && history.push('/Cases');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordCases = createAsyncThunk(
    'Cases/AddRecordCases',
    async ({ data, history }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.CASE + '/AddRecord', data);
            dispatch(fillCasenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            history && history.push('/Cases');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditCases = createAsyncThunk(
    'Cases/EditCases',
    async ({ data, history }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.CASE, data);
            dispatch(fillCasenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            dispatch(fillCasenotification({
                type: 'Clear',
                code: 'CasesUpdate',
                description: '',
            }));
            history && history.push('/Cases');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteCases = createAsyncThunk(
    'Cases/DeleteCases',
    async (data, { dispatch, getState }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.CASE}/${data.Uuid}`);
            dispatch(fillCasenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillCasenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const CasesSlice = createSlice({
    name: 'Cases',
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
        handleSelectedCase: (state, action) => {
            state.selected_record = action.payload;
        },
        fillCasenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeCasenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetCases.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetCases.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetCases.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetCase.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetCase.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetCase.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteCases.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteCases.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteCases.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedCase,
    fillCasenotification,
    removeCasenotification,
    handleDeletemodal
} = CasesSlice.actions;

export default CasesSlice.reducer;