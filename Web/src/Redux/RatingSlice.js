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
        en: 'Rating added successfully',
        tr: 'Değerlendirme Başarı ile eklendi'
    },
    updatecode: {
        en: 'Data Update',
        tr: 'Veri Güncelleme'
    },
    updatedescription: {
        en: 'Rating updated successfully',
        tr: 'Değerlendirme Başarı ile güncellendi'
    },
    deletecode: {
        en: 'Data Delete',
        tr: 'Veri Silme'
    },
    deletedescription: {
        en: 'Rating Deleted successfully',
        tr: 'Değerlendirme Başarı ile Silindi'
    },
}

export const GetRatings = createAsyncThunk(
    'Ratings/GetRatings',
    async (_, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, ROUTES.RATING);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRatingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const GetRating = createAsyncThunk(
    'Ratings/GetRating',
    async (guid, { dispatch }) => {
        try {
            const response = await instanse.get(config.services.Setting, `${ROUTES.RATING}/${guid}`);
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRatingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const AddRatings = createAsyncThunk(
    'Ratings/AddRatings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.post(config.services.Setting, ROUTES.RATING, data);
            dispatch(fillRatingnotification({
                type: 'Success',
                code: Literals.addcode[Language],
                description: Literals.adddescription[Language] + ` : ${data?.Name}`,
            }));
            dispatch(fillRatingnotification({
                type: 'Clear',
                code: 'RatingsCreate',
                description: '',
            }));
            clearForm && clearForm('RatingsCreate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Ratings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRatingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const EditRatings = createAsyncThunk(
    'Ratings/EditRatings',
    async ({ data, history, redirectUrl, closeModal, clearForm }, { dispatch, getState }) => {
        try {
            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.put(config.services.Setting, ROUTES.RATING, data);
            dispatch(fillRatingnotification({
                type: 'Success',
                code: Literals.updatecode[Language],
                description: Literals.updatedescription[Language] + ` : ${data?.Name}`,
            }));
            clearForm && clearForm('RatingsUpdate')
            closeModal && closeModal()
            history && history.push(redirectUrl ? redirectUrl : '/Ratings');
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRatingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const DeleteRatings = createAsyncThunk(
    'Ratings/DeleteRatings',
    async (data, { dispatch, getState }) => {
        try {

            const state = getState()
            const Language = state.Profile.Language || 'en'
            const response = await instanse.delete(config.services.Setting, `${ROUTES.RATING}/${data.Uuid}`);
            dispatch(fillRatingnotification({
                type: 'Success',
                code: Literals.deletecode[Language],
                description: Literals.deletedescription[Language] + ` : ${data?.Name}`,
            }));
            return response.data;
        } catch (error) {
            const errorPayload = AxiosErrorHelper(error);
            dispatch(fillRatingnotification(errorPayload));
            throw errorPayload;
        }
    }
);

export const RatingsSlice = createSlice({
    name: 'Ratings',
    initialState: {
        list: [],
        selected_record: {},
        errMsg: null,
        notifications: [],
        isLoading: false,
        isDeletemodalopen: false
    },
    reducers: {
        handleSelectedRating: (state, action) => {
            state.selected_record = action.payload;
        },
        fillRatingnotification: (state, action) => {
            const payload = action.payload;
            const messages = Array.isArray(payload) ? payload : [payload];
            state.notifications = messages.concat(state.notifications || []);
        },
        removeRatingnotification: (state) => {
            state.notifications.splice(0, 1);
        },
        handleDeletemodal: (state, action) => {
            state.isDeletemodalopen = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetRatings.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.list = [];
            })
            .addCase(GetRatings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(GetRatings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(GetRating.pending, (state) => {
                state.isLoading = true;
                state.errMsg = null;
                state.selected_record = {};
            })
            .addCase(GetRating.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selected_record = action.payload;
            })
            .addCase(GetRating.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(AddRatings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(AddRatings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(AddRatings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(EditRatings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(EditRatings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(EditRatings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            })
            .addCase(DeleteRatings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(DeleteRatings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = action.payload;
            })
            .addCase(DeleteRatings.rejected, (state, action) => {
                state.isLoading = false;
                state.errMsg = action.error.message;
            });
    },
});

export const {
    handleSelectedRating,
    fillRatingnotification,
    removeRatingnotification,
    handleDeletemodal
} = RatingsSlice.actions;

export default RatingsSlice.reducer;