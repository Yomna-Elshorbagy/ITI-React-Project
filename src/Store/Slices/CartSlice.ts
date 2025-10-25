import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { RootState } from "../store";
import type { CartState } from "../../Types/CartState";
import type { CartResponse, CartMutationResponse } from "../../Types/CartTypes";

const initialState: CartState = {
  noOfCartItems: 0,
  noOfCartProducts: 0,
  products: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

// ✅ Strongly typed error extractor (no `any`, no `unknown`)
function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const respData = axiosError.response?.data;
    return respData?.message || axiosError.message || "Unknown axios error";
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

// ✅ Get user cart
export const getUserCart = createAsyncThunk<
  CartResponse,
  void,
  { state: RootState; rejectValue: string }
>("cart/getUserCart", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    console.log("[cart/getUserCart] starting request");
    const res = await axios.get<CartResponse>(
      "https://iti-react-backend.vercel.app/cart",
      {
        headers: { authentication: `bearer ${token}` },
      }
    );
    console.log("[cart/getUserCart] success", res.data);
    return res.data;
  } catch (error) {
    const msg = extractErrorMessage(error);
    console.error("[cart/getUserCart] error", msg);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        noOfCartItems: 0,
        noOfProducts: 0,
        data: { products: [], totalPrice: 0 },
      };
    }
    return rejectWithValue(msg);
  }
});

export const addProductToCart = createAsyncThunk<
  CartMutationResponse,
  { productId: string; quantity?: number },
  { state: RootState; rejectValue: string }
>(
  "cart/addProductToCart",
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("[cart/addProductToCart] posting", { productId, quantity });
      const res = await axios.post<CartMutationResponse>(
        "https://iti-react-backend.vercel.app/cart",
        { productId, quantity },
        { headers: { authentication: `bearer ${token}` } }
      );
      console.log("[cart/addProductToCart] success", res.data);
      return res.data;
    } catch (error) {
      const msg = extractErrorMessage(error);
      console.error("[cart/addProductToCart] error", msg);
      return rejectWithValue(msg);
    }
  }
);

export const updateCartQuantity = createAsyncThunk<
  CartMutationResponse,
  { id: string; newCount: number },
  { state: RootState; rejectValue: string }
>(
  "cart/updateCartQuantity",
  async ({ id, newCount }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("[cart/updateCartQuantity] putting", { id, newCount });
      const res = await axios.put<CartMutationResponse>(
        `https://iti-react-backend.vercel.app/cart/${id}`,
        { quantity: newCount },
        { headers: { authentication: `bearer ${token}` } }
      );
      console.log("[cart/updateCartQuantity] success", res.data);
      return res.data;
    } catch (error) {
      const msg = extractErrorMessage(error);
      console.error("[cart/updateCartQuantity] error", msg);
      return rejectWithValue(msg);
    }
  }
);

// ✅ Delete item from cart
export const deleteCartItem = createAsyncThunk<
  CartMutationResponse,
  string,
  { state: RootState; rejectValue: string }
>("cart/deleteCartItem", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    console.log("[cart/deleteCartItem] calling deleteitem", id);
    const res = await axios.put<CartMutationResponse>(
      `https://iti-react-backend.vercel.app/cart/deleteitem/${id}`,
      {},
      { headers: { authentication: `bearer ${token}` } }
    );
    console.log("[cart/deleteCartItem] success", res.data);
    return res.data;
  } catch (error) {
    const msg = extractErrorMessage(error);
    console.error("[cart/deleteCartItem] error", msg);
    return rejectWithValue(msg);
  }
});

// ✅ Clear entire cart
export const clearCartApi = createAsyncThunk<
  CartMutationResponse,
  void,
  { state: RootState; rejectValue: string }
