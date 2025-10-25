// src/Store/Slices/CartSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../store";
import type { CartState } from "../../Types/CartState";

type CartData = {
  products: CartState["products"];
  totalPrice: number;
};

type CartFetchResponse = {
  noOfCartItems: number;
  noOfProducts: number;
  data: CartData;
};

type CartMutationResponse = {
  noOfCartItems: number;
  noOfProducts: number;
  cart?: CartData;
  data?: CartData;
};

// =============> Initial State <===============
const initialState: CartState = {
  noOfCartItems: 0,
  noOfCartProducts: 0,
  products: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

// =============> Async Thunks <=============
export const getUserCart = createAsyncThunk<
  CartFetchResponse,
  void,
  { state: RootState }
>("cart/getUserCart", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.get("https://iti-react-backend.vercel.app/cart", {
      headers: {
        authentication: `bearer ${token}`,
      },
    });
    return res.data as CartFetchResponse;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return {
        noOfCartItems: 0,
        noOfProducts: 0,
        data: { products: [], totalPrice: 0 },
      };
    }
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Failed to get user cart";
    return rejectWithValue(message);
  }
});

// ✅ Add product to cart (with quantity)
export const addProductToCart = createAsyncThunk<
  CartMutationResponse,
  { productId: string; quantity: number },
  { state: RootState }
>(
  "cart/addProductToCart",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(
        "https://iti-react-backend.vercel.app/cart",
        { productId, quantity },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data as CartMutationResponse;
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message)
          : "Failed to add to cart";
      return rejectWithValue(message);
    }
  }
);

// ✅ Update cart quantity
export const updateCartQuantity = createAsyncThunk<
  CartMutationResponse,
  { id: string; newCount: number },
  { state: RootState }
>(
  "cart/updateCartQuantity",
  async ({ id, newCount }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.put(
        `https://iti-react-backend.vercel.app/cart/${id}`,
        { quantity: newCount },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data as CartMutationResponse;
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message)
          : "Failed to update cart quantity";
      return rejectWithValue(message);
    }
  }
);

// ✅ Delete single item
export const deleteCartItem = createAsyncThunk<
  CartMutationResponse,
  string,
  { state: RootState }
>("cart/deleteCartItem", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.put(
      `https://iti-react-backend.vercel.app/cart/deleteitem/${id}`,
      {},
      { headers: { authentication: `bearer ${token}` } }
    );
    return res.data as CartMutationResponse;
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Failed to delete cart item";
    return rejectWithValue(message);
  }
});

// ✅ Clear all cart
export const clearCartApi = createAsyncThunk<void, void, { state: RootState }>(
  "cart/clearCartApi",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.delete(
        "https://iti-react-backend.vercel.app/cart",
        {
          headers: { authentication: `bearer ${token}` },
        }
      );
      void res; // silence unused
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error && "message" in error
          ? String((error as { message?: unknown }).message)
          : "Failed to clear cart";
      return rejectWithValue(message);
    }
  }
);

// ============> Slice <===============
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.noOfCartItems = 0;
      state.noOfCartProducts = 0;
      state.products = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.noOfCartItems = action.payload.noOfCartItems;
        state.noOfCartProducts = action.payload.noOfProducts;
        state.products = action.payload.data.products;
        state.totalPrice = action.payload.data.totalPrice;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //  addProductToCart
      .addCase(addProductToCart.fulfilled, (state, action) => {
        const cartData = action.payload.cart;
        if (cartData) {
          state.noOfCartItems = action.payload.noOfCartItems;
          state.noOfCartProducts = action.payload.noOfProducts;
          state.products = cartData.products;
          state.totalPrice = cartData.totalPrice;
        }
      })

      //  updateCartQuantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const cartData = action.payload.data;
        if (cartData) {
          state.noOfCartItems = action.payload.noOfCartItems;
          state.noOfCartProducts = action.payload.noOfProducts;
          state.products = cartData.products;
          state.totalPrice = cartData.totalPrice;
        }
      })

      //  deleteCartItem
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        const cartData = action.payload.data;
        if (cartData) {
          state.noOfCartItems = action.payload.noOfCartItems;
          state.noOfCartProducts = action.payload.noOfProducts;
          state.products = cartData.products;
          state.totalPrice = cartData.totalPrice;
        }
      })

      //  clearCartApi
      .addCase(clearCartApi.fulfilled, (state) => {
        state.noOfCartItems = 0;
        state.noOfCartProducts = 0;
        state.products = [];
        state.totalPrice = 0;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
