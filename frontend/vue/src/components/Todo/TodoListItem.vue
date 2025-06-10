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
  setup: ({ todo, index }: {todo: Todo; index: number}) =>{
    console.log(todo, index);
    const sort = "order";
    const from = 0;
    const total = 10;

    const isSortingOnOrder = sort === "order";

    function handleDelete() {
    }

    function handleUpdate() {
    }

    function handleMove() {
    }

    const date = new Date(todo.dateCreated);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    const itemIndex = from + index + 1;
    const moveOneUpDisabled = from === 0 && index === 0;
    const moveTwoUpDisabled = from === 0 && index < 2;
    const moveOneDownDisabled = itemIndex === total;
    const moveTwoDownDisabled = itemIndex > total - 2;

    return {
      isSortingOnOrder,
      order: todo.order,
      content: todo.content,
      handleDelete,
      handleUpdate,
      handleMove,
      formattedDate,
      moveOneUpDisabled,
      moveTwoUpDisabled,
      moveOneDownDisabled,
      moveTwoDownDisabled,
    }
  },
});
</script>

<template>
  <div class="flex flex-row gap-2 items-center justify-between border-stone-800 hover:border-stone-400 border-1 rounded p-2 transition-all duration-300 group">
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
        <ChevronDoubleDownIcon class="size-4" :class="{'text-stone-700': moveTwoDownDisabled,'text-amber-400': !moveTwoDownDisabled}" />
        </Button>
        <Button v-if="isSortingOnOrder" @click="() => handleMove(1)" :disabled="moveOneDownDisabled">
        <ChevronDownIcon class="size-4" :class="{'text-stone-700': moveOneDownDisabled,'text-amber-400': !moveOneDownDisabled}" />
        </Button>
        <Button v-if="isSortingOnOrder" @click="() => handleMove(-1)" :disabled="moveOneUpDisabled">
        <ChevronUpIcon class="size-4" :class="{'text-stone-700': moveOneUpDisabled,'text-amber-400': !moveOneUpDisabled}" />
        </Button>
        <Button v-if="isSortingOnOrder" @click="() => handleMove(-2)" :disabled="moveTwoUpDisabled">
        <ChevronDoubleUpIcon class="size-4" :class="{'text-stone-700': moveTwoUpDisabled,'text-amber-400': !moveTwoUpDisabled}" />
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