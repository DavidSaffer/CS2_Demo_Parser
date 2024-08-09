// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import navigationReducer from '../features/navigation/navigationSlice';
import fileReducer from '../features/file/fileSlice';
import demoParseReducer from '../features/demoParse/demoParseSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    navigation: navigationReducer,
    file: fileReducer,
    demoParse: demoParseReducer,
    // other reducers can be added here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
