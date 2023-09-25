import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import createTaskSlice from "./slices/createTaskSlice";
import sidebarSlice from "./slices/sidebarSlice";
import notificationSlice from "./slices/notificationSlice";

export default configureStore({
    reducer: {
        user: userSlice,
        createTask: createTaskSlice,
        sidebar: sidebarSlice,
        notification: notificationSlice
    }
})
