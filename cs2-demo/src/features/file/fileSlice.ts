// src/features/fileSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileState {
    currentFile: {
        name: string;
        size: number;
        type: string;
    } | null;
    uploadStatus: 'idle' | 'selected' | 'error';
}

const initialState: FileState = {
    currentFile: null,
    uploadStatus: 'idle',
};

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setFile: (state, action: PayloadAction<{name: string, size: number, type: string} | null>) => {
            state.currentFile = action.payload;
            state.uploadStatus = action.payload ? 'selected' : 'idle';
        },
        setUploadStatus: (state, action: PayloadAction<'idle' | 'selected' | 'error'>) => {
            state.uploadStatus = action.payload;
        },
    },
});

export const { setFile, setUploadStatus } = fileSlice.actions;
export default fileSlice.reducer;