import type { Todo } from "../../models/todo.model.ts";
import { use } from "react";
import { TodosContext } from "../../store/todos-context.tsx";
import { Button } from "../Button.tsx";
import { ChevronUpIcon, ChevronDoubleDownIcon, ChevronDownIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/solid";

export function TodoListItem({ item, index }: { item: Todo; index: number }) {
  const {
    removeTodo,
    selectTodo,
    moveTodo,
    sorting: { direction, sort },
    todos,
    from,
  } = use(TodosContext);
  if (!todos) {
    return null;
  }
  const isSortingOnOrder = sort === "order";

  function handleDelete() {
    removeTodo(item.id);
  }

  function handleUpdate() {
    selectTodo(item);
  }

  function handleMove(delta: number) {
    if (direction === "asc") {
      moveTodo(item.id, item.order, delta);
    } else {
      moveTodo(item.id, item.order, -1 * delta);
    }
  }
  const {total} = todos;

  const date = new Date(item.date_created);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  const itemIndex = from + index + 1;
  const moveOneUpDisabled = from === 0 && index === 0;
  const moveTwoUpDisabled = from === 0 && index < 2;
  const moveOneDownDisabled = itemIndex === total;
  const moveTwoDownDisabled = itemIndex > total - 2;

  return (
    <div className="flex flex-row gap-2 items-center justify-between hover:bg-stone-100 rounded p-2 transition-all duration-300 group">
      <div className="flex flex-col items-start">
        <h2 className="text-xl">
          {isSortingOnOrder && <span className="text-md text-stone-400">{item.order} - </span>}
          {item.content}
        </h2>
        <h2 className="text-sm text-stone-400">{formattedDate}</h2>
      </div>
      <div className="flex flex-row gap-2 ml-4  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isSortingOnOrder && (
          <Button onClick={() => handleMove(2)} disabled={moveTwoDownDisabled}>
            <ChevronDoubleDownIcon className={`size-4 ${moveTwoDownDisabled ? "text-stone-700" : "text-blue-500"}`} />
          </Button>
        )}
        {isSortingOnOrder && (
          <Button onClick={() => handleMove(1)} disabled={moveOneDownDisabled}>
            <ChevronDownIcon className={`size-4 ${moveOneDownDisabled ? "text-stone-700" : "text-blue-500"}`} />
          </Button>
        )}
        {isSortingOnOrder && (
          <Button onClick={() => handleMove(-1)} disabled={moveOneUpDisabled}>
            <ChevronUpIcon className={`size-4 ${moveOneUpDisabled ? "text-stone-700" : "text-blue-500"}`} />
          </Button>
        )}
        {isSortingOnOrder && (
          <Button onClick={() => handleMove(-2)} disabled={moveTwoUpDisabled}>
            <ChevronDoubleUpIcon className={`size-4 ${moveTwoUpDisabled ? "text-stone-700" : "text-blue-500"}`} />
          </Button>
        )}
        <Button onClick={handleDelete}>Delete</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </div>
    </div>
  );
}
