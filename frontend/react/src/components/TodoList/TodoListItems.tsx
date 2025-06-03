import { TodoListItem } from "./TodoListItem.tsx";
import { use } from "react";
import { TodosContext } from "../../store/todos-context.tsx";
import { NewTodo } from "../NewTodo.tsx";

export function TodoListItems() {
  const { todos } = use(TodosContext);
  if (!todos?.total) {
    return (
      <div className="flex flex-col gap-4">
        <h2>No records found, please add one.</h2>
        <NewTodo></NewTodo>
      </div>
    );
  }
  return (
    <>
      <span>Total: {todos.total}</span>
      {todos.data.map((todo) => (
        <TodoListItem key={todo.id} item={todo} />
      ))}
    </>
  )
}