<script lang="ts">
import { defineComponent, inject } from 'vue';
import TodoListItem from './TodoListItem.vue';
import {todoState} from "../../store/todo.store.ts";

export default defineComponent({
  name: "TodoListItems",
  components: { TodoListItem },
  setup: () => {
    return { todoState };
  }
});
</script>

<template>
  <TodoListItem v-for="(todo, index) in todoState?.todos?.data" :index="index" :todo="todo"></TodoListItem>
</template>

<style scoped>

</style>