import type { Middleware } from '@reduxjs/toolkit';

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_DELAY = 400;

export const debounceMiddleware: Middleware = () => (next) => (action) => {
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const typedAction = action as { type: string; payload?: unknown };
    
    if (typedAction.type === 'product/setSearchQuery') {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      debounceTimer = setTimeout(() => {
        next(action);
      }, DEBOUNCE_DELAY);
      
      return;
    }
  }
  
  return next(action);
};
