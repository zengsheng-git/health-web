<!-- src/views/admin/AdminCommentManage.vue -->
<template>
    <div class="max-w-[1200px] mx-auto p-4">
      <!-- Title and back link -->
      <div class="flex items-center gap-4 mb-8">
        <RouterLink 
          to="/admin/product-list"
          class="flex items-center gap-1 text-green-600 hover:text-green-700"
        >
          <i class="fas fa-arrow-left"></i>
          <span>Return to product list</span>
        </RouterLink>
        <span class="text-gray-400">/</span>
        <h1 class="text-2xl font-bold text-gray-800">Comment management：{{ currentProduct.title }}</h1>
      </div>
  
      <!-- Basic product information-->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div class="flex flex-col md:flex-row gap-6 items-center">
          <!-- Product thumbnail -->
          <div class="w-24 h-24 rounded-lg overflow-hidden">
            <img 
              :src="currentProduct.image" 
              :alt="currentProduct.title" 
              class="w-full h-full object-cover"
            />
          </div>
          <!-- product information-->
          <div class="flex-1">
            <Tag severity="danger" :value="Number(RatingValAll)?.toFixed(1)"></Tag>
            <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ currentProduct.title }}</h2>
            <p class="text-gray-600 text-sm">{{ currentProduct.description }}</p>
          </div>
          <!-- Comment statistics -->
          <div class="bg-green-50 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
            Total {{ comments.length }} comments
          </div>
        </div>
      </div>
  
      <!--Comment management area -->
      <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-6"> Comment list </h3>
  
        <!-- Loading status -->
        <div v-if="isLoading" class="text-center py-10 text-gray-500">
          <i class="fas fa-spinner fa-spin mr-2"></i> Loading comments...
        </div>
  
        <!-- Error message -->
        <div v-else-if="errorMsg" class="text-center py-10 text-red-500 bg-red-50 rounded-lg">
          <i class="fas fa-exclamation-circle mr-2"></i> {{ errorMsg }}
        </div>
  
        <!-- No comment prompt -->
        <div v-else-if="comments.length === 0" class="text-center py-10 text-gray-500">
          <i class="fas fa-comment-dots text-4xl mb-4 opacity-50"></i>
          <p class="text-lg">There are no comments for this product yet.</p>
        </div>
  
        <!-- Comment list -->
        <div v-else class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          <div 
            v-for="comment in comments" 
            :key="comment.id" 
            class="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
          >
            <!-- Commenter information -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-4">
                <!-- Username initials avatar -->
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                  {{ comment.userName.charAt(0).toUpperCase() }}
                </div>
                <span class="font-medium text-gray-800">{{ comment.userName }}</span>
                 <Rating :defaultValue="comment.RatingVal" readonly />
              </div>
      
              <div class="text-xs text-gray-500">
                <span>{{ formatTime(comment.timestamp) }}</span>
                <!-- <span v-if="comment.edited" class="ml-2 text-blue-500">
                  <i class="fas fa-pen mr-1"></i> Edited
                </span> -->
              </div>
            </div>
  
            <!-- Comment content -->
            <p class="text-gray-700 text-sm mb-4 pl-10">{{ comment.content }}</p>
  
            <!-- Action buttons: Edit and Delete -->
            <div class="flex justify-end gap-2 pl-10">
              <!-- <button 
                @click="openEditModal(comment)"
                class="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                <i class="fas fa-edit mr-1"></i>edit
              </button> -->
              <button 
                @click="confirmDelete(comment.id)"
                class="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
              >
                <i class="fas fa-trash mr-1"></i>delete
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Edit Comment Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl w-full max-w-md p-6">
          <h3 class="text-xl font-semibold mb-4">Editorial comments</h3>
          
          <!-- Editable textarea -->
          <textarea
            v-model="editCommentContent"
            class="w-full p-3 border border-gray-200 rounded-lg min-h-[120px] mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            maxlength="500"
            placeholder="Please enter your edited comment..."
          ></textarea>
          
          <!-- word count-->
          <div class="text-right text-xs text-gray-500 mb-4">
            {{ editCommentContent.length }} 
          </div>
          
          <!-- Action buttons -->
          <div class="flex justify-end gap-3">
            <button 
              @click="closeEditModal()"
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
            
            </button>
            <button 
              @click="saveEditedComment()"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              :disabled="!editCommentContent.trim() || isSaving"
            >
              <i v-if="isSaving" class="fas fa-spinner fa-spin mr-1"></i>
              <span>{{ isSaving ? 'Saving...' : 'Save' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter, RouterLink } from 'vue-router';
  import axios from 'axios';
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from 'primevue/usetoast';
  import { db } from '@/common/firebase';
  import { doc, getDoc, setDoc } from 'firebase/firestore';

  const toast = useToast();
  const confirm = useConfirm();
  
  // 1. Routes and parameters
  const route = useRoute();
  const router = useRouter();
  // Get productId from route parameters
  const productId = computed(() => {
    console.log(route)
    return route.params.productId
  });

  const RatingValAll = computed(() => {
    console.log(route)
    return route.query.RatingValAll
  });
  
  // 2. State variables
  const currentProduct = ref({ title: '', description: '', image: '/img/default.jpg' }); // Current product information
  const comments = ref([]); 
  const isLoading = ref(true); 
  const errorMsg = ref(''); 
  // Edit modal state
  const showEditModal = ref(false);
  const editCommentContent = ref('');
  const currentEditCommentId = ref('');
  const isSaving = ref(false); 
  
  // 3. Initialization: Load product info and comments
  onMounted(async () => {
    try {
      isLoading.value = true;
      // Parallel requests for product info and comments
      const productRes = await axios.get('/json/home.json');
  
      // Find the product by ID
      const allProducts = productRes.data.EducationalResources.categories.map((item, idx) => ({
        ...item,
        id: item.id || idx + 1
      }));
      const matchedProduct = allProducts.find(item => item.id == productId.value);
      // console.log(matchedProduct)
      if (matchedProduct) {
        currentProduct.value = matchedProduct;
      } else {
        throw new Error('No product information found');
      }
  
      // Load comments from Firestore
      try {
        const snap = await getDoc(doc(db, 'comments', 'data'));
        const map = snap.exists() ? (snap.data() || {}) : {};
        const list = map[String(productId.value)];
        comments.value = Array.isArray(list) ? list : [];
      } catch (e) {
        throw new Error('Failed to load comments from Firestore');
      }
  
      errorMsg.value = '';
    } catch (error) {
      console.error('Initialization failed:', error);
      errorMsg.value = error.message || 'Initialization failed, please refresh the page and try again';
      comments.value = [];
    } finally {
      isLoading.value = false;
    }
  });
  
  // 4. Comment operation: Open edit modal
  const openEditModal = (comment) => {
    currentEditCommentId.value = comment.id;
    editCommentContent.value = comment.content;
    showEditModal.value = true;
  };
  
  // 5. Comment operation: Close edit modal
  const closeEditModal = () => {
    showEditModal.value = false;
    editCommentContent.value = '';
    currentEditCommentId.value = '';
  };
  
  // 6. Comment operation: Save edited comment
  const saveEditedComment = async () => {
    if (!editCommentContent.value.trim()) return;
    try {
      isSaving.value = true;
      // Read current list
      const ref = doc(db, 'comments', 'data');
      const snap = await getDoc(ref);
      const map = snap.exists() ? (snap.data() || {}) : {};
      const key = String(productId.value);
      const list = Array.isArray(map[key]) ? map[key] : [];
      // Update target comment
      const updatedList = list.map((c) => {
        if (c && c.id === currentEditCommentId.value) {
          return {
            ...c,
            content: editCommentContent.value.trim(),
            edited: true,
            lastEditTime: Date.now()
          };
        }
        return c;
      });
      await setDoc(ref, { [key]: updatedList }, { merge: true });
      // Update local
      comments.value = updatedList;
      closeEditModal();
    } catch (error) {
      console.error('Failed to save comment:', error);
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Failed to edit comment', life: 3000 });
    } finally {
      isSaving.value = false;
    }
  };
  
  // 7. Comment operation: Confirm delete comment
  const confirmDelete = (commentId) => {
   confirm.require({
        message: 'Do you want to delete this record?',
        header: 'Tip',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
          deleteComment(commentId);
        },
        reject: () => {
            // toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
  };
  
  // 8. Comment operation: Delete comment
  const deleteComment = async (commentId) => {
    try {
      const ref = doc(db, 'comments', 'data');
      const snap = await getDoc(ref);
      const map = snap.exists() ? (snap.data() || {}) : {};
      const key = String(productId.value);
      const list = Array.isArray(map[key]) ? map[key] : [];
      const newList = list.filter((c) => c && c.id !== commentId);
      await setDoc(ref, { [key]: newList }, { merge: true });
      comments.value = comments.value.filter(comment => comment.id !== commentId);
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Comment deleted successfully', life: 3000 });
    } catch (error) {
      console.error('Failed to delete comment', error);
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Failed to delete comment', life: 3000 });
    }
  };
  
  // 9. Utility: Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  </script>
  
  <style scoped>
  /* Scroll bar beautification (comment list) */
  .max-h-[600px]::-webkit-scrollbar {
    width: 6px;
  }
  .max-h-[600px]::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
  }
  
  /* Disable button style */
  button:disabled {
    background-color: #a3e635;
    cursor: not-allowed;
    opacity: 0.8;
  }
  </style>