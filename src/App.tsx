import {useFireproof} from "use-fireproof";
import { connect } from "@fireproof/partykit";
import "./App.css";

interface Doc {
    _id?: string
    text?: string
    completed?: boolean
}

function App() {
    const { database, useLiveQuery, useDocument } = useFireproof('catbot')
  const response = useLiveQuery<Doc>('date', {limit: 10, descending: true})

  //Hello
  connect(database, '', 'http://127.0.0.1:1999?protocol=ws')
  const todos = response.docs as Doc[]
  const [todo, setTodo, saveTodo] = useDocument<Doc>(() => ({
    text: "",
    date: Date.now(),
    completed: false,
  }))

  return (
    <>
      <input
        title="text"
        type="text"
        value={todo.text as string}
        onChange={(e) => setTodo({text: e.target.value})}
      />
      <button
        onClick={async () => {
          await saveTodo()
          setTodo()
        }}
      >
        Save
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <input
              title="completed"
              type="checkbox"
              checked={todo.completed as boolean}
              onChange={() =>
                database.put({
                  ...todo,
                  completed: !todo.completed,
                })}
            />
            {todo.text as string}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App;