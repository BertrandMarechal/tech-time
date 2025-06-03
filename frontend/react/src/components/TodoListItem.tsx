import type { Todo } from "../models/todo.model";
import { use } from "react";
import { TodosContext } from "../store/todos-context.tsx";
import { Button } from "./Button.tsx";

export function TodoListItem({ item }: { item: Todo }) {
  const { removeTodo, selectTodo } = use(TodosContext);
  function handleDelete() {
    removeTodo(item.id);
  }
  function handleUpdate() {
    selectTodo(item);
  }
  return (
    <div className="flex flex-row gap-2 items-center justify-between">
      <h2 className="text-xl">{item.content}</h2>
      <div className="flex flex-row gap-2 ml-4">
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </div>
    </div>
  );
}
