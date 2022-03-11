import './App.css';
import TodoItem from './components/TodoItem';
import {useQuery, gql} from '@apollo/client';
import NewTodo from './components/NewTodo';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const GET_ALL_TODOS = gql`
query Todos{
  todos{
    id,
    description,
    isFinished
  }
}
`

function App() {

  const {loading, data, error} = useQuery(GET_ALL_TODOS);

  if (error) return <p>Error :(</p>;
  if(loading) return <p>Loading</p>;

  return (
    <div className="App bg-gray-100 ">
      <div className='max-w-[720px] bg-gray-50 w-full pt-10 rounded-md shadow-sm mx-auto flex flex-col gap-3'>
        <NewTodo />
        {
          data.todos.map(todo => <TodoItem {...todo} key={todo.id} />)
        }
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
