import { configureStore, createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: {
    hcp_name: '',
    interaction_type: '',
    sentiment: '',
    notes: ''
  },
  reducers: {
    fillForm: (state, action) => {
      // Overwrites the whole form
      return { ...state, ...action.payload };
    },
    editForm: (state, action) => {
      // Edits just one field (e.g., changing negative to positive)
      const { field, value } = action.payload;
      state[field] = value;
    }
  }
});

export const { fillForm, editForm } = formSlice.actions;

export const store = configureStore({
  reducer: { form: formSlice.reducer }
});