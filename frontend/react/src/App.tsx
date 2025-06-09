import { TodoList } from "./components/TodoList/TodoList.tsx";
import { TodosContextProvider } from "./store/todos-context";
import { Header } from "./components/Header.tsx";
import { useCookies } from "react-cookie";
import { BackendType, CookieNames, FrontendType } from "./enums.ts";
import { Navbar } from "./components/Navbar.tsx";
import classes from "./App.module.css";

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
        <div className="flex flex-row justify-center w-full">
          <div className={`${classes["main-container"]} max-w-[1280px] relative flex flex-col justify-start items-center mt-8`}>
            <Header></Header>
            <main className="mb-6">
              <TodoList></TodoList>
            </main>
          </div>
        </div>
      </TodosContextProvider>
    </>
  );
}

export default App;
