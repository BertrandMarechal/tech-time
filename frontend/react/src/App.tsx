import "./App.css";
import { TodoList } from "./components/TodoList/TodoList.tsx";
import { TodosContextProvider } from "./store/todos-context";
import { Header } from "./components/Header.tsx";

function App() {
  return (
    <div className="flex flex-col justify-start h-full">
      <Header></Header>
      <main>
        <TodosContextProvider>
          <TodoList></TodoList>
        </TodosContextProvider>
      </main>
    </div>
  );
}

export default App;
