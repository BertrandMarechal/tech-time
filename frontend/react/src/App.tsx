import "./App.css";
import { TodoList } from "./components/TodoList/TodoList.tsx";
import { TodosContextProvider } from "./store/todos-context";
import { Header } from "./components/Header.tsx";
import { useCookies } from "react-cookie";
import { BackendType, CookieNames, FrontendType } from "./enums.ts";

function App() {
  const [cookies, setCookies] = useCookies();
  const frontendCookie = cookies[CookieNames.Frontend];
  if (!frontendCookie) {
    setCookies(CookieNames.Frontend, "react");
  } else if (frontendCookie !== FrontendType.React) {
    document.location.reload();
  }
  if (!cookies[CookieNames.Backend]) {
    setCookies(CookieNames.Backend, BackendType.Python);
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
