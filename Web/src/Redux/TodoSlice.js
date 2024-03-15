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
        en: 'Todo added successfully',
        tr: 'Yapılacak Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Todo updated successfully',
        tr: 'Yapılacak Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Todo Deleted successfully',
        tr: 'Yapılacak Başarı ile Silindi'
    },
}

export const GetTodos = createAsyncThunk(
    'Todos/GetTodos',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, ROUTES.TODO);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodonotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetTodosbyPatient = createAsyncThunk(
    'Todos/GetTodosbyPatient',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.TODO}/GetTodosbyPatientID/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodonotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetTodo = createAsyncThunk(
    'Todos/GetTodo',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Business, `${ROUTES.TODO}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodonotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddTodos = createAsyncThunk(
    'Todos/AddTodos',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, ROUTES.TODO, data);
            dispatch(fillTodonotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language],
            }));
            clearForm && clearForm('TodosCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Todos');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodonotification(errorPayload));
            throw errorPayload;
        }
    }
);


export const EditTodos = createAsyncThunk(
    'Todos/EditTodos',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Business, ROUTES.TODO, data);
            dispatch(fillTodonotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            clearForm && clearForm('TodosUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Todos');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodonotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteTodos = createAsyncThunk(
    'Todos/DeleteTodos',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Business, `${ROUTES.TODO}/${data.Uuid}`);
            dispatch(fillTodonotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodonotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApproveTodos = createAsyncThunk(
    'Todos/ApproveTodos',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, `${ROUTES.TODO}/Approve/${data.Uuid}`);
            dispatch(fillTodonotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodonotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const ApprovemultipleTodos = createAsyncThunk(
    'Todos/ApprovemultipleTodos',
    async (data, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Business, `${ROUTES.TODO}/Approve`, data);
            dispatch(fillTodonotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language],
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillTodonotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const TodosSlice = createSlice({
    name: 'Todos',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false,
        isApprovemodalopen: false
    },
    reducers: {
        handleSelectedTodo: (state, action) => {
            state.selected_record = action.payload;
        },
        fillTodonotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeTodonotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        },
        handleApprovemodal: (state, action) => {
            state.isApprovemodalopen = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetTodos.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetTodosbyPatient.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetTodosbyPatient.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetTodosbyPatient.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetTodo.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetTodo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetTodo.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddTodos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditTodos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteTodos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApproveTodos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApproveTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApproveTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(ApprovemultipleTodos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(ApprovemultipleTodos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(ApprovemultipleTodos.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedTodo,
    fillTodonotification,
    removeTodonotification,
    handleDeletemodal,
    handleApprovemodal
} = TodosSlice.actions;

export default TodosSlice.reducer;