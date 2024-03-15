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
        en: 'Role added successfully',
        tr: 'Rol Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Role updated successfully',
        tr: 'Rol Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Role Deleted successfully',
        tr: 'Rol Başarı ile Silindi'
    },
}


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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Userrole, ROUTES.ROLE, data);
            dispatch(fillRolenotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('RolesCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Roles');
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
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Userrole, ROUTES.ROLE, data);
            dispatch(fillRolenotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('RolesUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Roles');
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
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Userrole, `${ROUTES.ROLE}/${data.Uuid}`);
            dispatch(fillRolenotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
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
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedRole: (state, action) => {
            state.selected_record = action.payload;
        },
        fillRolenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeRolenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
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
                state.isLoading = true;
            })
            .addCase(AddRoles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddRoles.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditRoles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditRoles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditRoles.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteRoles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteRoles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteRoles.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedRole,
    fillRolenotification,
    removeRolenotification,
    handleDeletemodal
} = RolesSlice.actions;

export default RolesSlice.reducer;