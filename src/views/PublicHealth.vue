<!-- CSS is included in the code: Use TailwindCSS. Install TailwindCSS to see the layout style effect. -->
<template>
    <div class="min-h-[1024px] bg-gray-50">

        <!-- Hero Section -->
        <div class="relative h-[600px] overflow-hidden pt-16">
            <div class="absolute inset-0 bg-cover bg-center" :style="{  transform: `translateY(${scrollY * 0.3}px)` }"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-green-800/50 to-transparent"></div>
            <div class="absolute inset-0 flex items-center">
                <div class="max-w-[600px] px-6 md:px-16 animate-slideInLeft">
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">{{ homeInfo.banner?.bannerTitle }}</h1>
                    <p class="text-lg md:text-xl text-gray-100 mb-8">{{ homeInfo.banner?.bannerDes }}</p>
                    <button class="bg-white text-green-700 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">{{  homeInfo.banner?.bannerBtnName }}</button>
                </div>
            </div>
        </div>

        <!-- Educational Resources Section -->
        <div class="max-w-[1400px] mx-auto px-4 py-16">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{{  homeInfo.EducationalResources?.title }}</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">{{  homeInfo.EducationalResources?.des  }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <div v-for="(category, index) in homeInfo.EducationalResources?.categories" :key="index" class="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 group">
                    <RouterLink 
                        :to="{ name: 'ResourceDetail', params: { index: category.id } }"
                    >
                    <div class="h-48 overflow-hidden">
                        <img :src="category.image" :alt="category.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div class="p-6">
                        <Tag severity="danger" :value="category.RatingValAll?.toFixed(1)"></Tag>
                         <h3 class="text-lg font-semibold text-gray-800 mb-3 group-hover:text-green-700 transition-colors">{{ category.title }}</h3>
                        <p class="text-sm text-gray-600 mb-4">{{ category.description }}</p>
                        <button class="text-green-600 hover:text-green-800 font-medium flex items-center transition-colors">Learn more <i class="fas fa-arrow-right ml-2 transform transition-transform group-hover:translate-x-1"></i></button>
                    </div>
                </RouterLink>
                </div>
            </div>
        </div>

        <!-- Trusted By Section -->
        <div class="bg-gray-100 py-12">
            <div class="max-w-[1400px] mx-auto px-4">
                <p class="text-center text-gray-500 mb-8 text-sm uppercase tracking-wider">Trusted By</p>
                <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
                    <div class="text-gray-400 text-2xl font-bold">HealthOrg</div>
                    <div class="text-gray-400 text-2xl font-bold">NutriLife</div>
                    <div class="text-gray-400 text-2xl font-bold">WellnessPlus</div>
                    <div class="text-gray-400 text-2xl font-bold">HealthyLiving</div>
                    <div class="text-gray-400 text-2xl font-bold">EduHealth</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import axios from "axios";
const router = useRouter();

import { ref, onMounted, onUnmounted, computed } from 'vue';
import { RouterLink } from 'vue-router';

const homeInfo = ref({})

const scrollY = ref(0);


// Scroll event listener
const handleScroll = () => {
    scrollY.value = window.scrollY;
};

onMounted(async ()=>{
  const {data} = await axios.get('/json/home.json');
  homeInfo.value =data;
  console.log(data)

  const {data:allComments} = await axios('http://localhost:3000/api/comments');
  console.log(allComments);

  for(let item of  data.EducationalResources.categories){
    let RatingValAll=0;
    let cont=0
    for(let el of allComments.data){
        if(item.id==el.productId){
            RatingValAll=RatingValAll+el.RatingVal;
            cont=cont+1
        }
    }
    item.RatingValAll= isNaN(RatingValAll / cont) ? 0 : RatingValAll / cont
  }
})

// Listen for scroll events
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});


</script>

<style scoped>

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.animate-slideInLeft {
    animation: slideInLeft 0.8s ease-out forwards;
}

.animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
}
</style>
