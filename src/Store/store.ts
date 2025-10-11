import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/AuthSlice";
import cartReducer from "./Slices/CartSlice";
import wishlistReducer from "./Slices/WishlistSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
