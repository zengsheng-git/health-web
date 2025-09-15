import { createApp } from "vue";
import App from "./App.vue";

import ToastService from "primevue/toastservice";

const app = createApp(App);

app.use(ToastService);

export default app;
