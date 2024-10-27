import { settingApi, } from "..";
import { METHODS, ROUTES } from "../Constant";

export const floorApi = settingApi.injectEndpoints({
    endpoints: (builder) => ({
        getFloors: builder.query({
            query: () => ({
                url: ROUTES.FLOOR,
                method: METHODS.GET,
            }),
        }),
        getFloor: builder.query({
            query: (guid) => ({
                url: `${ROUTES.FLOOR}/${guid}`,
                method: METHODS.GET,
            }),
        }),
        addFloor: builder.mutation({
            query: (data) => ({
                url: ROUTES.FLOOR,
                method: METHODS.POST,
                body: data,
            }),
        }),
        fastcreateFloors: builder.mutation({
            query: (data) => ({
                url: `${ROUTES.FLOOR}/FastcreateFloor`,
                method: METHODS.POST,
                body: data,
            }),
        }),
        addRecordFloors: builder.mutation({
            query: (data) => ({
                url: `${ROUTES.FLOOR}/AddRecord`,
                method: METHODS.POST,
                body: data,
            }),
        }),
        editFloor: builder.mutation({
            query: (data) => ({
                url: ROUTES.FLOOR,
                method: METHODS.PUT,
                body: data,
            }),
        }),
        deleteFloor: builder.mutation({
            query: (guid) => ({
                url: `${ROUTES.FLOOR}/${guid}`,
                method: METHODS.DELETE,
            }),
        }),
    }),
});

export const {
    useGetFloorsQuery,
    useGetFloorQuery,
    useAddFloorMutation,
    useFastcreateFloorsMutation,
    useAddRecordFloorsMutation,
    useEditFloorMutation,
    useDeleteFloorMutation,
} = floorApi;