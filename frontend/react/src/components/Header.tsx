import { useCookies } from "react-cookie";
import { BackendType, CookieNames } from "../enums.ts";
import { Button } from "./Button.tsx";

export function Header() {
  const [cookies, setCookies] = useCookies();
  function handleClickOnBackendOrigin(origin: BackendType) {
    setCookies(CookieNames.Backend, origin);
  }
  const selectedBackend = cookies[CookieNames.Backend];
  return (
    <header className="flex flex-col items-center mb-6">
      <h2 className="text-4xl">
        Todos
      </h2>
      <nav>
        <ul className="flex flex-row gap-2">
          <li>
            <Button className={selectedBackend === BackendType.Python ? "underline" : ""} onClick={() => handleClickOnBackendOrigin(BackendType.Python)}>Python</Button>
          </li>
          <li>
            <Button className={selectedBackend === BackendType.Go ? "underline" : ""} onClick={() => handleClickOnBackendOrigin(BackendType.Go)}>Go</Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}