import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Routes, Services } from '../../Utils/Constants'

export const oauthApi = createApi({
    reducerPath: 'oauthApi',
    baseQuery: fetchBaseQuery({ baseUrl: Services.Auth }),
    endpoints: (builder) => ({
        testServer: builder.query({
            query: () => `${Routes.Oauth}/Testserver`,
        }),
    }),
})

export const { useTestServerQuery } = oauthApi