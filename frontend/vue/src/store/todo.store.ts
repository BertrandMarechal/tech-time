import { reactive } from 'vue';
import type { PaginationResults } from "../models/pagination.models.ts";
import type { Todo } from "../models/todo.model.ts";

const PORT = 20700;

type SortFields = "date_created" | "content" | "order";
export type SortingParameters = {
    sort: SortFields;
    direction: "asc" | "desc";
};

export const todoState = reactive<{
    todos?: PaginationResults<Todo>;
    todoToUpdate?: Todo;
    loading: boolean;
    size: number;
    from: number;
    error: string | null;
    searchText: string;
    sorting: SortingParameters;
}>({
    loading: false,
    size: 25,
    from: 0,
    error: null,
    searchText: "",
    sorting: {
        sort: "date_created",
        direction: "asc",
    },
});

async function getTodos() {
    const query = new URLSearchParams({
        sort: todoState.sorting.sort,
        direction: todoState.sorting.direction,
        from: `${todoState.from}`,
        size: `${todoState.size}`,
        text: todoState.searchText,
    });
    const response = await fetch(`http://localhost:${PORT}/api/todos?${query.toString()}`);
    if (!response.ok) {
        todoState.error = await response.text();
        todoState.loading = false;
        return;
    }
    todoState.todos = await response.json();
    todoState.loading = false;
}

getTodos();