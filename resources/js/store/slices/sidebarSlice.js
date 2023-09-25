import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState: {
        isOpen: window.innerWidth > 768 ? true : false,
        hasNewTask: false
    },
    reducers: {
        toggleSidebar(state, { payload }) {
            state.isOpen = !state.isOpen
        },

        closeSidebarOnTablet() {
            state.isOpen = window.innerWidth < 992 ? true : false
        },

        setHasNewTask(state, { payload }) {
            state.hasNewTask = payload
        }
    },
})

export const { toggleSidebar, setHasNewTask, closeSidebarOnTablet } = sidebarSlice.actions

export default sidebarSlice.reducer
