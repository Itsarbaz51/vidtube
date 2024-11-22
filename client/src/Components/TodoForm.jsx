import {useState} from 'react'
import { useDispatch } from 'react-redux'
import { addTodo } from '../redux/action/todoAction.js'


function TodoForm() {
    const [textTodo, setTextTodo] = useState("")

    const dispatch = useDispatch();

    const onFormSubmit = (e) => {
        e.preventDefault();
        dispatch(addTodo(textTodo))
    } 

    const onInputChange = (e) => {
        setTextTodo(e.target.value);
    }
  return (
    <div>
        <form action="" 
            className='text-center'
            onSubmit={onFormSubmit}
            >
            <input
                className= ' mt-4  border-b border-gray-300 outline-none  p-3 m-auto w-6/12 text-2xl text-zinc-700'
                placeholder='Enter new todo...'
                onChange={onInputChange} 
                />
        </form>
    </div>
  )
}

export default TodoForm