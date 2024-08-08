// src/features/theme/navigationSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface NavigationState {
    currentPage: string;
}

const initialState: NavigationState = {
currentPage: 'Home',  // Default page
};

export const navigationSlice = createSlice({
name: 'navigation',
initialState,
reducers: {
    setCurrentPage: (state, action: { payload: string }) => {
    state.currentPage = action.payload;
    },
},
});

export const { setCurrentPage } = navigationSlice.actions;
export default navigationSlice.reducer;
