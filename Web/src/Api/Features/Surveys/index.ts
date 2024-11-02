import { EndpointBuilder } from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import { businessApi, globalOnQueryStarted } from "Api";
import { METHODS, ROUTES, SURVEY_REFETCH_TAG } from "Api/Constant";

export const surveyApi = businessApi
    .enhanceEndpoints({ addTagTypes: [SURVEY_REFETCH_TAG] })
    .injectEndpoints({
        endpoints: (builder: EndpointBuilder<any, any, any>) => ({
            getSurveys: builder.query({
                query: () => ({
                    url: ROUTES.SURVEY,
                    method: METHODS.GET,
                }),
                providesTags: [SURVEY_REFETCH_TAG],
                onQueryStarted: globalOnQueryStarted
            }),
            getSurvey: builder.query({
                query: (guid: any) => ({
                    url: `${ROUTES.SURVEY}/${guid}`,
                    method: METHODS.GET,
                }),
                onQueryStarted: globalOnQueryStarted,
            }),
            addSurvey: builder.mutation({
                query: ({ data }: any) => ({
                    url: ROUTES.SURVEY,
                    method: METHODS.POST,
                    body: data,
                }),
                onQueryStarted: globalOnQueryStarted
            }),
            editSurvey: builder.mutation({
                query: ({ data }: any) => ({
                    url: ROUTES.SURVEY,
                    method: METHODS.PUT,
                    body: data,
                }),
                onQueryStarted: globalOnQueryStarted
            }),
            savePreviewSurvey: builder.mutation({
                query: ({ surveyID }: any) => ({
                    url: `${ROUTES.SURVEY}/Savepreview/${surveyID}`,
                    method: METHODS.PUT,
                }),
                invalidatesTags: [SURVEY_REFETCH_TAG],
                onQueryStarted: globalOnQueryStarted
            }),
            approveSurvey: builder.mutation({
                query: ({ surveyID }: any) => ({
                    url: `${ROUTES.SURVEY}/Approve/${surveyID}`,
                    method: METHODS.PUT,
                }),
                invalidatesTags: [SURVEY_REFETCH_TAG],
                onQueryStarted: globalOnQueryStarted
            }),
            completeSurvey: builder.mutation({
                query: ({ surveyID }: any) => ({
                    url: `${ROUTES.SURVEY}/Complete/${surveyID}`,
                    method: METHODS.PUT,
                }),
                invalidatesTags: [SURVEY_REFETCH_TAG],
                onQueryStarted: globalOnQueryStarted
            }),
            deleteSurvey: builder.mutation({
                query: ({ surveyID }: any) => ({
                    url: `${ROUTES.SURVEY}/${surveyID}`,
                    method: METHODS.DELETE,
                }),
                invalidatesTags: [SURVEY_REFETCH_TAG],
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
    useSavePreviewSurveyMutation,
    useApproveSurveyMutation,
    useCompleteSurveyMutation,
} = surveyApi;