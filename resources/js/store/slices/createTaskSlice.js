import { createSlice } from "@reduxjs/toolkit";

const createTaskSlice = createSlice({
    name: 'createTask',
    initialState: {
        step: 1,
        task: {
            category: {},
            title: '',
            description: '',
            photoName: '',
            photoBase64: '',
            createdTaskId: 0,
        },
    },
    reducers: {
        setCategory(state, { payload }) {
            state.task.category = payload
        },
        setTitle(state, { payload }) {
            state.task.title = payload
        },
        setDescription(state, { payload }) {
            state.task.description = payload
        },
        setPhotoName(state, { payload }) {
            state.task.photoName = payload
        },
        setPhoto(state, { payload }) {
            state.task.photoBase64 = payload
        },
        setFormData(state, { payload }) {
            state.task.formData = payload
        },
        setStep(state, { payload }) {
            state.step = payload
        },
        setCreatedTaskId(state, { payload }) {
            state.task.createdTaskId = payload
        },
        clearTask(state) {
            state.step = 1
            state.task = {
                category: {},
                title: '',
                description: '',
                photoName: '',
                photoBase64: '',
                createdTaskId: 0,
            }
        }

    },
})
export const { setCategory, setTitle, setDescription, setPhotoName, setPhoto, setStep, setCreatedTaskId, clearTask} = createTaskSlice.actions
export default createTaskSlice.reducer
