import { use } from "react";
import { TodoListItem } from "./TodoListItem.tsx";
import { TodosContext } from "../../store/todos-context.tsx";
import { NewTodo } from "../NewTodo.tsx";
import { SortingButton } from "../SortingButton.tsx";
import { TodoListPagination } from "./TodoListPagination.tsx";

export function TodoList() {
  const { todos, error, loading, todoToUpdate, unselectTodo, sort, sorting } = use(TodosContext);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error) {
    return <h2>Error: {error}</h2>;
  }
  if (!todos?.total) {
    return (
      <div className="flex flex-col gap-4">
        <h2>No records found, please add one.</h2>
        <NewTodo></NewTodo>
      </div>
    );
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
      direction, sort: sortOn,
    })
  }

  if (todoToUpdate) {
    return <NewTodo saveButtonLabel="Update" todo={todoToUpdate} onCancel={handleCancel}></NewTodo>
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        <NewTodo></NewTodo>
        Total: {todos.total}
        <div className="flex flex-row gap-2 items-center">
          Order by
          <SortingButton value="date_created" onSort={() => handleSort("date_created")} currentSorting={sorting}>
            Date created
          </SortingButton>
          <SortingButton value="content" onSort={() => handleSort("content")} currentSorting={sorting}>
            Content
          </SortingButton>
        </div>
        {todos.data.map((todo) => (
          <TodoListItem key={todo.id} item={todo} />
        ))}
      </div>
      <TodoListPagination></TodoListPagination>
    </>
  );
}
