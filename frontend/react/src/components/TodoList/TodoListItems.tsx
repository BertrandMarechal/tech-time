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
      <div className="flex flex-row gap-2">
        <span className="text-stone-500">Total:</span>
        <span>{todos.total}</span>
      </div>
      {todos.data.map((todo, i) => (
        <TodoListItem key={todo.id} item={todo} index={i} />
      ))}
    </>
  );
}
