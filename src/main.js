import router from './router';
import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import app from "./app";
import '@/assets/styles.scss';
import plugins from "./plugins/index";

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: { 50: "#f3f7f9", 100: "#c3d7e2", 200: "#94b8cb", 300: "#6598b3", 400: "#36799c", 500: "#075985", 600: "#064c71", 700: "#053e5d", 800: "#043149", 900: "#032435", 950: "#021621" },
        // primary: { 50: "#ecf4ff", 100: "#cde5ff", 200: "#9bcdff", 300: "#76b3ec", 400: "#5997cf", 500: "#075985", 600: "#085b8f", 700: "#004a77", 800: "#003355", 900: "#00213a", 950: "#00213a" },
    },
});
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: ".app-dark",
        },
    },
});
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(plugins);
app.mount('#app');
