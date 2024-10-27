import { businessApi, globalOnQueryStarted } from "..";
import { METHODS, ROUTES } from "../Constant";

export const surveyApi = businessApi.injectEndpoints({
    endpoints: (builder:any) => ({
        getSurveys: builder.query({
            query: () => ({
                url: ROUTES.SURVEY,
                method: METHODS.GET,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        getSurvey: builder.query({
            query: (guid) => ({
                url: `${ROUTES.SURVEY}/${guid}`,
                method: METHODS.GET,
            }),
            onQueryStarted: globalOnQueryStarted,
        }),
        addSurvey: builder.mutation({
            query: ({ data }) => ({
                url: ROUTES.SURVEY,
                method: METHODS.POST,
                body: data,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        editSurvey: builder.mutation({
            query: ({ data }) => ({
                url: ROUTES.SURVEY,
                method: METHODS.PUT,
                body: data,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        deleteSurvey: builder.mutation({
            query: (guid) => ({
                url: `${ROUTES.SURVEY}/${guid}`,
                method: METHODS.DELETE,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
    }),
});

export const {
    useGetSurveysQuery,
    useGetSurveyQuery,
    useAddSurveyMutation,
    useEditSurveyMutation,
    useDeleteSurveyMutation,
} = surveyApi;