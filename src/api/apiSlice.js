import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return user?.token
}

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://blog.kata.academy/api' }),
  tagTypes: ['Article'],
  endpoints: (builder) => ({
    getArticlesList: builder.query({
      query: (offset) => ({
        url: `/articles?limit=20&offset=${offset}`,
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: (data) =>
        data ? [...data.articles.map(({ slug }) => ({ type: 'Article', id: slug }))] : ['Article'],
    }),
    getArticle: builder.query({
      query: (slug) => ({
        url: `/articles/${slug}`,
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      providesTags: ['Article'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: { user: userData },
      }),
      transformResponse: (response) => response.user,
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: '/users/login',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: userData,
      }),
      transformResponse: (response) => response.user,
    }),
    getUser: builder.query({
      query: () => ({
        url: '/user',
        headers: {
          'content-type': 'application/json',
          Authorization: `Token ${getToken()}`,
        },
        transformResponse: (response) => response.data.user,
      }),
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: '/user',
        method: 'PUT',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
        body,
      }),
      invalidatesTags: [{ type: 'Article' }],
    }),
    createArticle: builder.mutation({
      query: (article) => ({
        url: '/articles',
        method: 'POST',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
        body: article,
      }),
      invalidatesTags: [{ type: 'Article' }],
    }),
    editArticle: builder.mutation({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: 'PUT',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Article', id: arg.id }, 'Article'],
    }),
    deleteArticle: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Article', id: arg.id }],
    }),
    favoritePost: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Article', id: arg.id }],
    }),
    unfavoritePost: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE',
        headers: {
          Authorization: `Token ${getToken()}`,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Article', id: arg.id }],
    }),
  }),
})

export const {
  useGetArticlesListQuery,
  useGetArticleQuery,
  useRegisterMutation,
  useLoginMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useCreateArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation,
  useFavoritePostMutation,
  useUnfavoritePostMutation,
} = apiSlice
export default apiSlice
