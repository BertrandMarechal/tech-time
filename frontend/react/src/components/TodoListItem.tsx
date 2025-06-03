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

  const date = new Date(item.date_created);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  return (
    <div className="flex flex-row gap-2 items-center justify-between hover:bg-stone-100 rounded p-2">
      <div className="flex flex-col items-start">
        <h2 className="text-xl">{item.content}</h2>
        <h2 className="text-sm text-stone-400">{formattedDate}</h2>
      </div>
      <div className="flex flex-row gap-2 ml-4">
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </div>
    </div>
  );
}
