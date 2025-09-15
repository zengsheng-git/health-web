<template>
    <div class="min-h-screen bg-gray-50">
         
        <div class="max-w-[1400px] mx-auto px-4 md:px-8 pt-24 pb-16">
            <!-- image + title + breadcrumbs -->
            <div class="bg-white rounded-2xl shadow-md overflow-hidden mb-8 animate-slideInLeft">
                <!-- Resource map -->
                <div class="h-[400px] md:h-[500px] overflow-hidden">
                    <img 
                        :src="currentResource.image" 
                        :alt="currentResource.title" 
                        class="w-full h-full object-cover"
                    />
                </div>
                
                <!-- Title + Breadcrumbs -->
                <div class="p-6 md:p-8">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        {{ currentResource.title }}
                    </h1>
                </div>
            </div>
  
            <!-- Details -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <!-- Left: Description -->
                <div class="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-md">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">About This Resource</h2>
                    <p class="text-gray-600 text-lg leading-relaxed mb-8">
                        {{ currentResource.description }}
                    </p>
                    
                    <!-- Expand -->
                    <div class="space-y-6">
                        <div>
                            <h3 class="text-xl font-medium text-gray-800 mb-3">Key Learning Objectives</h3>
                            <ul class="list-disc list-inside text-gray-600 space-y-2">
                                <li v-for="item in currentResource.Key">
                                  {{ item }}
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 class="text-xl font-medium text-gray-800 mb-3">Recommended For</h3>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="item in currentResource.Tags" 
                                    class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                  {{ item  }}  
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
  
                <!-- Right: Fixed ID matching logic -->
                <div class="bg-white p-6 md:p-8 rounded-2xl shadow-md">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Related Resources</h2>
                    <div class="space-y-4">
                        <div 
                            v-for="(item, idx) in relatedResources" 
                            :key="idx" 
                            :to="{ name: 'ResourceDetail', params: { index: item.id } }" 
                            class="block p-4 border border-gray-100 rounded-lg hover:border-green-200 hover:bg-green-50 transition-colors"
                        >
                            <h3 class="font-medium text-gray-800 hover:text-green-700 transition-colors">
                                {{ item.title }}
                            </h3>
                            <p class="text-sm text-gray-500 mt-1 line-clamp-2">
                                {{ item.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
  
            <!-- Comment function area (docking interface) -->
            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-md">
                <h2 class="text-2xl font-semibold text-gray-800 mb-8">Leave a Comment</h2>
  
                <!-- Comment input -->
                <div class="mb-10">
                    <!-- Not logged in prompt -->
                    <div v-if="!isLogin" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-yellow-800 flex items-center">
                        <i class="fas fa-info-circle mr-2 text-lg"></i>
                        Please <RouterLink to="/auth/login" class="text-green-600 hover:underline font-medium">login</RouterLink> to share your thoughts.
                    </div>
  
                    <!-- Logged in: Comment input -->
                    <div v-else class="space-y-4">
                        <textarea
                            v-model="newCommentContent"
                            placeholder="What do you think about this resource? Share your insights..."
                            class="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none min-h-[120px] outline-none"
                            maxlength="500"
                            :disabled="isSubmitting"
                        ></textarea>
                        <!-- Word count -->
                        <p class="text-right text-sm text-gray-500">
                            {{ newCommentContent.length }} / 500 characters
                        </p>
                         <Rating v-model="RatingVal" />
                        <!-- Submit button  -->
                        <button
                            @click="submitComment"
                            class="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                            :disabled="(!newCommentContent.trim() || RatingVal==null) || isSubmitting"
                        >
                            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                            <span>{{ isSubmitting ? 'Posting...' : 'Post Comment' }}</span>
                        </button>
                        <!-- Submit error message -->
                        <p v-if="submitError" class="text-red-500 text-sm mt-2">
                            <i class="fas fa-exclamation-circle mr-1"></i> {{ submitError }}
                        </p>
                    </div>
                </div>
  
                <!-- Comment list area -->
                <div>
                    <h3 class="text-xl font-medium text-gray-800 mb-6 flex items-center">
                        <i class="fas fa-comments mr-2 text-green-600"></i>
                        {{ comments.length }} {{ comments.length === 1 ? 'Comment' : 'Comments' }}
                    </h3>
  
                    <!-- Comments are loading -->
                    <div v-if="isCommentLoading" class="text-center py-12 text-gray-500">
                        <i class="fas fa-spinner fa-spin text-2xl mb-4"></i>
                        <p>Loading comments...</p>
                    </div>
  
                    <!-- Comment loading error -->
                    <div v-else-if="commentError" class="text-center py-12 text-red-500 bg-red-50 rounded-lg">
                        <i class="fas fa-exclamation-circle text-2xl mb-4"></i>
                        <p>{{ commentError }}</p>
                        <button 
                            @click="fetchComments()" 
                            class="mt-4 text-green-600 hover:text-green-700 text-sm"
                        >
                            Try again
                        </button>
                    </div>
  
                    <!-- Tips when there are no comments -->
                    <div v-else-if="comments.length === 0" class="text-center py-12 text-gray-500">
                        <i class="fas fa-comment-dots text-4xl mb-4 opacity-50"></i>
                        <p class="text-lg">No comments yet. Be the first to share!</p>
                    </div>
  
                    <!-- comments list -->
                    <div class="space-y-8" v-else>
                        <div 
                            v-for="(comment, idx) in comments" 
                            :key="comment.id" 
                            class="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                        >
                            <!-- Commenter information -->
                            <div class="flex items-center justify-between mb-3">
                                <div class="flex items-center gap-4 w-full">
                                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                                        {{ comment.userName.charAt(0).toUpperCase() }}
                                    </div>
                                    <div class="flex justify-between w-full">
                                      <div>
                                         <div class="flex gap-10">
                                          <h4 class="font-medium text-gray-800">{{ comment.userName }}</h4>
                                         <Rating :defaultValue="comment.RatingVal" readonly />
                                         </div>
                                        <p class="text-sm text-gray-500">{{ formatCommentTime(comment.timestamp) }}</p>
                                      </div>
                                       
                                        <div>
                                            <button
                                                v-if="currentUserName==comment.userName" 
                                                @click="confirmDelete(comment.id)"
                                                class="px-3 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                            >
                                              <i class="fas fa-trash mr-1"></i>Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- Edited tag -->
                                <span v-if="comment.edited" class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                    <!-- Edited by Admin -->
                                </span>
                            </div>
                            <!-- Comment content -->
                            <p class="text-gray-600 pl-14 leading-relaxed">{{ comment.content }}</p>
                            <!-- Last edited time -->
                            <p v-if="comment.lastEditTime" class="text-gray-500 text-xs pl-14 mt-2">
                                Last edited: {{ formatCommentTime(comment.lastEditTime) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute, RouterLink } from 'vue-router';
  import axios from 'axios';
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();
  const confirm = useConfirm();

  // ---------------------- 1. Axios instance for Koa backend ----------------------
  // Base URL of the Koa backend API
  const API_BASE_URL = 'http://localhost:3000/api';
  // Axios instance
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000 // 5 seconds timeout
  });
  
  // ---------------------- 2. User login state ----------------------
  const isLogin = computed(() => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    return userInfo?.GivenName?.length > 0;
  });
  
  const currentUserName = computed(() => {
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    return userInfo?.GivenName || 'Guest';
  });
  
  // ---------------------- 3. Product detail logic ----------------------
  const route = useRoute();
  const router = useRouter();
  const homeInfo = ref({}); // 
  
  //
  const resourceIndex = computed(() => {
    const idx = parseInt(route.params.index as string);
    return isNaN(idx) ? 0 : idx;
  });
  
  // Get the current product details (match by ID)
  const currentResource = computed(() => {
    const resources = homeInfo.value?.EducationalResources?.categories || [];
    const foundResource = resources.find((item: any) => item.id === resourceIndex.value);
    return foundResource || {
        title: 'Resource Not Found',
        description: 'Sorry, the requested resource could not be loaded.',
        image: '/img/default.jpg'
    };
  });
  
  // Get related resources (excluding the current product)
  const relatedResources = computed(() => {
    const resources = homeInfo.value?.EducationalResources?.categories || [];
    return resources.filter((item: any) => item.id !== resourceIndex.value).slice(0, 3);
  });
  
  //Loading product resource data
  const loadProductData = async () => {
    try {
      const { data } = await axios.get('/json/home.json');
      const resourcesWithId = data.EducationalResources.categories.map((item: any, idx: number) => ({
        ...item,
        id: item.id || idx + 1
      }));
      homeInfo.value = {
        ...data,
        EducationalResources: {
          ...data.EducationalResources,
          categories: resourcesWithId
        }
      };
    } catch (error) {
      console.error('Failed to load product data:', error);
      router.push('/');
    }
  };
  
  // Comment data structure (consistent with Koa backend return fields)
  interface CommentType {
    id: string;          
    userName: string;    
    content: string;     
    timestamp: number;   
    edited?: boolean;   
    lastEditTime?: number;
  }
  
  //Responsive data
  const newCommentContent = ref(''); 
  const comments = ref<CommentType[]>([]); 
  const isCommentLoading = ref(false); 
  const isSubmitting = ref(false);    
  const commentError = ref(''); 
  const submitError = ref('');  
  const RatingVal = ref(null);  
  
  //Get the reviews of the current product from the background
  const fetchComments = async () => {
    isCommentLoading.value = true;
    commentError.value = '';
    try {
      const { data } = await api.get(`/comments/${resourceIndex.value}`);
      if (data.success) {
        comments.value = data.data.sort((a: CommentType, b: CommentType) => b.timestamp - a.timestamp);
      } else {
        throw new Error(data.message || 'Failed to fetch comments');
      }
    } catch (error: any) {
      commentError.value = error.message || 'Failed to load comments. Please try again later.';
      console.error('Comment fetch error:', error);
    } finally {
      isCommentLoading.value = false;
    }
  };
  
  //Submit a new comment to the Koa backend
  const submitComment = async () => {
    const content = newCommentContent.value.trim();
    // console.log(RatingVal.value)
    if (!content) return;
  
    isSubmitting.value = true;
    submitError.value = '';
    try {
      //
      const { data } = await api.post(`/comments/${resourceIndex.value}`, {
        userName: currentUserName.value, 
        content: content,
        RatingVal: RatingVal.value     
      });
  
      if (data.success) {
        comments.value.unshift(data.data);
        newCommentContent.value = '';
        RatingVal.value=null
        setTimeout(() => {
          const firstComment = document.querySelector('.space-y-8 > div:first-child');
          firstComment?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        throw new Error(data.message || 'Failed to post comment');
      }
    } catch (error: any) {
      submitError.value = error.message || 'Failed to post comment. Please try again later.';
      console.error('Comment submit error:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  //Format comment time
  const formatCommentTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
  
   
    if (diff < hour) {
      return `${Math.floor(diff / minute)} minutes ago`;
    }

    if (diff < day) {
      return `${Math.floor(diff / hour)} hours ago`;
    }
   
    if (diff < month) {
      return `${Math.floor(diff / day)} days ago`;
    }
   
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/, '$3-$1-$2 $4:$5');
  };
  
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

    const deleteComment = async (commentId) => {
          try {
            // Call the backend API to delete the comment
            const res = await axios.delete(
              `http://localhost:3000/api/comments/${resourceIndex.value}/${commentId}`
            );
        
            if (res.data.success) {
              // Remove the comment from the local list
              comments.value = comments.value.filter(comment => comment.id !== commentId);
              toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Comment deleted successfully', life: 3000 });
            } else {
              throw new Error(res.data.message || 'Failed to delete comment');
            }
          } catch (error) {
            console.error('Failed to delete comment:', error);
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Failed to delete comment', life: 3000 });
          }
  };

  //Initial loading 
  onMounted(async () => {
    await loadProductData();
    await fetchComments();
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
  .animate-slideInLeft {
    animation: slideInLeft 0.8s ease-out forwards;
  }
  
  button:disabled {
    background-color: #a3e635;
    cursor: not-allowed;
    opacity: 0.8;
  }
  textarea::placeholder {
    color: #9ca3af;
  }
 
  .text-blue-50 {
    background-color: #eff6ff;
  }
  </style>