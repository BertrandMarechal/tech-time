import { createContext, type PropsWithChildren, useEffect, useState } from "react";
import type { Todo } from "../models/todo.model";
import type { PaginationResults } from "../models/pagination.models";
import { BackendType, CookieNames } from "../enums.ts";
import { useCookies } from "react-cookie";

const PORT = 20700;
type SortFields = "date_created" | "content" | "order";
export type SortingParameters = {
  sort: SortFields;
  direction: "asc" | "desc";
};
export const TodosContext = createContext<{
  todos?: PaginationResults<Todo>;
  todoToUpdate?: Todo;
  loading: boolean;
  hasAnyRecord: boolean;
  size: number;
  from: number;
  error: string | null;
  searchText: string;
  addTodo: (todo: Pick<Todo, "content">) => void;
  selectTodo: (todo: Todo) => void;
  unselectTodo: () => void;
  updateTodo: (id: number, todo: Pick<Todo, "content">) => void;
  removeTodo: (id: number) => void;
  moveTodo: (id: number, currentOrder: number, deltaOrder: number) => void;
  sorting: SortingParameters;
  sort: (params: SortingParameters) => void;
  updateSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  filterByText: (text: string) => void;
  setBackend: (backend: BackendType) => void;
}>({
  size: 25,
  from: 0,
  loading: false,
  hasAnyRecord: false,
  error: null,
  searchText:"",
  addTodo: (_todo: Pick<Todo, "content">) => {},
  selectTodo: (_todo: Todo) => {},
  unselectTodo: () => {},
  updateTodo: (_id: number, _todo: Pick<Todo, "content">) => {},
  removeTodo: (_id: number) => {},
  moveTodo: (_id: number, _currentOrder: number, _deltaOrder: number) => {},
  sort: (_params: SortingParameters) => {},
  updateSize: (_size: number) => {},
  nextPage: () => {},
  previousPage: () => {},
  firstPage: () => {},
  lastPage: () => {},
  filterByText: (_text: string) => {},
  setBackend: (_backend: BackendType) => {},
  sorting: {
    sort: "date_created",
    direction: "asc",
  },
});


export function TodosContextProvider({ children }: PropsWithChildren) {
  const [todos, setTodos] = useState<PaginationResults<Todo>>();
  const [todoToUpdate, setTodoToUpdate] = useState<Todo | undefined>(undefined);
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasAnyRecord, setHasAnyRecord] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState<number>(25);
  const [from, setFrom] = useState<number>(0);
  const [searchText, setSearchText] = useState("");
  const [sorting, setSorting] = useState<SortingParameters>({
    sort: "date_created",
    direction: "asc",
  });
  const [, setCookies] = useCookies();

  useEffect(() => {
    async function loadTodos() {
      if (reload) {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams({
          sort: sorting.sort,
          direction: sorting.direction,
          from: `${from}`,
          size: `${size}`,
          text: searchText,
        });
        const response = await fetch(`http://localhost:${PORT}/api/todos?${query.toString()}`);
        if (!response.ok) {
          setError(await response.text());
          setReload(false);
          setLoading(false);
          return;
        }
        const newTodos = await response.json();
        setTodos(newTodos);
        setReload(false);
        setLoading(false);
      }
    }

    loadTodos();
  }, [reload, sorting, from, size]);

  useEffect(() => {
    async function checkHasAnyRecord() {
      if (reload) {
        const response = await fetch(`http://localhost:${PORT}/api/todos?size=0`);
        if (!response.ok) {
          setError(await response.text());
          return;
        }
        const newTodos = await response.json();
        setHasAnyRecord(newTodos.total > 0);
      }
    }

    checkHasAnyRecord();
  }, [reload]);

  async function addTodo(enteredTodoData: Pick<Todo, "content">) {
      const response = await fetch(`http://localhost:${PORT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enteredTodoData),
    });

    if (!response.ok) {
      return;
    }
    setReload(true);
  }

  async function updateTodo(id: number, enteredTodoData: Pick<Todo, "content">) {
    const response = await fetch(`http://localhost:${PORT}/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enteredTodoData),
    });

    if (!response.ok) {
      return;
    }
    setReload(true);
    setTodoToUpdate(undefined);
  }

  async function moveTodo(id: number, currentOrder: number, deltaOrder: number) {
    const response = await fetch(`http://localhost:${PORT}/api/todos/${id}/order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ delta: deltaOrder, currentOrder }),
    });

    if (!response.ok) {
      return;
    }
    setReload(true);
    setTodoToUpdate(undefined);
  }

  async function removeTodo(id: number) {
    const response = await fetch(`http://localhost:${PORT}/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      return;
    }
    setReload(true);
  }

  function selectTodo(item: Todo) {
    setTodoToUpdate(item);
  }

  function unselectTodo() {
    setTodoToUpdate(undefined);
  }

  function sort(desiredSorting: { sort: SortFields; direction: "asc" | "desc" }) {
    setReload(true);
    setSorting(desiredSorting);
  }

  function nextPage() {
    setFrom((value) => value + size);
    setReload(true);
  }
  function previousPage() {
    setFrom((value) => value - size);
    setReload(true);
  }
  function firstPage() {
    setFrom(0);
    setReload(true);
  }
  function lastPage() {
    setFrom(Math.floor((todos?.total || 0) / size) * size);
    setReload(true);
  }
  function updateSize(size: number) {
    setSize(size);
    setReload(true);
  }
  function filterByText(text: string) {
    setSearchText(text);
    setReload(true);
  }
  function setBackend(backend: BackendType) {
    setCookies(CookieNames.Backend, backend);
    setReload(true);
  }

  const contextValue = {
    todos,
    todoToUpdate,
    loading,
    hasAnyRecord,
    error,
    addTodo,
    updateTodo,
    removeTodo,
    selectTodo,
    unselectTodo,
    sorting,
    sort,
    size,
    updateSize,
    from,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    filterByText,
    searchText,
    moveTodo,
    setBackend,
  };

  return <TodosContext value={contextValue}>{children}</TodosContext>;
}
