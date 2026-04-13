import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/components/ProductCard';
import type { RootState } from '../index';

interface ProductState {
  searchQuery: string;
  selectedCategory: string;
  sortOption: string;
}

const initialState: ProductState = {
  searchQuery: '',
  selectedCategory: 'all',
  sortOption: 'default',
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSortOption: (state, action: PayloadAction<string>) => {
      state.sortOption = action.payload;
    },
  },
});

export const { setSearchQuery, setSelectedCategory, setSortOption } = productSlice.actions;

export const selectSearchQuery = (state: RootState) => state.product.searchQuery;
export const selectSelectedCategory = (state: RootState) => state.product.selectedCategory;
export const selectSortOption = (state: RootState) => state.product.sortOption;

export const selectFilteredProducts = createSelector(
  [
    (state: RootState, products: Product[]) => products,
    (state: RootState) => state.product.searchQuery,
    (state: RootState) => state.product.sortOption,
  ],
  (products, searchQuery, sortOption) => {
    let result = [...products];

    if (searchQuery.trim()) {
      const id = parseInt(searchQuery, 10);
      if (!isNaN(id)) result = result.filter((p) => p.id === id);
      else result = [];
    }

    switch (sortOption) {
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }
);

export default productSlice.reducer;
