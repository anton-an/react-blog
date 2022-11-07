import { configureStore } from '@reduxjs/toolkit'

import apiSlice from '../api/apiSlice'

import userReducer from './userSlice'
import appReducer from './appSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
})

export default store
