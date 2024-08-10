// src/features/demoParse/demoParseSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface PlayerStats {
  Name: string;
  Kills: number;
  EcoKills: number;
  LightBuyKills: number;
  TotalValue: number;
  Team: number;
  EcoKillRounds: number[];
  LightBuyKillRounds: number[];
}

interface FinalData {
  data: Record<string, PlayerStats>;
  totalRounds: number;
  type: string;
}

interface DemoParseState {
  progress: number;
  finalData: FinalData | null;
  error: string | null;
}
  
const initialState: DemoParseState = {
  progress: 0,
  finalData: null,
  error: null
};

export const demoParseSlice = createSlice({
  name: 'demoParse',
  initialState,
  reducers: {
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setFinalData: (state, action: PayloadAction<any>) => {
      state.finalData = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    resetDemoParser: () => initialState
  },
});

export const { setProgress, setFinalData, setError, resetDemoParser } = demoParseSlice.actions;

export default demoParseSlice.reducer;


