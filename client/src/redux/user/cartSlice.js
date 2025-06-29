import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { selectShippingFee } from "./shippingAddressSlice";
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const res = await fetch('http://localhost:5000/api/users/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi lấy giỏ hàng');
    // console.log('Fetched cart data:', data); // Debug log

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được giỏ hàng');
  }
})

export const setCart = createAsyncThunk('cart/setCart', async ({ items, appliedDiscount ,shippingFee}, thunkAPI) => {
  try {
    
    const res = await fetch('http://localhost:5000/api/users/cart/set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ items, appliedDiscount,shippingFee })
    });

    const data = await res.json();

    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi cập nhật giỏ hàng');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Lỗi kết nối server');
  }
})

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    console.log('slice',{quantity});
    
    const res = await fetch('http://localhost:5000/api/users/cart/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity })
    })
    const data = await res.json();

    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi cập nhật số lượng');
    return data;
  } catch (error) {
    console.log(error);
    return thunkAPI.rejectWithValue('Lỗi kết nối server');
  }
})

export const applyDiscount = createAsyncThunk(
  'cart/applyDiscount',
  async (code, thunkAPI) => {
    try {
      console.log('codeslice:', code);

      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/users/cart/apply-discount', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể áp dụng mã giảm giá');
      }

      return data;
    } catch (error) {
      console.error(error);
      return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
    }
  }
);

export const removeDiscount = createAsyncThunk(
  'cart/removeDiscount',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/users/cart/remove-discount', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Không thể gỡ mã giảm giá');
      }

      return data;
    } catch (error) {
      console.error('Lỗi gỡ mã giảm giá:', error);
      return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null,
    selectedDiscountSlice: null,
    success: false,
    discountLoading: false,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = null;
      state.selectedDiscountSlice = null;
      state.success = false;
      state.error = null;
    }

  },
  extraReducers: builder => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        if (action.payload.appliedDiscount) {

          state.selectedDiscountSlice = action.payload.appliedDiscount;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD TO CART
      .addCase(addToCart.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.success = true;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // SET CART
      .addCase(setCart.pending, (state) => {
        // Không set loading = true để tránh ảnh hưởng UI khi debounce
        state.error = null;
      })
      .addCase(setCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        // Giữ nguyên discount nếu có
        // console.log('action.payload:',action.payload);

        if (action.payload.appliedDiscount) {
          state.selectedDiscountSlice = action.payload.appliedDiscount;

        }
      })
      .addCase(setCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // APPLY DISCOUNT
      .addCase(applyDiscount.pending, (state) => {
        state.discountLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {

        state.discountLoading = false;
        state.success = true;

        // *** QUAN TRỌNG: Cập nhật cart với dữ liệu mới từ server ***
        if (action.payload.cart) {
          state.cart = action.payload.cart;
        }

        // Cập nhật discount information
        if (action.payload.appliedDiscount) {
          state.selectedDiscountSlice = action.payload.appliedDiscount;
        }

      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.discountLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // REMOVE DISCOUNT
      .addCase(removeDiscount.pending, (state) => {
        state.discountLoading = true;
        state.error = null;
      })
      .addCase(removeDiscount.fulfilled, (state, action) => {
        state.discountLoading = false;
        state.selectedDiscountSlice = null; // Xóa discount



        // Cập nhật cart nếu server trả về
        if (action.payload.cart) {
          state.cart = action.payload.cart;
        }
      })
      .addCase(removeDiscount.rejected, (state, action) => {
        state.discountLoading = false;
        state.error = action.payload;
      });
  }
})
// Tổng tiền đã áp dụng giảm giá sản phẩm (theo discountPercent của từng sản phẩm)
export const selectCartSubtotalAfterProductDiscount = (state) => {
  const items = state.user.userCart.cart?.items || [];
  return items.reduce((sum, item) => {
    const price = item.product.price || 0;
    const productDiscount = item.product.discountPercent || 0;
    const quantity = item.quantity || 0;
    const discountedPrice = price * (1 - productDiscount / 100);
    return sum + discountedPrice * quantity;
  }, 0);
};

// Tổng tiền giảm giá của mã giảm giá áp dụng trên tổng tiền đã giảm giá sản phẩm
export const selectCartDiscountAmount = (state) => {
  const discountInfo = state.user.userCart.selectedDiscountSlice;
  if (!discountInfo) return 0;

  const subtotalAfterProductDiscount = selectCartSubtotalAfterProductDiscount(state);
  const rawDiscount = subtotalAfterProductDiscount * (discountInfo.discountPercent / 100);

  if (discountInfo.maxDiscount) {
    return Math.min(Math.round(rawDiscount), discountInfo.maxDiscount);
  }

  return Math.round(rawDiscount);
};


// Tổng tiền cuối cùng sau khi áp dụng giảm giá sản phẩm và mã giảm giá và tiền ship
export const selectCartTotalPrice = (state) => {
  const shippingFee = selectShippingFee(state);  
  const subtotalAfterProductDiscount = selectCartSubtotalAfterProductDiscount(state);
  const discountAmount = selectCartDiscountAmount(state);
  return subtotalAfterProductDiscount - discountAmount+ shippingFee;
};
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;