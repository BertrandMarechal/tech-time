import { Button } from "./Button.tsx";
import { BackendType, CookieNames } from "../enums.ts";
import { useCookies } from "react-cookie";
import pythonImg from "../assets/python.png";
import goImg from "../assets/go.png";
import { use } from "react";
import { TodosContext } from "../store/todos-context.tsx";

export function Navbar({ title }: { title: string }) {
  const { setBackend } = use(TodosContext);
  const [cookies] = useCookies();
  function handleClickOnBackendOrigin(origin: BackendType) {
    setBackend(origin);
  }
  const selectedBackend = cookies[CookieNames.Backend];
  return (
    <nav className="sticky top-0 z-50 left-0 right-0 flex justify-between items-center p-2 bg-amber-900 h-14">
      <ul className="flex items-center">
        <li className="text-xl ml-2 text-white font-semibold">{title}</li>
      </ul>
      <ul className="flex flex-row gap-2">
        <li>
          <Button className={`${selectedBackend === BackendType.Python ? "border-amber-400" : "border-transparent"} bg-transparent hover:bg-transparent hover:border-amber-300 border`} onClick={() => handleClickOnBackendOrigin(BackendType.Python)}>
            <div className="flex flex-row gap-2 items-center">
              <img src={pythonImg} alt="Python Logo" className="w-6 h-6 rounded-full" />
              <span className="text-amber-300">Python</span>
            </div>
          </Button>
        </li>
        <li>
          <Button className={`${selectedBackend === BackendType.Go ? "border-amber-400" : "border-transparent"} bg-transparent hover:bg-transparent hover:border-amber-300 border`} onClick={() => handleClickOnBackendOrigin(BackendType.Go)}>
            <div className="flex flex-row gap-2 items-center">
              <img src={goImg} alt="Python Logo" className="w-6 h-6 rounded-full" />
              <span className="text-amber-300">Go</span>
            </div>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
