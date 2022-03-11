import {useState} from "react";
import {useMutation, gql} from "@apollo/client";
import {toast} from 'react-toastify';
import {GET_ALL_TODOS} from "../App";


const ADD_TODO = gql`
mutation AddTodo($description: String) {
  addTodo(description: $description) {
    isFinished
    description
    id
  }
}
`;

const NewTodo = () => {

    const [newTodo, setNewTodo] = useState('');

    const [addTodo, {error}] = useMutation(ADD_TODO, {
        refetchQueries: [ //refetch all todo after add new one
            GET_ALL_TODOS,
            'Todos'
        ],
    });

    const handleAddTodo = () => {
        if (newTodo.length === 0) {
            toast.error('New todo cannot be empty', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        addTodo({
            variables: {
                description: newTodo
            }
        })

        setNewTodo('');

        //Optimistic design
        toast.success('Your todo has been added!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    if (error) {
        toast.error('Something went wrong your todo may not be added', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (
        <div className="flex px-3 gap-5">
            <input type='text' className="flex-1 outline-none border-2 border-gray-400 focus:border-blue-400 rounded-md"
                value={newTodo} onChange={e => setNewTodo(e.target.value)} />
            <button className="bg-blue-700 w-24 h-8 rounded-md text-white border-none" onClick={handleAddTodo}>
                Add todo
            </button>
        </div>
    )
}

export default NewTodo;