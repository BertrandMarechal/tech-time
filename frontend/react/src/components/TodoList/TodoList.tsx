import { use } from "react";
import { TodosContext } from "../../store/todos-context.tsx";
import { NewTodo } from "../NewTodo.tsx";
import { SortingButton } from "../SortingButton.tsx";
import { TodoListPagination } from "./TodoListPagination.tsx";
import { TodoListItems } from "./TodoListItems.tsx";

export function TodoList() {
  const { error, loading, todoToUpdate, unselectTodo, sort, sorting, filterByText, searchText } = use(TodosContext);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error) {
    return <h2>Error: {error}</h2>;
  }
  function handleCancel() {
    unselectTodo();
  }
  function handleSort(sortOn: "date_created" | "content") {
    let direction: "asc" | "desc" = "asc";
    if (sorting.sort === sortOn) {
      direction = sorting.direction === "asc" ? "desc" : "asc";
    }
    sort({
      direction,
      sort: sortOn,
    });
  }

  if (todoToUpdate) {
    return <NewTodo saveButtonLabel="Update" todo={todoToUpdate} onCancel={handleCancel}></NewTodo>;
  }
  function handleTextChange(e: Event) {
    filterByText((e.target as any).value);
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        <NewTodo></NewTodo>
        <div className="flex flex-row gap-2">
          <label htmlFor="search-text" className="text-xl">
            Search
          </label>
          <input
            id="search-text"
            type="text"
            name="search-text"
            className="p-1 border rounded"
            onChange={handleTextChange}
            defaultValue={searchText}
          />
        </div>
        <div className="flex flex-row gap-2 items-center">
          Order by
          <SortingButton value="date_created" onSort={() => handleSort("date_created")} currentSorting={sorting}>
            Date created
          </SortingButton>
          <SortingButton value="content" onSort={() => handleSort("content")} currentSorting={sorting}>
            Content
          </SortingButton>
        </div>
        <TodoListItems></TodoListItems>
      </div>
      <TodoListPagination></TodoListPagination>
    </>
  );
}
