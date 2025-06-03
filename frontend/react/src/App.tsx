import "./App.css";
import { TodoList } from "./components/TodoList";
import { TodosContextProvider } from "./store/todos-context";

function App() {
  return (
    <>
      <TodosContextProvider>
        <TodoList></TodoList>
      </TodosContextProvider>
    </>
  );
}

export default App;
