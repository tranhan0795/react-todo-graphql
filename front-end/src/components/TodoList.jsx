const TodoList = ({todos, setTodos}) => {

    return (
        <div>
            {todos.map((todo) => {
                return (
                    <div>
                    <span>{todo.description}</span>
                    
                    </div>
                )
            })}
        </div>
    )
}


export default TodoList;