import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { businessApi, globalOnQueryStarted } from "Api";
import { METHODS, ROUTES } from "Api/Constant";

export const patientdefineApi = businessApi.injectEndpoints({
    overrideExisting: false,
    endpoints: (builder: EndpointBuilder<any, any, any>) => ({
        getPatientdefines: builder.query({
            query: () => ({
                url: ROUTES.PATIENTDEFINE,
                method: METHODS.GET,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        getPatientdefine: builder.query({
            query: (guid) => ({
                url: `${ROUTES.PATIENTDEFINE}/${guid}`,
                method: METHODS.GET,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        addPatientdefine: builder.mutation({
            query: (data) => ({
                url: ROUTES.PATIENTDEFINE,
                method: METHODS.POST,
                body: data,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        editPatientdefine: builder.mutation({
            query: (data) => ({
                url: ROUTES.PATIENTDEFINE,
                method: METHODS.PUT,
                body: data,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        deletePatientdefine: builder.mutation({
            query: (guid) => ({
                url: `${ROUTES.PATIENTDEFINE}/${guid}`,
                method: METHODS.DELETE,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
    }),
});

export const {
    useGetPatientdefinesQuery,
    useLazyGetPatientdefinesQuery,
    useGetPatientdefineQuery,
    useAddPatientdefineMutation,
    useEditPatientdefineMutation,
    useDeletePatientdefineMutation,
} = patientdefineApi;