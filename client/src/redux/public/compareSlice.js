import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  enabled: false,
  compareList: JSON.parse(localStorage.getItem('compareList')) || []
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompare(state) {
      state.enabled = !state.enabled;
      if (!state.enabled) {
        state.compareList = [];
        localStorage.setItem('compareList', JSON.stringify(state.compareList));
      }
    },
    addToCompare(state, action) {
      if (state.compareList.length < 2 && !state.compareList.find(p => p._id === action.payload._id)) {
        state.compareList.push(action.payload);
        localStorage.setItem('compareList', JSON.stringify(state.compareList));
      }
    },
    removeFromCompare(state, action) {
      state.compareList = state.compareList.filter(p => p._id !== action.payload);
      localStorage.setItem('compareList', JSON.stringify(state.compareList));
    },
    clearCompare(state) {
      state.compareList = [];
      localStorage.setItem('compareList', JSON.stringify(state.compareList));
    }
  }
});

export const { toggleCompare, addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer; 