import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import type { Wishlist } from "../../Types/Wishlist";

const BASE_URL = "https://iti-react-backend.vercel.app/wishlist";

// =====> initial State <=====
const initialState: Wishlist = {
  items: [],
  loading: false,
  error: null,
};

// =====> Async Thunks <======
export const getUserWishlist = createAsyncThunk<any, void, { state: RootState }>(
  "wishlist/getUserWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.get(`${BASE_URL}`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data.wishlist || res.data.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//===> Add product to wishlist
export const addToWishlist = createAsyncThunk<any, string, { state: RootState }>(
  "wishlist/addToWishlist",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(
        `${BASE_URL}`,
        { productId },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//====> remove product from wishlist
export const removeFromWishlist = createAsyncThunk<any, string, { state: RootState }>(
  "wishlist/removeFromWishlist",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.delete(`${BASE_URL}/${productId}`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data.wishlist || res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Clear wishlist
export const clearWishlist = createAsyncThunk<any, void, { state: RootState }>(
  "wishlist/clearWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.delete(`${BASE_URL}/clear`, {
        headers: { authentication: `bearer ${token}` },
      });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// =======> slice <=======
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // === get Wishlist 
    builder.addCase(getUserWishlist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(getUserWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ===> Add
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
    });

    // ===> Remove
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
    });

    // ===> Clear
    builder.addCase(clearWishlist.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
