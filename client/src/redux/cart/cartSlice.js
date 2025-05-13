import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {

  try {
    const res = await fetch('http://localhost:5000/api/users/carts', {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }

    })
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi lấy giỏ hàng');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được giỏ hàng');

  }
})

export const updateCartItemQuantity = createAsyncThunk('cart/updateQuantity', async ({ productId, quantity }, thunkAPI) => {

  try {
    const res = await fetch('http://localhost:5000/api/users/carts/update', {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ productId, quantity })


    })
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Cập nhật thất bại');

  }
})
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/carts/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi xóa sản phẩm');
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:5000/api/users/carts/add', {
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

// export const initializeCart = createAsyncThunk('cart/initializeCart', async (_, thunkAPI) => {
//     try {
//         const res = await fetch('http://localhost:5000/api/users/cart/init', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             }
//         });

//         const data = await res.json();
//         if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Không thể khởi tạo giỏ hàng');
//         return data;
//     } catch (error) {
//         return thunkAPI.rejectWithValue('Lỗi kết nối server');
//     }
// });

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null
  },
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload; // Cập nhật giỏ hàng đầy đủ từ payload
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lỗi nếu có
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload; // Cập nhật giỏ hàng sau khi thêm sản phẩm
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload; // Lỗi nếu có
      })

      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        // Cập nhật chỉ các item trong cart
        const updatedItem = action.payload;
        const itemIndex = state.cart.items.findIndex(item => item.product._id === updatedItem.product._id);
        if (itemIndex !== -1) {
          state.cart.items[itemIndex] = updatedItem; // Cập nhật lại item cụ thể
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.error = action.payload; // Lỗi nếu có
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload; // Cập nhật giỏ hàng sau khi xóa sản phẩm
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload; // Lỗi nếu có
      })


    //   .addCase(initializeCart.pending, (state) => {
    //     state.loading = true;
    // })
    // .addCase(initializeCart.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.items = [];
    // })
    // .addCase(initializeCart.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload;
    // });
  }
})

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer