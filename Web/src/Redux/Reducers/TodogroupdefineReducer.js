import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "../Actions/axios";
import config from "../../Config";

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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.TODOGROUPDEFINE, data);
            dispatch(fillTodogroupdefinenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Todogroupdefines');
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
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.TODOGROUPDEFINE, data);
            dispatch(fillTodogroupdefinenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Todogroupdefines');
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
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.TODOGROUPDEFINE}/${data.Uuid}`);
            dispatch(fillTodogroupdefinenotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
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
        isDispatching: false
    },
    reducers: {
        RemoveSelectedTodogroupdefine: (state) => {
            state.selected_record = {};
        },
        fillTodogroupdefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeTodogroupdefinenotification: (state) => {
            state.notifications.splice(0, 1);
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
    RemoveSelectedTodogroupdefine,
    fillTodogroupdefinenotification,
    removeTodogroupdefinenotification,
} = TodogroupdefinesSlice.actions;

export default TodogroupdefinesSlice.reducer;