import { configureStore } from '@reduxjs/toolkit'
import todoReducer from '../redux/reducers/todoReducer.js'

export const store = configureStore({
    reducer: todoReducer
})