import { settingApi } from "..";
import { METHODS, ROUTES } from "../Constant";

export const bedApi = settingApi.injectEndpoints({
    endpoints: (builder) => ({
        getBeds: builder.query({
            query: () => ({
                url: ROUTES.BED,
                method: METHODS.GET,
            }),
        }),
        getBed: builder.query({
            query: (guid) => ({
                url: `${ROUTES.BED}/${guid}`,
                method: METHODS.GET,
            }),
        }),
        addBed: builder.mutation({
            query: (data) => ({
                url: ROUTES.BED,
                method: METHODS.POST,
                body: data,
            }),
        }),
        addRecordBeds: builder.mutation({
            query: (data) => ({
                url: `${ROUTES.BED}/AddRecord`,
                method: METHODS.POST,
                body: data,
            }),
        }),
        changeBedOccupied: builder.mutation({
            query: (data) => ({
                url: `${ROUTES.BED}/ChangeBedOccupied`,
                method: METHODS.PUT,
                body: data,
            }),
        }),
        editBed: builder.mutation({
            query: (data) => ({
                url: ROUTES.BED,
                method: METHODS.PUT,
                body: data,
            }),
        }),
        deleteBed: builder.mutation({
            query: (guid) => ({
                url: `${ROUTES.BED}/${guid}`,
                method: METHODS.DELETE,
            }),
        }),
    }),
});

export const {
    useGetBedsQuery,
    useGetBedQuery,
    useAddBedMutation,
    useAddRecordBedsMutation,
    useEditBedMutation,
    useChangeBedOccupiedMutation,
    useDeleteBedMutation,
} = bedApi;