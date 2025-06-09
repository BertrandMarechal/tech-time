import "./App.css";
import { TodoList } from "./components/TodoList/TodoList.tsx";
import { TodosContextProvider } from "./store/todos-context";
import { Header } from "./components/Header.tsx";
import { useCookies } from "react-cookie";
import { BackendType, CookieNames, FrontendType } from "./enums.ts";
import { Navbar } from "./components/Navbar.tsx";

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
    <>
      <TodosContextProvider>
        <Navbar title="Todos"></Navbar>
        <div className="flex flex-col justify-start h-full mt-14">
          <Header></Header>
          <main>
            <TodoList></TodoList>
          </main>
        </div>
      </TodosContextProvider>
    </>
  );
}

export default App;
