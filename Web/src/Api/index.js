import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fillnotification } from '../Redux/ProfileSlice';
import config from '../Config';

const undefinedErrorhandling = ({ result, Profile }) => {

    const t = Profile?.i18n?.t
    const { error, meta } = result

    const url = meta?.request?.url
    let parsedurl = url ? new URL(url) : null

    const service = parsedurl ?
        Object.keys(config.services).find(key => config.services[key] === `${parsedurl.origin}/`) || t('Error.Undefinedservice')
        : t('Error.Undefinedservice')

    const errorCode = error.status === "FETCH_ERROR" ? t('Error.Fetcherror') : error.status
    return {
        type: "Error",
        code: `${errorCode}`,
        description: `${service} ${t('Error.ServiceConnectionError')}`
    }

}

const getErrordata = ({ error, subject, Profile }) => {
    const t = Profile?.i18n?.t

    if (error && error.list && Array.isArray(error.list) && error.list.length > 0) {

        const decoratedErrors = (error.list || []).map(err => {
            return {
                type: "Error",
                code: `${err.code} - ${subject}`,
                description: err.description
            }
        })
        return decoratedErrors
    } else {
        if (error.code && error.description) {

            return [{
                type: "Error",
                code: `${error.code} - ${subject}`,
                description: error.description
            }]
        } else {
            return [{
                type: "Error",
                code: `${subject}`,
                description: t('Error.NotFound')
            }]
        }
    }
}

const errorhandling = ({ error, Profile }) => {
    const t = Profile?.i18n?.t
    let subject = null
    const { status, data } = error
    switch (status) {
        case 400:
            subject = t('Error.Case.400')
            break;
        case 401:
            subject = t('Error.Case.401')
            break;
        case 403:
            subject = t('Error.Case.403')
            break;
        case 404:
            subject = t('Error.Case.404')
            break;
        case 500:
            subject = t('Error.Case.500')
            break;
        default:
            subject = t('Error.Undefined')
            break;
    }

    return getErrordata({
        error: data,
        subject,
        Profile,
    })
}

export const globalOnQueryStarted = async (arg, api) => {
    try {
        const { queryFulfilled, dispatch } = api
        await queryFulfilled;
        if ((arg?.reqType && arg?.successMessage)) {
            dispatch(fillnotification({
                type: 'Success',
                code: arg?.reqType,
                description: arg?.successMessage,
            }));
        }
        if (arg?.clearForm && arg?.clearFormKey) {
            arg?.clearForm(arg?.clearFormKey);
        }
        if (arg?.onSuccess) {
            arg?.onSuccess()
        };
        if ((arg?.history && arg?.redirectUrl)) {
            arg?.history.push(arg?.redirectUrl);
        }
    } catch (err) {
        console.error('Query Error:', err);
    }
};

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
            const { Profile } = api.getState()
            if (result.error.data) {
                throw errorhandling({ error: result.error, Profile });
            } else {
                throw undefinedErrorhandling({ result, Profile });
            }
        }
        return result;
    } catch (error) {
        api.dispatch(fillnotification(error))
        throw error
    }
}


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.Auth),
    endpoints: () => ({}),
});

export const businessApi = createApi({
    reducerPath: 'businessApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.Business),
    endpoints: () => ({}),
});

export const fileApi = createApi({
    reducerPath: 'fileApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.File),
    endpoints: () => ({}),
});

export const logApi = createApi({
    reducerPath: 'logApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.Log),
    endpoints: () => ({}),
});

export const settingApi = createApi({
    reducerPath: 'settingApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.Setting),
    endpoints: () => ({}),
});

export const systemApi = createApi({
    reducerPath: 'systemApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.System),
    endpoints: () => ({}),
});

export const userroleApi = createApi({
    reducerPath: 'userroleApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.Userrole),
    endpoints: () => ({}),
});

export const warehouseApi = createApi({
    reducerPath: 'warehouseApi',
    baseQuery: async (args, api, extraOptions) => baseQuery(args, api, extraOptions, config.services.Warehouse),
    endpoints: () => ({}),
});