import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import 'vue-sonner/style.css';
import { i18n } from '@core/i18n';
import { Can } from '@core/permissions';
import { router } from './router';
import './style.css';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(i18n);
app.use(VueQueryPlugin);
app.use(router);

// Register Can component globally for RBAC permission checks in templates
app.component('Can', Can);

app.mount('#app');
