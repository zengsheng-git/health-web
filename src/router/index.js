import { adminEmail } from '@/common/util';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
       {
            path: '/',
            name: 'UserLayout',
            component: () => import('@/views/UserLayout.vue'),
            children:[
                {
                    path: '/PublicHealth',
                    name: 'PublicHealth',
                    component: () => import('@/views/PublicHealth.vue')
                },
                {
                    path: '/resourcesDetail/:index',
                    name: 'ResourceDetail',
                    component:  () => import('@/views/ResourceDetail.vue'),
                    props: true, // Enable props to receive route params
                },
                {
                    path: '/events',
                    name: 'Events',
                    component: () => import('@/views/Mapbox.vue')
                },
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/auth/Login.vue')
        },
              {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/auth/Register.vue')
        },
       {
            path: '/admin',
            name: 'AdminLayout',
            // Admin layout component
            component: () => import('@/views/admin/AdminLayout.vue'),
            // Route guard to check for admin authentication
            beforeEnter: (to, from, next) => {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const email = (user.email || '').toLowerCase();
                const isAdmin = email === adminEmail;
                if (isAdmin) {
                    next();
                } else {
                    // Redirect to login if not authenticated as admin
                    next({ name: 'login' });
                    alert('Please log in using your administrator account');
                }
            },
            children: [
                {
                    // Default admin dashboard route
                    path: 'product-list',
                    name: 'AdminProductList',
                    component: () => import('@/views/admin/AdminProductList.vue')
                },
                {
                    path: 'product-comments/:productId',
                    name: 'AdminCommentManage',
                    component: () => import('@/views/admin/AdminCommentManage.vue'),
                    props: true 
                  },
                {
                    path: 'userManage',
                    name: 'UserManage',
                    component:  () => import('@/views/admin/UserManage.vue'),
                    props: true, // Enable props to receive route params
                }
            ]
        }
    ]
});

export default router;
