import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
    // console.log('data:',data);
    
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được giỏ hàng');

  }
})

export const setCart = createAsyncThunk('cart/setCart', async ( {items} , thunkAPI) => {
  try {
    console.log('items setcart_redux:',items);
    
    const res = await fetch('http://localhost:5000/api/users/cart/set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify( {items} )


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

    const res = await fetch('http://localhost:5000/api/users/cart/add', {
      method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({ productId, quantity })

    })
    const data = await res.json();
    console.log('data:',data);
    
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi cập nhật số lượng');
    return data;
  } catch (error) {
    console.log(error);

    return thunkAPI.rejectWithValue('Lỗi kết nối server');

  }

})

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
    
  },
  extraReducers: builder => {
    builder
      // FETCH CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      // ADD TO CART
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
  
      // SET CART
      .addCase(setCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(setCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(setCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
  
  
})
export default cartSlice.reducer