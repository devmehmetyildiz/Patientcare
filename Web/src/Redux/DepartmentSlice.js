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
        en: 'Department added successfully',
        tr: 'Departman Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Department updated successfully',
        tr: 'Departman Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Department Deleted successfully',
        tr: 'Departman Başarı ile Silindi'
    },
}

export const GetDepartments = createAsyncThunk(
    'Departments/GetDepartments',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.DEPARTMENT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillDepartmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetDepartment = createAsyncThunk(
    'Departments/GetDepartment',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.DEPARTMENT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillDepartmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddDepartments = createAsyncThunk(
    'Departments/AddDepartments',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.DEPARTMENT, data);
            dispatch(fillDepartmentnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            dispatch(fillDepartmentnotification({
                type: 'Clear',
                code: 'DepartmentsCreate',
                description: '',
            }));
            clearForm && clearForm('DepartmentsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Departments');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillDepartmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRecordDepartments = createAsyncThunk(
    'Departments/AddRecordDepartments',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.DEPARTMENT + '/AddRecord', data);
            dispatch(fillDepartmentnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('DepartmentsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Departments');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillDepartmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditDepartments = createAsyncThunk(
    'Departments/EditDepartments',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.DEPARTMENT, data);
            dispatch(fillDepartmentnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('DepartmentsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Departments');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillDepartmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteDepartments = createAsyncThunk(
    'Departments/DeleteDepartments',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.DEPARTMENT}/${data.Uuid}`);
            dispatch(fillDepartmentnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillDepartmentnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DepartmentsSlice = createSlice({
    name: 'Departments',
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
        handleSelectedDepartment: (state, action) => {
            state.selected_record = action.payload;
        },
        fillDepartmentnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeDepartmentnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetDepartments.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetDepartments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetDepartments.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetDepartment.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetDepartment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetDepartment.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddDepartments.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddDepartments.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddDepartments.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRecordDepartments.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRecordDepartments.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRecordDepartments.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditDepartments.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditDepartments.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditDepartments.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteDepartments.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteDepartments.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteDepartments.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedDepartment,
    fillDepartmentnotification,
    removeDepartmentnotification,
    handleDeletemodal
} = DepartmentsSlice.actions;

export default DepartmentsSlice.reducer;