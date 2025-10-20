<template>
    <div class="max-w-[1400px] mx-auto p-4">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">Product list</h1>
        <p class="text-gray-500">Click "Manage Comments" to enter the comment management page for the corresponding product</p>
      </div>
  
      <!-- Loading state -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Loading indicator -->
        <div 
          v-for="product in productList" 
          :key="product.id" 
          class="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100"
        >
          <!-- Product pictures-->
          <div class="h-48 overflow-hidden">
            <img 
              :src="product.image" 
              :alt="product.title" 
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
  
          <!-- Product details and manage comments button -->
          <div class="p-6">
            <Tag severity="danger" :value="product.RatingValAll?.toFixed(1)"></Tag>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ product.title }}</h3>
            <p class="text-gray-600 text-sm mb-6 line-clamp-2">{{ product.description }}</p>
  
            <!-- Manage Comments button -->
            <RouterLink 
              :to="{ 
                name: 'AdminCommentManage', 
                params: { productId: product.id,} ,
                query:{RatingValAll:product.RatingValAll }
              }"
              class="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <i class="fas fa-comments mr-1"></i> management comments
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { RouterLink } from 'vue-router';
  import axios from 'axios';
import { db } from '@/common/firebase';
import { doc, getDoc } from 'firebase/firestore';
  
  // Product list data
  const productList = ref([]);
  // Loading state
  const isLoading = ref(true);
  // Error message
  const errorMsg = ref('');
  
  // Fetch product list on component mount
  onMounted(async () => {
    try {
      isLoading.value = true;
      const { data } = await axios.get('/json/home.json');
      // Assuming the JSON structure contains an array of products under EducationalResources.categories
      productList.value = data.EducationalResources.categories.map((item, idx) => ({
        ...item,
        id: item.id || idx + 1 // Ensure each product has a unique ID
      }));
      console.log(productList.value);

      // Compute average ratings from Firestore
      try {
        const snap = await getDoc(doc(db, 'comments', 'data'));
        const dataMap = snap.exists() ? (snap.data() || {}) : {};
        for (let item of productList.value) {
          const list = dataMap[String(item.id)];
          const arr = Array.isArray(list) ? list : [];
          const sum = arr.reduce((s, el) => s + Number((el && el.RatingVal) || 0), 0);
          const avg = arr.length ? sum / arr.length : 0;
          item.RatingValAll = Number.isFinite(avg) ? avg : 0;
        }
      } catch (e) {
        console.error('Failed to compute ratings from Firestore:', e);
      }

      errorMsg.value = '';
    } catch (error) {
      console.error('Failed to load product list:', error);
      errorMsg.value = 'Failed to load product list. Please try again later.';
      productList.value = [];
    } finally {
      isLoading.value = false;
    }
  });
  </script>
  
  <style scoped>
  /* Centered loading indicator */
  .loading {
    text-align: center;
    padding: 20px;
    color: #6b7280;
  }
  
  /* Error message styling */
  .error {
    text-align: center;
    padding: 20px;
    color: #ef4444;
    background-color: #fee2e2;
    border-radius: 8px;
    max-width: 600px;
    margin: 0 auto;
  }
  </style>