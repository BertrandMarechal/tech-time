import { createContext, useEffect, useState, type PropsWithChildren } from "react";
import type { Todo } from "../models/todo.model";
import type { PaginationResults } from "../models/pagination.models";

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
}>({
  loading: false,
  error: null,
  addTodo: (_todo: Pick<Todo, "content">) => {},
  selectTodo: (_todo: Todo) => {},
  unselectTodo: () => {},
  updateTodo: (_id: number, _todo: Pick<Todo, "content">) => {},
  removeTodo: (_id: number) => {},
});

export function TodosContextProvider({ children }: PropsWithChildren) {
  const [todos, setTodos] = useState<PaginationResults<Todo>>();
  const [todoToUpdate, setTodoToUpdate] = useState<Todo | undefined>(undefined);
  const [reload, setReload] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTodos() {
      if (reload) {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:20701/todos");
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
  }, [reload]);

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
      method: "DELETE"
    });
    console.log(response.ok);
    if (!response.ok) {
      return;
    }
    setReload(true);
  }

  function selectTodo(item: Todo) {
    console.log(item);
    setTodoToUpdate(item);
  }

  function unselectTodo() {
    setTodoToUpdate(undefined);
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
  };

  return <TodosContext value={contextValue}>{children}</TodosContext>;
}
