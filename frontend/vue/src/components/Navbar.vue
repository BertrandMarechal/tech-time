<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { BackendType, CookieNames, FrontendType } from "../enums.ts";
import Button from "./Button.vue"
import { type VueCookies } from "vue-cookies";
import { todoState } from "../store/todo.store.ts";

export default defineComponent({
  name: "Navbar",
  props: ["title"],
  components: {
    Button
  },
  setup(props) {
    const selectedBackend = ref(BackendType.Python);
    const selectedFrontend = ref(FrontendType.Vue);
    const $cookies = inject<VueCookies>('$cookies');

    function setBackend(backend: BackendType){
      selectedBackend.value = backend;
      todoState.backendUpdated();
    }
    function setFrontend(frontend: FrontendType){
      selectedFrontend.value = frontend;
      $cookies?.set(CookieNames.Frontend, frontend);
      document.location.reload();
    }
    return {
      selectedBackend,
      selectedFrontend,
      title: props.title,
      setBackend,
      setFrontend,
      BackendType,
      FrontendType,
      pythonImage: "/assets/python.png",
      goImage: "/assets/go.png",
    }
  }
});
</script>

<template>
  <nav class="sticky top-0 z-50 left-0 right-0 flex justify-between items-center p-2 bg-amber-900 h-14">
    <ul class="flex items-center">
      <li class="text-xl ml-2 text-white font-semibold">{{ title }}</li>
    </ul>
    <div class="flex flex-row gap-4">
      <ul class="flex flex-row gap-2">
        <li>
          <Button @click="() => setFrontend(FrontendType.Vue)" class="bg-transparent hover:bg-transparent hover:border-amber-300 border" :class="{'border-amber-400': selectedFrontend === FrontendType.Vue,'border-transparent': selectedFrontend !== FrontendType.Vue}">
            <div class="flex flex-row gap-2 items-center">
              <img src="../assets/vue.svg" alt="Vue Logo" class="w-6 h-6 rounded-full" />
              <span class="text-amber-300">Vue</span>
            </div>
          </Button>
        </li>
        <li>
          <Button @click="() => setFrontend(FrontendType.React)" class="bg-transparent hover:bg-transparent hover:border-amber-300 border" :class="{'border-amber-400': selectedFrontend === FrontendType.React,'border-transparent': selectedFrontend !== FrontendType.React}">
            <div class="flex flex-row gap-2 items-center">
              <img src="../assets/react.png" alt="React Logo" class="w-6 h-6 rounded-full" />
              <span class="text-amber-300">React</span>
            </div>
          </Button>
        </li>
      </ul>
      <ul class="flex flex-row gap-2">
        <li>
          <Button @click="() => setBackend(BackendType.Python)" class="bg-transparent hover:bg-transparent hover:border-amber-300 border" :class="{'border-amber-400': selectedBackend === BackendType.Python,'border-transparent': selectedBackend !== BackendType.Python}">
            <div class="flex flex-row gap-2 items-center">
              <img src="../assets/python.png" alt="Python Logo" class="w-6 h-6 rounded-full" />
              <span class="text-amber-300">Python</span>
            </div>
          </Button>
        </li>
        <li>
          <Button @click="() => setBackend(BackendType.Go)" class="bg-transparent hover:bg-transparent hover:border-amber-300 border" :class="{'border-amber-400': selectedBackend === BackendType.Go,'border-transparent': selectedBackend !== BackendType.Go}">
            <div class="flex flex-row gap-2 items-center">
              <img src="../assets/go.png" alt="Python Logo" class="w-6 h-6 rounded-full" />
              <span class="text-amber-300">Go</span>
            </div>
          </Button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>

</style>