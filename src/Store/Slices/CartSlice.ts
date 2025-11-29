import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { RootState } from "../store";
import type { CartState } from "../../Types/CartState";
import type { CartResponse, CartMutationResponse } from "../../Types/CartTypes";
import { baseURL } from "../../Constants/BaseUrls";

const initialState: CartState = {
  noOfCartItems: 0,
  noOfCartProducts: 0,
  products: [],
  totalPrice: 0,
  loading: false,
  error: null,
};

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const respData = axiosError.response?.data;
    return respData?.message || axiosError.message || "Unknown axios error";
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

//==> get user cart
export const getUserCart = createAsyncThunk<
  CartResponse,
  void,
  { state: RootState; rejectValue: string }
>("cart/getUserCart", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.get<CartResponse>(`${baseURL}/cart`, {
      headers: { authentication: `bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    const msg = extractErrorMessage(error);
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
      const res = await axios.post<CartMutationResponse>(
        `${baseURL}/cart`,
        { productId, quantity },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      const msg = extractErrorMessage(error);
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
      const res = await axios.put<CartMutationResponse>(
        `${baseURL}/cart/${id}`,
        { quantity: newCount },
        { headers: { authentication: `bearer ${token}` } }
      );
      return res.data;
    } catch (error) {
      const msg = extractErrorMessage(error);
      return rejectWithValue(msg);
    }
  }
);

//==> Delete item from cart
export const deleteCartItem = createAsyncThunk<
  CartMutationResponse,
  string,
  { state: RootState; rejectValue: string }
>("cart/deleteCartItem", async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.put<CartMutationResponse>(
      `${baseURL}/cart/deleteitem/${id}`,
      {},
      { headers: { authentication: `bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    const msg = extractErrorMessage(error);
    return rejectWithValue(msg);
  }
});

// ==> Clear entire cart
export const clearCartApi = createAsyncThunk<
  CartMutationResponse,
  void,
  { state: RootState; rejectValue: string }
>("cart/clearCartApi", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const res = await axios.delete<CartMutationResponse>(`${baseURL}/cart`, {
      headers: { authentication: `bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    const msg = extractErrorMessage(error);
    return rejectWithValue(msg);
  }
});

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
    builder.addCase(getUserCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getUserCart.fulfilled,
      (state, action: PayloadAction<CartResponse>) => {
        state.loading = false;
        state.noOfCartItems = action.payload.noOfCartItems;
        state.noOfCartProducts = action.payload.noOfProducts;
        state.products = action.payload.data.products;
        state.totalPrice = action.payload.data.totalPrice;
      }
    );
    builder.addCase(getUserCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? "Failed to get cart";
    });

    builder.addCase(addProductToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addProductToCart.fulfilled,
      (state, action: PayloadAction<CartMutationResponse>) => {
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
      state.loading = false;
      state.error = action.payload ?? "Failed to add product to cart";
    });

    builder.addCase(
      updateCartQuantity.fulfilled,
      (state, action: PayloadAction<CartMutationResponse>) => {
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
        console.log("cart fulfilled", action.payload);
        state.noOfCartItems = 0;
        state.noOfCartProducts = 0;
        state.products = [];
        state.totalPrice = 0;
      }
    );
    builder.addCase(clearCartApi.rejected, (state, action) => {
      state.error = action.payload ?? "Failed to clear cart";
    });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
