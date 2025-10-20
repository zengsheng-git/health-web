<template>
    <div class="min-h-screen bg-gray-50 flex">

        <!-- sidebar -->
        <aside class="w-64 bg-gray-800 text-white fixed h-full z-40 transition-all duration-300 ease-in-out shadow-lg">
            <div class="p-4 border-b border-gray-700">
                <h1 class="text-xl font-bold flex items-center gap-2">
                    <i class="fas fa-shield-alt"></i>
                    <span>Admin Panel</span>
                </h1>
            </div>
            
            <nav class="mt-6 px-2">
                <ul class="space-y-1">
                    <li>
                        <router-link 
                            to="/admin/product-list" 
                            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                            :class="{ 'bg-gray-700 text-white': $route.name === 'AdminProductList' }"
                        >
                            <i class="fas fa-boxes"></i>
                            <span> Product review management </span>
                        </router-link>
                    </li>
                    <!-- Disabled links for future features -->
                    <li>
                        <router-link  
                            to="/admin/userManage" 
                            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                            :class="{ 'bg-gray-700 text-white': $route.name === 'UserManage' }"
                            >
                            <i class="fas fa-users"></i>
                            <span>User management</span>
                        </router-link >
                    </li>
                    
                </ul>
            </nav>
        </aside>
        
        <!-- Main content area -->
        <div class="flex-1 ml-64 bg-gray-50">
            <!-- Header -->
            <header class="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-30 flex items-center justify-end px-6">
                <div class="flex items-center gap-4">
                    <Button :as="RouterLink" to="/PublicHealth" label="Home"></Button>
                    <span class="text-gray-700">{{ userName }}</span>
                    <button @click="handleLogout" class="text-gray-600 hover:text-gray-900 transition-colors">
                        Logout
                    </button>
                </div>
            </header>
            
            <!-- Main view -->
            <main class="pt-20 px-6 pb-10">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter,RouterLink } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/common/firebase';

const router = useRouter();

// Log in or not
const userName = computed(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.displayName  || user.email || 'Admin';
});

// Logout
const handleLogout = async () => {
    try {
        await signOut(auth);
    } catch (e) {
        console.error('signOut error:', e);
    } finally {
        localStorage.removeItem('user');
        router.push('/auth/login');
    }
};
</script>

<style scoped>
router-link {
    text-decoration: none;
    display: block;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    aside {
        width: 60px;
    }
    aside span:not(.icon-text) {
        display: none;
    }
    .flex-1 {
        margin-left: 60px;
    }
    header {
        left: 60px;
    }
}
</style>
