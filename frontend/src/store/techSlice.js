import { createSlice } from '@reduxjs/toolkit';
import { TECH_DICTIONARY } from '../utils/techStack';

const techSlice = createSlice({
  name: 'tech',
  initialState: {
    dictionary: TECH_DICTIONARY,
  },
  reducers: {
    addCustomTech: (state, action) => {
      // In a real app this might sync to backend. For now, just add to dictionary locally
      if (!state.dictionary.find(t => t.name.toLowerCase() === action.payload.name.toLowerCase())) {
        state.dictionary.push({
          id: action.payload.name.toLowerCase().replace(/\s+/g, '-'),
          name: action.payload.name,
          svg: null, // Custom added techs won't have SVGs initially
        });
      }
    }
  }
});

export const { addCustomTech } = techSlice.actions;
export default techSlice.reducer;
