import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import type { WishlistItem, WishlistState } from "../../Types/Wishlist";
import { baseURL } from "../../Constants/BaseUrls";

const API_BASE = `${baseURL}`;

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  fetched: false,
  justFetched: false,
};

export const fetchWishlist = createAsyncThunk<
  WishlistItem[],
  void,
  { state: RootState }
>("wishlist/fetch", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.get(`${API_BASE}/wishlist`, {
      headers: { authentication: `bearer ${token}` },
    });
    return res.data.data.wishlist as WishlistItem[];
  } catch {
    return rejectWithValue("Failed to fetch wishlist");
  }
});

export const addToWishlist = createAsyncThunk<
  WishlistItem,
  string,
  { state: RootState }
>("wishlist/add", async (productId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.put(
      `${API_BASE}/wishlist`,
      { productId },
      { headers: { authentication: `bearer ${token}` } }
    );
    return res.data.data as WishlistItem;
  } catch {
    return rejectWithValue("Failed to add to wishlist");
  }
});

export const removeFromWishlist = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("wishlist/remove", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    await axios.put(
      `${API_BASE}/wishlist/${id}`,
      {},
      {
        headers: { authentication: `bearer ${token}` },
      }
    );
    return id;
  } catch {
    return rejectWithValue("Failed to remove from wishlist");
  }
});

export const clearWishlist = createAsyncThunk<void, void, { state: RootState }>(
  "wishlist/clear",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.put(
        `${API_BASE}/wishlist/clear`,
        {},
        {
          headers: { authentication: `bearer ${token}` },
        }
      );
    } catch {
      return rejectWithValue("Failed to clear wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.fetched = true;
        state.justFetched = true;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch wishlist";
      })
      .addCase(addToWishlist.pending, (state, action) => {
        const id = action.meta.arg;
        if (state.justFetched) {
          state.justFetched = false;
          return;
        }
        if (state.fetched && !state.items.find((i) => i._id === id)) {
          state.items.push({
            _id: id,
            stock: 0,
          });
        }
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
        else state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.meta.arg);
      })
      .addCase(removeFromWishlist.fulfilled, () => {})
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default wishlistSlice.reducer;
