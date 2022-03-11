import {useEffect, useState} from "react";
import {useMutation, gql} from "@apollo/client";
import {GET_ALL_TODOS} from "../App";
import {toast} from 'react-toastify';

const DELETE_TODO = gql`
   mutation Delete_Todo($id:Int){
       deleteTodo(id:$id)
}
`

const UPDATE_TODO = gql`
mutation Mutation($isFinished: Int, $description: String, $updateTodoId: Int) {
  updateTodo(isFinished: $isFinished, description: $description, id: $updateTodoId) {
    id
    description
    isFinished
  }
}
`
const TodoItem = ({id, description, isFinished}) => {
    const [isEditing, setEditing] = useState(false);
    const [newDesc, setNewDesc] = useState(description);
    const [newIsFinished, setNewFinished] = useState(isFinished ? 1 : 0);

    const [deleteTodo, {error: deleteErr}] = useMutation(DELETE_TODO, {
        refetchQueries: [
            GET_ALL_TODOS,
            'Todos'
        ],
    });

    const [updateTodo, {error: updateErr}] = useMutation(UPDATE_TODO);

    /**
     * handle delete todo
     */
    const handleDelete = () => {
        if (window.confirm("Click ok to delete selected todo")) {
            deleteTodo({
                variables: {
                    id: id,
                }
            });

            //Optimistic design
            toast.success('Your todo has been deleted!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    useEffect((() => {
        if (deleteErr) {
            toast.error('Something went wrong, your todo may not be deleted', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }), [deleteErr])



    /**
     * handle update new todo
     */
    const handleUpdate = () => {
        //check if user submit same input
        if (description === newDesc && isFinished === !!parseInt(newIsFinished)) {
            toast.error('Cannot submit same values', {
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

        updateTodo({
            variables: {
                "isFinished": parseInt(newIsFinished),
                "description": newDesc,
                "updateTodoId": id
            },
        })

        setEditing(false);//after update change back todo item to normal

        //Optimistic design
        toast.success('Your todo has been updated!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    }

    useEffect((() => {
        if (updateErr) {
            toast.error('Something went wrong, your todo may not be deleted', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }), [updateErr])


    return (
        <div className={`flex text-center  bg-white gap-2 py-3 mx-3 flex-col border rounded-md 
        ${isFinished ? 'bg-green-500' : 'bg-yellow-300'}`}>
            {
                !isEditing ?
                    <div className="h-8 flex px-5">
                        <p className="flex-1 ">{description}</p>
                        {isFinished ?
                            <p className="font-medium">
                                Completed
                            </p> : <p className="font-medium">
                                Ongoing
                            </p>
                        }
                    </div> :
                    <div className="flex px-3 gap-5">
                        <input value={newDesc} onChange={e => setNewDesc(e.target.value)}
                            className="flex-1 outline-none border-2 border-gray-400 focus:border-blue-600 rounded-md"
                        />
                        <select value={newIsFinished} onChange={e => setNewFinished(e.target.value)} className="outline-1 font-medium">
                            <option value={1}>Completed</option>
                            <option value={0}>Ongoing</option>
                        </select>
                    </div>
            }

            {
                !isEditing ?
                    <div className="flex justify-center gap-5 text-white">
                        <button className="bg-blue-700 w-20 h-8 rounded-md" onClick={() => setEditing(true)}>Edit</button>
                        <button className="bg-red-700 w-20 h-8 rounded-md" onClick={handleDelete}>Delete</button>
                    </div> :
                    <div className="flex justify-center gap-5 text-white">
                        <button className="bg-blue-700 w-20 h-8 rounded-md" onClick={handleUpdate}>Update</button>
                        <button className="bg-red-700 w-20 h-8 rounded-md" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
            }
        </div>
    )
}

export default TodoItem;