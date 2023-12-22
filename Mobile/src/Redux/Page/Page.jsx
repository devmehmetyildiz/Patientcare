import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    sidebarOpen: false,
};

const PageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        handleSidebaropen: (state, action) => {
            state.sidebarOpen = action.payload;
        },
    },
});

export const { handleSidebaropen } = PageSlice.actions;
export default PageSlice.reducer;