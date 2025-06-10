<script lang="ts">
import { defineComponent } from 'vue';
import TodoListItem from './TodoListItem.vue';
import { useTodoStore } from "../../store/todo.store.ts";

export default defineComponent({
  name: "TodoListItems",
  components: { TodoListItem },
  computed: {
    todos: () => {
      const store = useTodoStore();
      return store.todos;
    }
  },
});
</script>

<template>
  <div v-if="!todos?.total" class="flex flex-col gap-4">
    <h2>No records found, please add one.</h2>
    <!--    todo add a condition on has any record to show the option below-->
    <!--    <NewTodo></NewTodo>-->
  </div>
  <div v-else>
    <div class="flex flex-row gap-2">
      <span class="text-stone-500">Total:</span>
      <span>{{ todos?.total }}</span>
    </div>
    <TodoListItem v-for="(todo, index) in todos?.data" :index="index" :todo="todo"></TodoListItem>
  </div>
</template>

<style scoped>

</style>