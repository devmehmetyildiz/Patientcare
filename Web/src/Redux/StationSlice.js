import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ROUTES } from "../Utils/Constants";
import AxiosErrorHelper from "../Utils/AxiosErrorHelper"
import instanse from "./axios";
import config from "../Config";

export const GetStations = createAsyncThunk(
    'Stations/GetStations',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.STATION);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetStation = createAsyncThunk(
    'Stations/GetStation',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.STATION}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddStations = createAsyncThunk(
    'Stations/AddStations',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.post(config.services.Setting, ROUTES.STATION, data);
            dispatch(fillStationnotification({
                type: 'Success',
                code: 'Veri Kaydetme',
                description: 'İstasyon başarı ile Eklendi',
            }));
            history.push('/Stations');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditStations = createAsyncThunk(
    'Stations/EditStations',
    async ({ data, history }, { dispatch }) => {
        try {
            const response = await instanse.put(config.services.Setting, ROUTES.STATION, data);
            dispatch(fillStationnotification({
                type: 'Success',
                code: 'Veri Güncelleme',
                description: 'İstasyon başarı ile Güncellendi',
            }));
            history.push('/Stations');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteStations = createAsyncThunk(
    'Stations/DeleteStations',
    async (data, { dispatch }) => {
        try {
            delete data['edit'];
            delete data['delete'];
            const response = await instanse.delete(config.services.Setting, `${ROUTES.STATION}/${data.Uuid}`);
            dispatch(fillStationnotification({
                type: 'Success',
                code: 'Veri Silme',
                description: 'İstasyon başarı ile Silindi',
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillStationnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const StationsSlice = createSlice({
    name: 'Stations',
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
        handleSelectedStation: (state, action) => {
            state.selected_record = action.payload;
        },
        fillStationnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeStationnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetStations.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetStations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetStations.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetStation.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetStation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetStation.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddStations.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(AddStations.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(AddStations.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditStations.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(EditStations.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(EditStations.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteStations.pending, (state) => {
                state.isDispatching = true;
            })
            .addCase(DeleteStations.fulfilled, (state, action) => {
                state.isDispatching = false;
                state.list = action.payload;
            })
            .addCase(DeleteStations.rejected, (state, action) => {
                state.isDispatching = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedStation,
    fillStationnotification,
    removeStationnotification,
    handleDeletemodal
} = StationsSlice.actions;

export default StationsSlice.reducer;