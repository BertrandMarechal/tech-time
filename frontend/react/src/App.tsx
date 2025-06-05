import "./App.css";
import { TodoList } from "./components/TodoList/TodoList.tsx";
import { TodosContextProvider } from "./store/todos-context";
import { Header } from "./components/Header.tsx";
import { useCookies } from "react-cookie";

function App() {
  const [cookies, setCookies] = useCookies();
  const frontendCookie = cookies["tt-fe"];
  if (!frontendCookie) {
    setCookies("tt-fe", "react");
  } else if (frontendCookie !== "react") {
    document.location.reload();
  }
  if (!cookies["tt-be"]) {
    setCookies("tt-be", "python");
  }
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
