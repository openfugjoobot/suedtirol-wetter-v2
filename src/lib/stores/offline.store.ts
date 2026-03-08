import { writable, derived, type Writable } from 'svelte/store';

interface OfflineState {
  isOffline: boolean;
  wasOffline: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
}

function createOfflineStore() {
  const { subscribe, update } = writable<OfflineState>({
    isOffline: !navigator.onLine,
    wasOffline: false,
    lastOnline: null,
    lastOffline: null
  });
  
  let onlineHandler: () => void;
  let offlineHandler: () => void;
  
  // Initialize handlers
  if (typeof window !== 'undefined') {
    onlineHandler = () => {
      update((state) => ({
        ...state,
        isOffline: false,
        wasOffline: state.isOffline,
        lastOnline: new Date()
      }));
    };
    
    offlineHandler = () => {
      update((state) => ({
        ...state,
        isOffline: true,
        lastOffline: new Date()
      }));
    };
    
    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);
  }
  
  return {
    subscribe,
    
    destroy() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', onlineHandler);
        window.removeEventListener('offline', offlineHandler);
      }
    }
  };
}

export const offlineStore = createOfflineStore();
