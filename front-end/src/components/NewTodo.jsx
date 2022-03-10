import {useState} from "react";

const NewTodo = ({setTodos}) => {
    const [newTodo, setNewTodo] = useState('');



    return (
        <div>
            <input type='text' value={newTodo} onClick={e => setNewTodo(e.target.value)} />
            <button
     
            >Add new todo</button>
        </div>
    )
}


export default NewTodo;