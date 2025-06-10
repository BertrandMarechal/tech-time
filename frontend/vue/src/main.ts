import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueCookies from "vue-cookies";

const app = createApp(App);
app.use(VueCookies).mount('#app');