>("cart/clearCartApi", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    console.log("[cart/clearCartApi] deleting cart");
    const res = await axios.delete<CartMutationResponse>(
      "https://iti-react-backend.vercel.app/cart",
      {
        headers: { authentication: `bearer ${token}` },
      }
    );
    console.log("[cart/clearCartApi] success", res.data);
    return res.data;
  } catch (error) {
    const msg = extractErrorMessage(error);
    console.error("[cart/clearCartApi] error", msg);
    return rejectWithValue(msg);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      console.log("[cart/clearCart] reducer invoked");
      state.noOfCartItems = 0;
      state.noOfCartProducts = 0;
      state.products = [];
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserCart.pending, (state) => {
      console.log("[cart/getUserCart] pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getUserCart.fulfilled,
      (state, action: PayloadAction<CartResponse>) => {
        console.log("[cart/getUserCart] fulfilled", action.payload);
        state.loading = false;
        state.noOfCartItems = action.payload.noOfCartItems;
        state.noOfCartProducts = action.payload.noOfProducts;
        state.products = action.payload.data.products;
        state.totalPrice = action.payload.data.totalPrice;
      }
    );
    builder.addCase(getUserCart.rejected, (state, action) => {
      console.log("[cart/getUserCart] rejected", action.payload);
      state.loading = false;
      state.error = action.payload ?? "Failed to get cart";
    });

    builder.addCase(addProductToCart.pending, (state) => {
      console.log("[cart/addProductToCart] pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addProductToCart.fulfilled,
      (state, action: PayloadAction<CartMutationResponse>) => {
        console.log("[cart/addProductToCart] fulfilled", action.payload);
        state.loading = false;
        const payload = action.payload;
        const cartData = payload.cart ?? payload.data ?? payload;
        state.noOfCartItems = payload.noOfCartItems ?? state.noOfCartItems;
        state.noOfCartProducts = payload.noOfProducts ?? state.noOfCartProducts;
        if ("products" in cartData) {
          state.products = cartData.products;
          state.totalPrice = cartData.totalPrice;
        }
      }
    );
    builder.addCase(addProductToCart.rejected, (state, action) => {
      console.log("[cart/addProductToCart] rejected", action.payload);
      state.loading = false;
      state.error = action.payload ?? "Failed to add product to cart";
    });

    builder.addCase(
      updateCartQuantity.fulfilled,
      (state, action: PayloadAction<CartMutationResponse>) => {
        console.log("[cart/updateCartQuantity] fulfilled", action.payload);
        const payload = action.payload;
        const cartData = payload.data ?? payload.cart ?? payload;
        state.noOfCartItems = payload.noOfCartItems ?? state.noOfCartItems;
        state.noOfCartProducts = payload.noOfProducts ?? state.noOfCartProducts;
        if ("products" in cartData) {
          state.products = cartData.products;
          state.totalPrice = cartData.totalPrice;
        }
      }
    );

    builder.addCase(
      deleteCartItem.fulfilled,
      (state, action: PayloadAction<CartMutationResponse>) => {
        console.log("[cart/deleteCartItem] fulfilled", action.payload);
        const payload = action.payload;
        const cartData = payload.data ?? payload.cart ?? payload;
        state.noOfCartItems = payload.noOfCartItems ?? state.noOfCartItems;
        state.noOfCartProducts = payload.noOfProducts ?? state.noOfCartProducts;
        if ("products" in cartData) {
          state.products = cartData.products;
          state.totalPrice = cartData.totalPrice;
        }
      }
    );

    builder.addCase(
      clearCartApi.fulfilled,
      (state, action: PayloadAction<CartMutationResponse>) => {
        console.log("[cart/clearCartApi] fulfilled", action.payload);
        state.noOfCartItems = 0;
        state.noOfCartProducts = 0;
        state.products = [];
        state.totalPrice = 0;
      }
    );
    builder.addCase(clearCartApi.rejected, (state, action) => {
      console.log("[cart/clearCartApi] rejected", action.payload);
      state.error = action.payload ?? "Failed to clear cart";
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
