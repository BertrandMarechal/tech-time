<script lang="ts">
import { defineComponent } from 'vue';
import type { Todo } from "../../models/todo.model.ts";
import Button from "../Button.vue";
import {
  ChevronUpIcon,
  ChevronDoubleDownIcon,
  ChevronDownIcon,
  ChevronDoubleUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/vue/24/solid";
import { useTodoStore } from "../../store/todo.store.ts";

export default defineComponent({
  name: "TodoListItem",
  props: ["todo", "index"],
  components: {
    ChevronUpIcon,
    ChevronDoubleDownIcon,
    ChevronDownIcon,
    ChevronDoubleUpIcon,
    PencilIcon,
    TrashIcon,
    Button,
  },
  computed: {
    moveOneUpDisabled: ({ index }: {index: number}) => {
      const store = useTodoStore();
      return store.from === 0 && index === 0;
    },
    moveTwoUpDisabled: ({ index }: {index: number}) => {
      const store = useTodoStore();
      return store.from === 0 && index < 2;
    },
    moveOneDownDisabled: ({ index }: {index: number}) => {
      const store = useTodoStore();
      const itemIndex = store.from + index + 1;
      return itemIndex === (store.todos?.total || 0);
    },
    moveTwoDownDisabled: ({ index }: {index: number}) => {
      const store = useTodoStore();
      const itemIndex = store.from + index + 1;
      return itemIndex > (store.todos?.total || 0) - 2;
    },
    isSortingOnOrder: () => {
      const store = useTodoStore();
      return store.sorting.sort === "order";
    },
  },
  setup: ({ todo }: { todo: Todo }) => {
    const store = useTodoStore();


    function handleDelete() {
    }

    function handleUpdate() {
    }

    function handleMove(delta: number) {
      if (store.sorting.direction === "asc") {
        store.moveTodo(todo.id, todo.order, delta);
      } else {
        store.moveTodo(todo.id, todo.order, -1 * delta);
      }
    }

    const date = new Date(todo.dateCreated);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return {
      order: todo.order,
      content: todo.content,
      handleDelete,
      handleUpdate,
      handleMove,
      formattedDate,
    };
  },
});
</script>

<template>
  <div
      class="flex flex-row gap-2 items-center justify-between border-stone-800 hover:border-stone-400 border-1 rounded p-2 transition-all duration-300 group">
    <div class="flex flex-col items-start">
      <h2 class="text-xl">
        <span v-if="isSortingOnOrder" class="text-md text-stone-400">{{ order }} - </span>
        {{ content }}
      </h2>
      <h2 class="text-sm text-stone-400">{{ formattedDate }}</h2>
    </div>
    <div class="flex flex-col items-end justify-center gap-2">
      <div class="flex flex-row gap-2 ml-4  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button v-if="isSortingOnOrder" @click="() => handleMove(2)" :disabled="moveTwoDownDisabled">
          <ChevronDoubleDownIcon class="size-4"
                                 :class="{'text-stone-700': moveTwoDownDisabled,'text-amber-400': !moveTwoDownDisabled}"/>
        </Button>
        <Button v-if="isSortingOnOrder" @click="() => handleMove(1)" :disabled="moveOneDownDisabled">
          <ChevronDownIcon class="size-4"
                           :class="{'text-stone-700': moveOneDownDisabled,'text-amber-400': !moveOneDownDisabled}"/>
        </Button>
        <Button v-if="isSortingOnOrder" @click="() => handleMove(-1)" :disabled="moveOneUpDisabled">
          <ChevronUpIcon class="size-4"
                         :class="{'text-stone-700': moveOneUpDisabled,'text-amber-400': !moveOneUpDisabled}"/>
        </Button>
        <Button v-if="isSortingOnOrder" @click="() => handleMove(-2)" :disabled="moveTwoUpDisabled">
          <ChevronDoubleUpIcon class="size-4"
                               :class="{'text-stone-700': moveTwoUpDisabled,'text-amber-400': !moveTwoUpDisabled}"/>
        </Button>
      </div>
      <div class="flex flex-row gap-2 ml-4  opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button @click="handleDelete">
          <div class="flex flex-col items-center justify-center p-2">
            <TrashIcon class="size-4"></TrashIcon>
          </div>
        </Button>
        <Button @click="handleUpdate">
          <div class="flex flex-col items-center justify-center p-2">
            <PencilIcon class="size-4"></PencilIcon>
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>