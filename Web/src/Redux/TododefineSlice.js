import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetTododefines = createAsyncThunk(
    'Tododefines/GetTododefines',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.TODODEFINE);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTododefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetTododefine = createAsyncThunk(
    'Tododefines/GetTododefine',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.TODODEFINE}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTododefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddTododefines = createAsyncThunk(
    'Tododefines/AddTododefines',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.TODODEFINE, data);
            dispatch(fillTododefinenotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'Yapılacaklar tanımı başarı ile Eklendi',
            }));
            history.push('/Tododefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTododefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditTododefines = createAsyncThunk(
    'Tododefines/EditTododefines',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.TODODEFINE, data);
            dispatch(fillTododefinenotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'Yapılacaklar tanımı başarı ile Güncellendi',
            }));
            history.push('/Tododefines');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTododefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteTododefines = createAsyncThunk(
    'Tododefines/DeleteTododefines',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.TODODEFINE}/${data.Uuid}`);
            dispatch(fillTododefinenotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'Yapılacaklar tanımı başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTododefinenotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const TododefinesSlice = createSlice({
    name: 'Tododefines',
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
        handleSelectedTododefine:(state, action) => {
            state.selected_record = action.payload;
        },
        fillTododefinenotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeTododefinenotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetTododefines.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetTododefines.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetTododefines.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetTododefine.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetTododefine.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetTododefine.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddTododefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddTododefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddTododefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditTododefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditTododefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditTododefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteTododefines.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteTododefines.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteTododefines.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedTododefine,
    fillTododefinenotification,
    removeTododefinenotification,
    handleDeletemodal
} = TododefinesSlice.actions;

export default TododefinesSlice.reducer;