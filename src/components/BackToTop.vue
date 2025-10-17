<template>
    <button 
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 bg-[#075985] text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-110 z-50"
        aria-label="Back to top"
    >
        <i class="pi pi-arrow-up"></i>
    </button>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showBackToTop = ref(false);

// Scroll event listener
const handleScroll = () => {
    showBackToTop.value = window.scrollY > 300;
};

// Scroll to top function
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Lifecycle hooks
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>