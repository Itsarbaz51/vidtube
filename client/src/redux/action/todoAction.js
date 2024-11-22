import axios from 'axios';
import {baseUrl} from '../../utils/constant.js'

// Action type
export const ADD_TODO_REQUEST = "ADD_TODO_REQUEST";

export const addTodo = (todo) => async(dispatch) => {
    try {
        const response = await axios.post(`${baseUrl}/todo`, todo)
        dispatch({type: ADD_TODO_REQUEST, payload: response.todo})
    } catch (error) {
        console.log("Error while calling addTodo API",error.message);
    }
}