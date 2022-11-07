import { createSlice } from '@reduxjs/toolkit'

const currentUser = JSON.parse(localStorage.getItem('user'))

const initialState = {
  currentUser,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedUser: (state, action) => {
      state.currentUser = action.payload.user
    },
    resetLoggedUser: (state) => {
      state.currentUser = null
    },
  },
})

export const { setLoggedUser, resetLoggedUser } = userSlice.actions
export const selectCurrentUser = (state) => state.user.currentUser

export default userSlice.reducer
