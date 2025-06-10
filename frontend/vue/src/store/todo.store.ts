import type { PaginationResults } from "../models/pagination.models.ts";
import type { Todo } from "../models/todo.model.ts";
import { defineStore } from 'pinia';

const PORT = 20700;

export type SortFields = "date_created" | "content" | "order";
export type SortingParameters = {
    sort: SortFields;
    direction: "asc" | "desc";
};

interface TodoState {
    todos?: PaginationResults<Todo>;
    todoToUpdate?: Todo;
    loading: boolean;
    saving: boolean;
    hasAnyRecord: boolean;
    size: number;
    from: number;
    error: string | null;
    searchText: string;
    sorting: SortingParameters;
}

export const useTodoStore = defineStore("todos", {
    state: (): TodoState => ({
        loading: true,
        saving: true,
        hasAnyRecord: false,
        size: 25,
        from: 0,
        error: null,
        searchText: "",
        sorting: {
            sort: "date_created",
            direction: "asc",
        },
    }),
    actions: {
        getTodos() {
            this.loading = true;
        },
        gotError(error: string) {
            this.error = error;
            this.loading = false;
        },
        gotTodos(todos: PaginationResults<Todo>) {
            this.todos = todos;
            this.loading = false;
        },
        gotHasAnyRecord(hasAnyRecord: boolean) {
            this.hasAnyRecord = hasAnyRecord;
        },
        sort(sorting: SortingParameters) {
            this.sorting = sorting;
        },
        nextPage() {
            this.from = this.from + this.size;
        },
        previousPage() {
            this.from = this.from - this.size;
        },
        firstPage() {
            this.from = 0;
        },
        lastPage() {
            this.from = Math.floor((this.todos?.total || 0) / this.size) * this.size;
        },
        updateSize(size: number) {
            this.size = size;
        },
        filterByText(text: string) {
            this.searchText = text;
        },
        addTodo() {
            this.saving = true;
        },
        addedTodo() {
            this.saving = false;
        },
        updateTodo() {
            this.saving = true;
        },
        updatedTodo() {
            this.saving = false;
            this.todoToUpdate = undefined;
        },
        moveTodo(_id: number, _currentOrder: number, _delta: number) {
            this.saving = true;
        },
        movedTodo() {
            this.saving = false;
            this.todoToUpdate = undefined;
        },
        removeTodo() {
            this.saving = true;
        },
        removedTodo() {
            this.saving = false;
        },
        selectTodo(todo: Todo) {
            this.todoToUpdate = todo;
        },
        unselectTodo() {
            this.todoToUpdate = undefined;
        },
        backendUpdated() {

        },
    }
});

export async function getTodos(store: any) {
    const query = new URLSearchParams({
        sort: store.sorting.sort,
        direction: store.sorting.direction,
        from: `${store.from}`,
        size: `${store.size}`,
        text: store.searchText,
    });
    const response = await fetch(`http://localhost:${PORT}/api/todos?${query.toString()}`);
    if (!response.ok) {
        store.gotError(await response.text());
        return;
    }
    store.gotTodos(await response.json());
}

export async function getHasAnyRecord(store: any) {
    const response = await fetch(`http://localhost:${PORT}/api/todos?size=0`);
    if (!response.ok) {
        store.gotError(await response.text());
        return;
    }
    store.gotHasAnyRecord((await response.json()).total > 0);
}

// async function addTodo(store: any, enteredTodoData: Pick<Todo, "content">) {
//     const response = await fetch(`http://localhost:${PORT}/api/todos`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(enteredTodoData),
//     });
//
//     if (!response.ok) {
//         return;
//     }
//     store.addedTodo();
// }
//
// async function updateTodo(id: number, enteredTodoData: Pick<Todo, "content">) {
//     const response = await fetch(`http://localhost:${PORT}/api/todos/${id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(enteredTodoData),
//     });
//
//     if (!response.ok) {
//         return;
//     }
//     store.updatedTodo();
// }
//
export async function moveTodo(store: any, id: number, currentOrder: number, deltaOrder: number) {
    const response = await fetch(`http://localhost:${PORT}/api/todos/${id}/order`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ delta: deltaOrder, currentOrder }),
    });

    if (!response.ok) {
        return;
    }
    store.updatedTodo();
}
//
// async function removeTodo(id: number) {
//     const response = await fetch(`http://localhost:${PORT}/api/todos/${id}`, {
//         method: "DELETE",
//     });
//     if (!response.ok) {
//         return;
//     }
//
//     store.removedTodo();
// }
