<script lang="ts">
import { defineComponent } from 'vue';
import TodoListItem from './TodoListItem.vue';
import { todoState } from "../../store/todo.store.ts";

export default defineComponent({
  name: "TodoListItems",
  components: { TodoListItem },
  setup: () => {
    return { todoState };
  }
});
</script>

<template>
  <div v-if="!todoState?.todos?.total" class="flex flex-col gap-4">
    <h2>No records found, please add one.</h2>
<!--    todo add a condition on has any record to show the option below-->
<!--    <NewTodo></NewTodo>-->
  </div>
  <div v-else>
    <div class="flex flex-row gap-2">
      <span class="text-stone-500">Total:</span>
      <span>{{ todoState?.todos?.total }}</span>
    </div>
    <TodoListItem v-for="(todo, index) in todoState?.todos?.data" :index="index" :todo="todo"></TodoListItem>
  </div>
</template>

<style scoped>

</style>