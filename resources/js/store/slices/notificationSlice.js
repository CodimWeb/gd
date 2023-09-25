import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import api from "../../api";

export const fetchNotification = createAsyncThunk(
    'notification/fetchNotification',
    async () => {
        const res = await api.get('/api/user/notification/list');
        return res.data.data;
    }
)

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notification: []
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotification.fulfilled, (state, { payload }) => {
                state.notification = payload
            })
    }
})

export const { } = notificationSlice.actions
export default notificationSlice.reducer
