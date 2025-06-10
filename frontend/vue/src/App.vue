<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import Navbar from './components/Navbar.vue'
import TodoList from './components/Todo/TodoList.vue'
import { getHasAnyRecord, getTodos, moveTodo, useTodoStore } from "./store/todo.store.ts";
const store = useTodoStore();
store.$onAction(({ name, args, store }) => {
  switch (name) {
        case "sort":
        case "nextPage":
        case "previousPage":
        case "firstPage":
        case "lastPage":
        case "updateSize":
        case "filterByText":
        case "backendUpdated":
        case "getTodos":
            getTodos(store);
            getHasAnyRecord(store);
            break;
        case "addTodo":
            // addTodo(args[0] as Pick<Todo, "content">);
            break;
        case "removeTodo":
            // removeTodo(...args as any);
            break;
        case "updateTodo":
            // updateTodo(...args as any);
            break;
        case "moveTodo":
            moveTodo(store, ...(args as any[]));
            break;
    }
});
store.getTodos();
</script>

<template>
  <Navbar title="Todos"></Navbar>
  <TodoList></TodoList>
<!--  <HelloWorld msg="Vite + Vue" />-->
</template>

<style scoped>
</style>
