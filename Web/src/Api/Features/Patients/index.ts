import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { businessApi, globalOnQueryStarted } from "Api";
import { METHODS, ROUTES } from "Api/Constant";

export const patientApi = businessApi.injectEndpoints({
    overrideExisting: false,
    endpoints: (builder: EndpointBuilder<any, any, any>) => ({
        getPatients: builder.query({
            query: () => ({
                url: ROUTES.PATIENT,
                method: METHODS.GET,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
    }),
});

export const {
    useLazyGetPatientsQuery
} = patientApi;


