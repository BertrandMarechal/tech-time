import { use } from "react";
import { TodosContext } from "../../store/todos-context.tsx";
import { NewTodo } from "../NewTodo.tsx";
import { SortingButton } from "../SortingButton.tsx";
import { TodoListPagination } from "./TodoListPagination.tsx";
import { TodoListItems } from "./TodoListItems.tsx";
import { EditTodo } from "../EditTodo.tsx";

// todo need to fix the behaviour of the search field
export function TodoList() {
  const { error, loading, todoToUpdate, unselectTodo, todos, sort, sorting, filterByText, searchText } = use(TodosContext);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error) {
    return <h2>Error: {error}</h2>;
  }
  function handleCancel() {
    unselectTodo();
  }
  function handleSort(sortOn: "date_created" | "content" | "order") {
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
    return <EditTodo todo={todoToUpdate} onCancel={handleCancel}></EditTodo>;
  }
  function handleTextChange(e: Event) {
    filterByText((e.target as any).value);
  }
  const hideNewTodo = !todos?.total;
  return (
    <>
      <div className="flex flex-col gap-2">
        {!hideNewTodo && <NewTodo></NewTodo>}
        <div className="flex flex-col my-2 py-4 gap-4 border-b border-t border-stone-700">
          <div className="flex flex-row gap-2">
            <label htmlFor="search-text" className="text-xl text-stone-500">
              Search
            </label>
            <input
              id="search-text"
              type="text"
              name="search-text"
              className="px-1 border rounded text-sm"
              onChange={handleTextChange}
              defaultValue={searchText}
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
          <span className="text-stone-500">
            Order by
          </span>
            <SortingButton value="date_created" onSort={() => handleSort("date_created")} currentSorting={sorting}>
              Date created
            </SortingButton>
            <SortingButton value="content" onSort={() => handleSort("content")} currentSorting={sorting}>
              Content
            </SortingButton>
            <SortingButton value="order" onSort={() => handleSort("order")} currentSorting={sorting}>
              Order
            </SortingButton>
          </div>
        </div>
        <TodoListItems></TodoListItems>
      </div>
      <TodoListPagination></TodoListPagination>
    </>
  );
}
