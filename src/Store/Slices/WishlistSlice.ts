import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";

const API_BASE = "https://iti-react-backend.vercel.app";

type WishlistItem = {
  _id: string;
  title?: string;
  price?: number;
  imageCover?: { secure_url: string };
  [key: string]: any;
};

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  fetched: boolean; // marks if initial fetch done
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  fetched: false,
};

//  FETCH wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await axios.get(`${API_BASE}/wishlist`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data.wishlist;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

//  ADD to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const res = await axios.put(
        `${API_BASE}/wishlist`,
        { productId },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// REMOVE from wishlist
export const removeFromWishlist = createAsyncThunk<
  string,
  string,
  { state: RootState }
>(
  "wishlist/remove",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      await axios.put(`${API_BASE}/wishlist/${id}`, {}, {
        headers: { authentication: `bearer ${token}` },
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// CLEAR wishlist
export const clearWishlist = createAsyncThunk<void, void, { state: RootState }>(
  "wishlist/clear",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      await axios.put(`${API_BASE}/wishlist/clear`, {}, {
        headers: { authentication: `bearer ${token}` },
      });
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.fetched = true; // mark that initial fetch is done
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch wishlist";
      })

      // ADD
      .addCase(addToWishlist.pending, (state, action) => {
        const id = action.meta.arg;

        // Only optimistic add if initial fetch is done and item not already present
        if (state.fetched && !state.items.find((i) => i._id === id)) {
          state.items.push({ _id: id }); // temporary optimistic entry
        }
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload; // replace optimistic
        else state.items.push(action.payload); // in case not present
      })

      // REMOVE
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.meta.arg); // optimistic remove
      })
      .addCase(removeFromWishlist.fulfilled, (state) => {
        // nothing extra needed, already removed
      })

      // CLEAR
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default wishlistSlice.reducer;