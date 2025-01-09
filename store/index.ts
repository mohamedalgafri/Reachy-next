// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './slices/notificationsSlice';
import contactsReducer from './slices/contactsSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    contacts: contactsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false 
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;