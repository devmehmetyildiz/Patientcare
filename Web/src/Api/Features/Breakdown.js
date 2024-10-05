import config from "../../Config";
import { baseApi } from "../api";
import { METHODS, ROUTES } from "../constant";

export const breakdownApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBreakdowns: builder.query({
            query: () => ({
                url: ROUTES.BREAKDOWN,
                method: METHODS.GET,
            }),
        }),
        getBreakdown: builder.query({
            query: (guid) => ({
                url: `/${guid}`,
                method: METHODS.GET,
            }),
        }),
        addBreakdown: builder.mutation({
            query: (data) => ({
                method: METHODS.POST,
                body: data,
            }),
        }),
        editBreakdown: builder.mutation({
            query: (data) => ({
                method: METHODS.PUT,
                body: data,
            }),
        }),
        deleteBreakdown: builder.mutation({
            query: (guid) => ({
                url: `/${guid}`,
                method: METHODS.DELETE,
            }),
        }),
    }),
});

export const {
    useGetBreakdownsQuery,
    useGetBreakdownQuery,
    useAddBreakdownMutation,
    useEditBreakdownMutation,
    useDeleteBreakdownMutation,
} = breakdownApi;
