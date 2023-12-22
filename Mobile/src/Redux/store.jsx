import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { oauthApi } from './Auth/Oauth'
import { caseApi } from './Setting/Cases'
import Pagereducer from './Page/Page'

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [oauthApi.reducerPath]: oauthApi.reducer,
        [caseApi.reducerPath]: caseApi.reducer,
        Page: Pagereducer
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(oauthApi.middleware)
            .concat(caseApi.middleware)
    ,
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)