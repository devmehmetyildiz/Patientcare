import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "../Actions/axios";
import config from "../../Config";

export const GetRoles = createAsyncThunk(
    'Roles/GetRoles',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.ROLE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRolenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetRole = createAsyncThunk(
    'Roles/GetRole',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, `${ROUTES.ROLE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRolenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPrivileges = createAsyncThunk(
    'Roles/GetPrivileges',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.ROLE + `/Getprivileges`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRolenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetPrivilegegroups = createAsyncThunk(
    'Roles/GetPrivilegegroups',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.ROLE + `/Getprivilegegroups`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRolenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRoles = createAsyncThunk(
    'Roles/AddRoles',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Userrole, ROUTES.ROLE, data);
            dispatch(fillRolenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Roles');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRolenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditRoles = createAsyncThunk(
    'Roles/EditRoles',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Userrole, ROUTES.ROLE, data);
            dispatch(fillRolenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Roles');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRolenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteRoles = createAsyncThunk(
    'Roles/DeleteRoles',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Userrole, `${ROUTES.ROLE}/${data.Uuid}`);
            dispatch(fillRolenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRolenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const RolesSlice = createSlice({
    name: 'Roles',
    initialState: {
        list: [],
        selected_record: {},
        privileges: [],
        privilegegroups: [],
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedRole: (state) => {
            state.selected_record = {};
        },
        fillRolenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeRolenotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetRoles.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetRoles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetRoles.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetRole.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetRole.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPrivileges.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.privileges = [];
            })
            .addCase(GetPrivileges.fulfilled, (state, action) => {
                state.isLoading = false;
                state.privileges = action.payload;
            })
            .addCase(GetPrivileges.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetPrivilegegroups.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.privilegegroups = [];
            })
            .addCase(GetPrivilegegroups.fulfilled, (state, action) => {
                state.isLoading = false;
                state.privilegegroups = action.payload;
            })
            .addCase(GetPrivilegegroups.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRoles.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddRoles.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddRoles.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditRoles.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditRoles.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditRoles.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteRoles.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteRoles.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteRoles.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedRole,
    fillRolenotification,
    removeRolenotification,
} = RolesSlice.actions;

export default RolesSlice.reducer;