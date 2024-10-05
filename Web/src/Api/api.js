import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fillBreakdownnotification } from '../Redux/BreakdownSlice';
import AxiosErrorHelper from '../Utils/AxiosErrorHelper';
import config from '../Config';

const baseQuery = async (args, api, extraOptions, baseUrl) => {
    try {
        const rawBaseQuery = fetchBaseQuery({
            baseUrl: baseUrl,
            prepareHeaders: (headers) => {
                const token = localStorage.getItem('patientcare');
                const language = localStorage.getItem('Language');

                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
                if (language) {
                    headers.set('Language', language);
                }
                return headers;
            },
        });

        const result = await rawBaseQuery(args, api, extraOptions);
        if (result.error) {
            throw result.error;
        }

        return result;
    } catch (error) {
        const errorPayload = AxiosErrorHelper(error);
        api.dispatch(fillBreakdownnotification(errorPayload));
        throw errorPayload;
    }
}


export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.Warehouse),
    endpoints: () => ({}),
});