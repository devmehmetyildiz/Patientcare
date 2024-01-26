import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Routes, Services } from '../../Utils/Constants'

// Define a service using a base URL and expected endpoints
export const caseApi = createApi({
    reducerPath: 'caseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: Services.Setting,
        headers: {
            Authorization: "Bearer asd"
        }
    }),
    endpoints: (builder) => ({
        cases: builder.query({
            query: () => `${Routes.Case}`,
        }),
        case: builder.query({
            query: (guid) => `${Routes.Case}/${guid}`,
        }),
    }),
    
    
})

// Export hooks for usage in functSional components, which are
// auto-generated based on the defined endpoints
export const { useCaseQuery, useCasesQuery } = caseApi