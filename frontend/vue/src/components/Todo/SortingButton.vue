<script lang="ts">
import { defineComponent } from 'vue';
import Button from "../Button.vue";
import { type SortFields, type SortingParameters, useTodoStore } from "../../store/todo.store.ts";

export default defineComponent({
  name: "SortingButton",
  components: { Button },
  props: ["value", "sorting"],
  computed: {
    ascOrDesc: function ({ value }: {
      value: string;
      sorting: SortingParameters;
    }) {
      const { sorting } = useTodoStore();
      const isSortedOnThisValue = sorting.sort === value;

      let ascOrDesc = "";
      if (isSortedOnThisValue) {
        ascOrDesc = sorting.direction === "asc" ? " (asc.)" : " (desc.)";
      }
      console.log(isSortedOnThisValue, sorting.direction);
      return ascOrDesc;
    },
    isSortedOnThisValue: function ({ value, sorting }: {
      value: string;
      sorting: SortingParameters;
    }) {
      return sorting.sort === value;
    },
  },
  setup: ({ value, sorting }: {
    value: SortFields;
    sorting: SortingParameters;
  }) => {
    const store = useTodoStore();

    function handleSort() {
      let direction: "asc" | "desc" = "asc";
      if (sorting.sort === value) {
        direction = sorting.direction === "asc" ? "desc" : "asc";
      }
      store.sort({
        direction, sort: value
      });
    }

    return { handleSort };
  }
});
</script>

<template>
  <Button :class="{border: isSortedOnThisValue}" @click="handleSort">
    <slot></slot>
    {{ ascOrDesc }}
  </Button>
</template>

<style scoped>

</style>