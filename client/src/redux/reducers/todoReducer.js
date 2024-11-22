import { ADD_TODO_REQUEST } from "../action/todoAction.js";

const initialState = {
    loading: false,
    error: null,
    todo: []
}


const todoReducers = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case ADD_TODO_REQUEST:
            return{
                ...state,
                loading: true,
                error: null
            }

        default:
            return state;
    }
}

export default todoReducers;