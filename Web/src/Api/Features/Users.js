import { globalOnQueryStarted, userroleApi } from "..";
import { METHODS, ROUTES } from "../Constant";

export const userApi = userroleApi.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
                url: ROUTES.USER,
                method: METHODS.GET,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        getUsersforshift: builder.query({
            query: ({ data }) => ({
                url: `${ROUTES.USER}/GetUsersforshift`,
                method: METHODS.POST,
                body: data
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        getUser: builder.query({
            query: (guid) => ({
                url: `${ROUTES.USER}/${guid}`,
                method: METHODS.GET,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        addUser: builder.mutation({
            query: ({ data }) => ({
                url: ROUTES.USER,
                method: METHODS.POST,
                body: data,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        editUser: builder.mutation({
            query: ({ data }) => ({
                url: `${ROUTES.USER}`,
                method: METHODS.PUT,
                body: data,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        editUserMovement: builder.mutation({
            query: ({ data }) => ({
                url: `${ROUTES.USER}/UpdateUsermovement`,
                method: METHODS.PUT,
                body: data,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        editUsercase: builder.mutation({
            query: ({ data }) => ({
                url: `${ROUTES.USER}/UpdateUsercase`,
                method: METHODS.PUT,
                body: data,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        deleteUser: builder.mutation({
            query: (guid) => ({
                url: `${ROUTES.USER}/${guid}`,
                method: METHODS.DELETE,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
        deleteUserMovement: builder.mutation({
            query: (guid) => ({
                url: `${ROUTES.USER}/DeleteUsermovement/${guid}`,
                method: METHODS.DELETE,
            }),
            onQueryStarted: globalOnQueryStarted
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useAddUserMutation,
    useEditUserMutation,
    useDeleteUserMutation,
    useDeleteUserMovementMutation,
    useEditUsercaseMutation,
    useEditUserMovementMutation,
    useGetUsersforshiftQuery
} = userApi;