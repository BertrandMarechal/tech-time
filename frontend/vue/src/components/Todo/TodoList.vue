<script lang="ts">
import { defineComponent } from 'vue';
import TodoListItems from "./TodoListItems.vue";
import SortingButton from "./SortingButton.vue";
import { useTodoStore } from "../../store/todo.store.ts";

export default defineComponent({
  name: "TodoList",
  components: { TodoListItems, SortingButton },
  setup: () => {
    function handleCancel() {

    }

    function handleTextChange(e: Event) {

    }

    const todoState = useTodoStore
    return {
      todoState,
      handleTextChange,
      handleCancel,
    };
  }
});
</script>

<template>

  <div class="flex flex-col gap-2">
<!--    <NewTodo v-if="!todoState.hasAnyRecord"></NewTodo>-->
    <div>
      <div class="flex flex-col my-2 py-4 gap-4 border-b border-t border-stone-700">
        <div class="flex flex-row gap-2">
          <label for="search-text" class="text-xl text-stone-500">
            Search
          </label>
          <input
              id="search-text"
              type="text"
              name="search-text"
              class="px-1 border rounded text-sm"
              @change={handleTextChange}
          />
        </div>
        <div class="flex flex-row gap-2 items-center">
          <span class="text-stone-500">
            Order by
          </span>
          <SortingButton sorting="todoState.sorting" value="date_created">Date created</SortingButton>
          <SortingButton sorting="todoState.sorting" value="content">Content</SortingButton>
          <SortingButton sorting="todoState.sorting" value="order">Order</SortingButton>
        </div>
      </div>
      <TodoListItems></TodoListItems>
    </div>
  </div>
</template>

<style scoped>

</style>