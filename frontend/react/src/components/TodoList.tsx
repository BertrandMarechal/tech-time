import { use } from "react";
import { TodoListItem } from "./TodoListItem";
import { TodosContext } from "../store/todos-context.tsx";
import { NewTodo } from "./NewTodo.tsx";

export function TodoList() {
  const { todos, error, loading, todoToUpdate, unselectTodo } = use(TodosContext);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error) {
    return <h2>Error: {error}</h2>;
  }
  if (!todos?.total) {
    return <h2>No records found, please add one.</h2>;
  }
  function handleCancel() {
    unselectTodo();
  }

  if (todoToUpdate) {
    return <NewTodo saveButtonLabel="Update" todo={todoToUpdate} onCancel={handleCancel}></NewTodo>
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        {todos.data.map((todo) => (
          <TodoListItem key={todo.id} item={todo} />
        ))}
      </div>
      <NewTodo></NewTodo>
    </>
  );
}
