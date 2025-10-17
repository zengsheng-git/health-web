import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/common/firebase';

export default {
  install: () => {
    // Prevent multiple registrations
    if (window.__authStateListenerRegistered) return;
    window.__authStateListenerRegistered = true;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const payload = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
        };
        try {
          localStorage.setItem('user', JSON.stringify(payload));
        } catch (e) {
          console.error('Failed to set user in localStorage:', e);
        }
      } else {
        try {
          localStorage.removeItem('user');
        } catch (e) {
          console.error('Failed to remove user from localStorage:', e);
        }
      }
    });
  },
};