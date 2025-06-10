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
    addTodo: (todo: Pick<Todo, "content">) => void;
    selectTodo: (todo: Todo) => void;
    unselectTodo: () => void;
    updateTodo: (id: number, todo: Pick<Todo, "content">) => void;
    removeTodo: (id: number) => void;
    moveTodo: (id: number, currentOrder: number, deltaOrder: number) => void;
    sort: (params: SortingParameters) => void;
    updateSize: (size: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    firstPage: () => void;
    lastPage: () => void;
    filterByText: (text: string) => void;
    backendUpdated: () => void;
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
    addTodo,
    selectTodo,
    unselectTodo,
    updateTodo,
    moveTodo,
    removeTodo,
    sort,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    updateSize,
    filterByText,
    backendUpdated,
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

async function addTodo(enteredTodoData: Pick<Todo, "content">) {
    const response = await fetch(`http://localhost:${PORT}/api/todos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(enteredTodoData),
    });

    if (!response.ok) {
        return;
    }
    getTodos();
}

async function updateTodo(id: number, enteredTodoData: Pick<Todo, "content">) {
    const response = await fetch(`http://localhost:${PORT}/api/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(enteredTodoData),
    });

    if (!response.ok) {
        return;
    }
    todoState.todoToUpdate = undefined;
    getTodos();
}

async function moveTodo(id: number, currentOrder: number, deltaOrder: number) {
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
    todoState.todoToUpdate = undefined;
    getTodos();
}

async function removeTodo(id: number) {
    const response = await fetch(`http://localhost:${PORT}/api/todos/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        return;
    }
    getTodos();
}

function selectTodo(item: Todo) {
    todoState.todoToUpdate = item;
}

function unselectTodo() {
    todoState.todoToUpdate = undefined;
}

function sort(desiredSorting: { sort: SortFields; direction: "asc" | "desc" }) {
    todoState.sorting = desiredSorting;
    getTodos();
}

function nextPage() {
    todoState.from = todoState.from + todoState.size;
    getTodos();
}
function previousPage() {
    todoState.from = todoState.from - todoState.size;
    getTodos();
}
function firstPage() {
    todoState.from = 0;
    getTodos();
}
function lastPage() {
    todoState.from = Math.floor((todoState.todos?.total || 0) / todoState.size) * todoState.size;
    getTodos();
}
function updateSize(size: number) {
    todoState.size = size;
    getTodos();
}
function filterByText(text: string) {
    todoState.searchText = text;
    getTodos();
}
function backendUpdated() {
    getTodos();
}

getTodos();