import { Button } from "./Button.tsx";
import { BackendType, CookieNames, FrontendType } from "../enums.ts";
import { useCookies } from "react-cookie";
import pythonImg from "../assets/python.png";
import goImg from "../assets/go.png";
import reactImg from "../assets/react.png";
import vueImg from "../assets/vue.svg";
import { use } from "react";
import { TodosContext } from "../store/todos-context.tsx";

export function Navbar({ title }: { title: string }) {
  const { setBackend } = use(TodosContext);
  const [cookies, setCookies] = useCookies();
  function handleClickOnBackendOrigin(origin: BackendType) {
    setBackend(origin);
  }
  function handleClickOnFrontend(frontend: FrontendType) {
    setCookies(CookieNames.Frontend, frontend);
    document.location.reload();
  }
  const selectedBackend = cookies[CookieNames.Backend];
  const selectedFrontend = cookies[CookieNames.Frontend];
  return (
    <nav className="sticky top-0 z-50 left-0 right-0 flex justify-between items-center p-2 bg-amber-900 h-14">
      <ul className="flex items-center">
        <li className="text-xl ml-2 text-white font-semibold">{title}</li>
      </ul>
      <div className="flex flex-row gap-4">
        <ul className="flex flex-row gap-2">
          <li>
            <Button
              className={`${selectedFrontend === FrontendType.Vue ? "border-amber-400" : "border-transparent"} bg-transparent hover:bg-transparent hover:border-amber-300 border`}
              onClick={() => handleClickOnFrontend(FrontendType.Vue)}>
              <div className="flex flex-row gap-2 items-center">
                <img src={vueImg} alt="Vue Logo" className="w-6 h-6 rounded-full" />
                <span className="text-amber-300">Vue</span>
              </div>
            </Button>
          </li>
          <li>
            <Button
              className={`${selectedFrontend === FrontendType.React ? "border-amber-400" : "border-transparent"} bg-transparent hover:bg-transparent hover:border-amber-300 border`}
              onClick={() => handleClickOnFrontend(FrontendType.React)}>
              <div className="flex flex-row gap-2 items-center">
                <img src={reactImg} alt="React Logo" className="w-6 h-6 rounded-full" />
                <span className="text-amber-300">React</span>
              </div>
            </Button>
          </li>
        </ul>
        <ul className="flex flex-row gap-2">
          <li>
            <Button
              className={`${selectedBackend === BackendType.Python ? "border-amber-400" : "border-transparent"} bg-transparent hover:bg-transparent hover:border-amber-300 border`}
              onClick={() => handleClickOnBackendOrigin(BackendType.Python)}>
              <div className="flex flex-row gap-2 items-center">
                <img src={pythonImg} alt="Python Logo" className="w-6 h-6 rounded-full" />
                <span className="text-amber-300">Python</span>
              </div>
            </Button>
          </li>
          <li>
            <Button
              className={`${selectedBackend === BackendType.Go ? "border-amber-400" : "border-transparent"} bg-transparent hover:bg-transparent hover:border-amber-300 border`}
              onClick={() => handleClickOnBackendOrigin(BackendType.Go)}>
              <div className="flex flex-row gap-2 items-center">
                <img src={goImg} alt="Go Logo" className="w-6 h-6 rounded-full" />
                <span className="text-amber-300">Go</span>
              </div>
            </Button>
          </li>
        </ul>
      </div>
    </nav>
);
}
