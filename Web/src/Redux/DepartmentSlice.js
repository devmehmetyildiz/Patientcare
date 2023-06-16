import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.DEPARTMENT, data);
            dispatch(fillDepartmentnotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Departments');
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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.DEPARTMENT, data);
            dispatch(fillDepartmentnotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Departments');
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
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.DEPARTMENT}/${data.Uuid}`);
            dispatch(fillDepartmentnotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'Departman başarı ile Silindi',
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