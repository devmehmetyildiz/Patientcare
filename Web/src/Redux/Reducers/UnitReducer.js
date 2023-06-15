import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../../Utils/Constants";
import AxiosErrorHelper from "../../Utils/AxiosErrorHelper";
import instanse from "../Actions/axios";
import config from "../../Config";

export const GetUnits = createAsyncThunk(
    'Units/GetUnits',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.UNIT);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetUnit = createAsyncThunk(
    'Units/GetUnit',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.UNIT}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddUnits = createAsyncThunk(
    'Units/AddUnits',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.UNIT, data);
            dispatch(fillUnitnotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Eklendi',
            }));
            history.push('/Units');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditUnits = createAsyncThunk(
    'Units/EditUnits',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.UNIT, data);
            dispatch(fillUnitnotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Güncellendi',
            }));
            history.push('/Units');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteUnits = createAsyncThunk(
    'Units/DeleteUnits',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.UNIT}/${data.Uuid}`);
            dispatch(fillUnitnotification({
                type: 'Success',
                code: 'Departman',
                description: 'Departman başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillUnitnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const UnitsSlice = createSlice({
    name: 'Units',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDispatching: false
    },
    reducers: {
        RemoveSelectedUnit: (state) => {
            state.selected_record = {};
        },
        fillUnitnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeUnitnotification: (state) => {
            state.notifications.splice(0, 1);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetUnits.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetUnits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetUnits.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetUnit.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetUnit.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetUnit.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddUnits.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddUnits.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddUnits.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditUnits.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditUnits.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditUnits.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteUnits.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteUnits.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteUnits.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    RemoveSelectedUnit,
    fillUnitnotification,
    removeUnitnotification,
} = UnitsSlice.actions;

export default UnitsSlice.reducer;