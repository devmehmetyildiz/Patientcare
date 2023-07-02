import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";
import Cookies from 'universal-cookie';

export const logIn = createAsyncThunk(
    'Profile/logIn',
    async ({ data, history, redirectUrl }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Auth, `Oauth/Login`, data);
            const localcookies = new Cookies();
            localcookies.set('patientcare', response.data.accessToken, { path: '/' })
            dispatch(fillnotification({
                type: 'Success',
                code: 'Elder Camp',
                description: 'Elder camp giriş yapıldı',
            }));
            redirectUrl ? window.location = (redirectUrl) : window.location = ('Home')
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const register = createAsyncThunk(
    'Profile/register',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Userrole, 'Users/Register', data);
            dispatch(fillnotification({
                type: 'Success',
                code: 'Elder Camp',
                description: 'Admin kullanıcı oluşturuldu.',
            }));
            history.push("/Login")
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetActiveUser = createAsyncThunk(
    'Profile/GetActiveUser',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, 'Users/GetActiveUsername');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUserMeta = createAsyncThunk(
    'Profile/GetUserMeta',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, 'Users/GetActiveUserMeta');
            console.log('response.data: ', response.data);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUserRoles = createAsyncThunk(
    'Profile/GetUserRoles',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, 'Roles/GetActiveuserprivileges');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetTableMeta = createAsyncThunk(
    'Profile/GetTableMeta',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Userrole, ROUTES.USER + '/GetTableMeta');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const SaveTableMeta = createAsyncThunk(
    'Profile/SaveTableMeta',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Userrole, ROUTES.USER + '/SaveTableMeta', data);
            dispatch(fillnotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Tablo Ayarı Güncellendi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const Createpasswordforget = createAsyncThunk(
    'Profile/Createpasswordforget',
    async ({ email }, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Auth, 'Password/Createrequest/' + email);
            dispatch(fillnotification({
                type: 'Success',
                code: 'Elder Camp',
                description: 'Parola Sıfırlama Talebiniz alınmıştır. Lütfen mail adresinizi kontrol ediniz',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ProfileSlice = createSlice({
    name: 'Profile',
    initialState: {
        changePassword: false,
        isLogging: false,
        user: null,
        errMsg: null,
        isDispatching: false,
        notifications: [],
        meta: {},
        username: "",
        roles: [],
        auth: false,
        tablemeta: [],
        Language: "tr",
        resetpasswordStatus: false,
        passwordrequestsended: false
    },
    reducers: {
        fillnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        logOut: () => {
            const localcookies = new Cookies();
            localcookies.remove('patientcare')
            window.location = '/Login'
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logIn.pending, (state) => {
                state.isLogging = true;
                state.errMsg = null;
            })
            .addCase(logIn.fulfilled, (state, action) => {
                state.isLogging = false;
            })
            .addCase(logIn.rejected, (state, action) => {
                state.isLogging = false;
                state.errMsg = action.error.message;
            })
            .addCase(register.pending, (state) => {
                state.isLogging = true;
                state.errMsg = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLogging = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLogging = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetActiveUser.pending, (state) => {
                state.isLogging = true;
                state.errMsg = null;
            })
            .addCase(GetActiveUser.fulfilled, (state, action) => {
                state.isLogging = false;
                state.username = action.payload
            })
            .addCase(GetActiveUser.rejected, (state, action) => {
                state.isLogging = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUserRoles.pending, (state) => {
                state.isLogging = true;
                state.errMsg = null;
            })
            .addCase(GetUserRoles.fulfilled, (state, action) => {
                state.isLogging = false;
                state.roles = action.payload
            })
            .addCase(GetUserRoles.rejected, (state, action) => {
                state.isLogging = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetTableMeta.pending, (state) => {
                state.isLogging = true;
                state.errMsg = null;
            })
            .addCase(GetTableMeta.fulfilled, (state, action) => {
                state.isLogging = false;
                state.tablemeta = action.payload
            })
            .addCase(GetTableMeta.rejected, (state, action) => {
                state.isLogging = false;
                state.errMsg = action.error.message;
            })
            .addCase(SaveTableMeta.pending, (state) => {
                state.isLogging = true;
                state.errMsg = null;
            })
            .addCase(SaveTableMeta.fulfilled, (state, action) => {
                state.isLogging = false;
                state.tablemeta = action.payload
            })
            .addCase(SaveTableMeta.rejected, (state, action) => {
                state.isLogging = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUserMeta.pending, (state) => {
                state.isLogging = true;
                state.errMsg = null;
            })
            .addCase(GetUserMeta.fulfilled, (state, action) => {
                state.isLogging = false;
                let Language = "tr"
                if (action.payload && action.payload.Language) {
                    Language = action.payload.Language.toLowerCase()
                }
                state.meta = action.payload
                state.Language = Language
            })
            .addCase(GetUserMeta.rejected, (state, action) => {
                state.isLogging = false;
                state.errMsg = action.error.message;
            })
            .addCase(Createpasswordforget.pending, (state) => {
                state.isLogging = true;
                state.passwordrequestsended = false;
                state.errMsg = null;
            })
            .addCase(Createpasswordforget.fulfilled, (state, action) => {
                state.isLogging = false;
                state.passwordrequestsended = true;
            })
            .addCase(Createpasswordforget.rejected, (state, action) => {
                state.isLogging = false;
                state.passwordrequestsended = false;
                state.errMsg = action.error.message;
            })

    },
});

export const {
    fillnotification,
    removenotification,
    logOut
} = ProfileSlice.actions;

export default ProfileSlice.reducer;