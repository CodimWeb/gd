import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async () => {
        const res = await api.get('/api/user');
        return res.data.data;
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {}
    },
    reducers: {
        setUser(state, { payload }) {
            state.user = payload
        },

        removeUser(state, action) {
            state.user = {}
        },

        setUserName(state, { payload }) {
            state.user.username = payload
        },

        setUserBiography(state, { payload }) {
            state.user.biography = payload
        },

        setUSerAvatar(state, { payload }) {
            state.user.avatar = payload
        },

        setUserCountry(state, { payload }) {}
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.fulfilled, (state, { payload }) => {
                state.user = payload
            })
    }
})

export const { setUser, removeUser } = userSlice.actions

export default userSlice.reducer
