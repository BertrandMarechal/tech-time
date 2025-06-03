import { createContext, type PropsWithChildren, useEffect, useState } from "react";
import type { Todo } from "../models/todo.model";
import type { PaginationResults } from "../models/pagination.models";

export type SortingParameters = {
  sort: "date_created" | "content";
  direction: "asc" | "desc";
};
export const TodosContext = createContext<{
  todos?: PaginationResults<Todo>;
  todoToUpdate?: Todo;
  loading: boolean;
  error: string | null;
  addTodo: (todo: Pick<Todo, "content">) => void;
  selectTodo: (todo: Todo) => void;
  unselectTodo: () => void;
  updateTodo: (id: number, todo: Pick<Todo, "content">) => void;
  removeTodo: (id: number) => void;
  sorting: SortingParameters;
  sort: (params: SortingParameters) => void;
}>({
  loading: false,
  error: null,
  addTodo: (_todo: Pick<Todo, "content">) => {},
  selectTodo: (_todo: Todo) => {},
  unselectTodo: () => {},
  updateTodo: (_id: number, _todo: Pick<Todo, "content">) => {},
  removeTodo: (_id: number) => {},
  sort: (_params: SortingParameters) => {},
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
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingParameters>({
    sort: "date_created",
    direction: "asc",
  });

  useEffect(() => {
    async function loadTodos() {
      if (reload) {
        setLoading(true);
        setError(null);
        const query = new URLSearchParams({
          sort: sorting.sort,
          direction: sorting.direction,
        });
        const response = await fetch(`http://localhost:20701/todos?${query.toString()}`);
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
  }, [reload, sorting]);

  async function addTodo(enteredTodoData: Pick<Todo, "content">) {
    const response = await fetch("http://localhost:20701/todos", {
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
    const response = await fetch(`http://localhost:20701/todos/${id}`, {
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

  async function removeTodo(id: number) {
    const response = await fetch(`http://localhost:20701/todos/${id}`, {
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

  function sort(desiredSorting: { sort: "date_created" | "content"; direction: "asc" | "desc" }) {
    setReload(true);
    setSorting(desiredSorting);
  }

  const contextValue = {
    todos,
    todoToUpdate,
    loading,
    error,
    addTodo,
    updateTodo,
    removeTodo,
    selectTodo,
    unselectTodo,
    sorting,
    sort,
  };

  return <TodosContext value={contextValue}>{children}</TodosContext>;
}
