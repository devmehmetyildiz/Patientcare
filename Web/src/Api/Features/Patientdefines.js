import { businessApi, } from "..";
import { METHODS, ROUTES } from "../Constant";

export const patientdefineApi = businessApi.injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
        getPatientdefines: builder.query({
            query: () => ({
                url: ROUTES.PATIENTDEFINE,
                method: METHODS.GET,
            }),
        }),
        getPatientdefine: builder.query({
            query: (guid) => ({
                url: `${ROUTES.PATIENTDEFINE}/${guid}`,
                method: METHODS.GET,
            }),
        }),
        addPatientdefine: builder.mutation({
            query: (data) => ({
                url: ROUTES.PATIENTDEFINE,
                method: METHODS.POST,
                body: data,
            }),
        }),
        editPatientdefine: builder.mutation({
            query: (data) => ({
                url: ROUTES.PATIENTDEFINE,
                method: METHODS.PUT,
                body: data,
            }),
        }),
        deletePatientdefine: builder.mutation({
            query: (guid) => ({
                url: `${ROUTES.PATIENTDEFINE}/${guid}`,
                method: METHODS.DELETE,
            }),
        }),
    }),
});

export const {
    useGetPatientdefinesQuery,
    useGetPatientdefineQuery,
    useAddPatientdefineMutation,
    useEditPatientdefineMutation,
    useDeletePatientdefineMutation,
} = patientdefineApi;