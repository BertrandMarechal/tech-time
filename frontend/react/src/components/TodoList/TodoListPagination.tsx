import { SizeButton } from "../SizeButton.tsx";
import { Button } from "../Button.tsx";
import { use } from "react";
import { TodosContext } from "../../store/todos-context.tsx";

export function TodoListPagination() {
  const { todos,updateSize, size, from, nextPage, previousPage, firstPage, lastPage } = use(TodosContext);

  if (!todos) {
    return null;
  }
  const isOnFirst = from === 0;
  const isOnLast = from + size >= todos.total;
  const enablePrevious = from > 0;
  const enableNext = todos.total > from + size;
  const showPaginationButtons = todos.total > size;

  function handlePrevious() {
    previousPage();
  }
  function handleNext() {
    nextPage();
  }
  function handleFirst() {
    firstPage();
  }
  function handleLast() {
    lastPage();
  }
  function handleSetSize(newSize: number) {
    updateSize(newSize)
  }

  return (
    <div className="flex flex-col gap-4 mt-4 items-center">
      <div className="flex flex-row gap-2 items-center">
        {showPaginationButtons && <Button disabled={isOnFirst} onClick={handleFirst}>First</Button>}
        {showPaginationButtons && <Button disabled={!enablePrevious} onClick={handlePrevious}>Previous</Button>}
        {showPaginationButtons && <Button disabled={!enableNext} onClick={handleNext}>Next</Button>}
        {showPaginationButtons && <Button disabled={isOnLast} onClick={handleLast}>Last</Button>}
      </div>
      <div className="flex flex-row gap-2 items-center mb-6">
        <span className="text-stone-500">
          Records per page:
        </span>
        <SizeButton value={5} onSet={() => handleSetSize(5)} currentSize={size}>
          5
        </SizeButton>
        <SizeButton value={10} onSet={() => handleSetSize(10)} currentSize={size}>
          10
        </SizeButton>
        <SizeButton value={25} onSet={() => handleSetSize(25)} currentSize={size}>
          25
        </SizeButton>
        <SizeButton value={50} onSet={() => handleSetSize(50)} currentSize={size}>
          50
        </SizeButton>
      </div>

    </div>
  )
}