<!-- CSS is included in the code: Use TailwindCSS. Install TailwindCSS to see the layout style effect. -->
<template>
        <nav class="h-16 border-b bg-white/95 backdrop-blur-sm fixed w-full z-50 transition-all duration-300" :class=" 'shadow-md'">
            <div class="max-w-[1400px] mx-auto flex items-center px-4 md:px-8 justify-between h-full">
                <div class="flex items-center gap-4 md:gap-12">
                    <h1 class="text-xl font-bold flex items-center gap-2">
                        <span>{{  homeInfo.nav?.logoTitle }}</span>
                    </h1>
                    <div class="hidden md:flex gap-6">
                        <RouterLink v-for="item in homeInfo.nav?.navList" :to="item.url" class="text-gray-600 hover:text-green-600 transition-colors py-2 border-b-2 border-transparent hover:border-green-500">
                                    {{ item.name }}
                        </RouterLink>
                    </div>
                    <!-- Mobile menu button -->
                    <button class="md:hidden text-gray-600" @click="toggleMobileMenu">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
                <div class="flex items-center gap-4">
                    <!-- <div class="relative">
                        <button class="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors" @click="toggleLanguage">
                            <span>{{ currentLanguage }}</span>
                            <i class="fas fa-chevron-down text-xs transition-transform duration-300" :class="{ 'rotate-180': showLanguage }"></i>
                        </button>
                        <div
                            v-if="showLanguage"
                            class="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-40 transform transition-all duration-300 origin-top-right scale-95 opacity-0"
                            :class="{ 'scale-100 opacity-100': showLanguage }"
                        >
                            <button v-for="lang in languages" :key="lang" @click="selectLanguage(lang)" class="w-full text-left px-4 py-2 hover:bg-green-50 transition-colors text-gray-700 hover:text-green-700">
                                {{ lang }}
                            </button>
                        </div>
                    </div> -->
                   
                    <Button v-if="isAdmin" :as="RouterLink" to="/admin/product-list" label="Dashbord"></Button>
                    <Button v-if="!isLogin" :as="RouterLink" to="/auth/login" label="Login"></Button>
                     <SplitButton v-else icon="pi pi-user" :label="userName" :model="items" />
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t animate-fadeIn">
                <div class="flex flex-col gap-2 p-4">
                   <button v-for="item in homeInfo.nav?.navList" class="text-left py-3 px-4 hover:bg-green-50 rounded-lg transition-colors text-gray-700">
                     {{ item }}
                    </button>
                </div>
            </div>
        </nav>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';


const isLogin = computed(() => {
     const userInfo = JSON.parse(localStorage.getItem('user'));
     console.log(userInfo);
    return userInfo?.GivenName.length > 0;
});

const isAdmin = computed(() => {
     const userInfo = JSON.parse(localStorage.getItem('user'));
     console.log(userInfo);
    return userInfo?.role==='admin'
});

const userName = computed(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    console.log(userInfo);
    return userInfo?.GivenName;
});
const homeInfo = ref({})

const items = [
    {
        label: 'Logout',
        command: () => {
            // router.push('/auth/login');
            localStorage.removeItem('user');
            location.reload();
        }
    }
];

// Language selection related 
const currentLanguage = ref('English');
const showLanguage = ref(false);
const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];

// Mobile menu
const mobileMenuOpen = ref(false);


// Language switching method
const toggleLanguage = () => {
    showLanguage.value = !showLanguage.value;
};

const selectLanguage = (lang: string) => {
    currentLanguage.value = lang;
    showLanguage.value = false;
};

// Mobile menu switch
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};


onMounted(async ()=>{
    const {data} = await axios.get('/json/home.json');
    homeInfo.value =data;
})

</script>

