import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBrands = createAsyncThunk('brands/fetchBrands', async (_, thunkAPI) => {
  try {
    const res = await fetch('http://localhost:5000/api/admin/brands', {
      method: 'GET',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }

    })
    const data = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Lỗi lấy brand');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được brand');

  }
})
export const fetchBrandById = createAsyncThunk('brands/fetchBrandById', async (brandId, thunkAPI) => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/brands/${brandId}`, {
      method: 'GET',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const data=await res.json()
    if(!res.ok)return thunkAPI.rejectWithValue(data.message || 'Lỗi lấy brand');
    return data;

  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được brand');

  }
})
export const updateBrand = createAsyncThunk('brands/updateBrand', async ({brandData,brandId}, thunkAPI) => {

  console.log('formDatasl:',brandData);

  try {
    const res = await fetch(`http://localhost:5000/api/admin/brands/${brandId}`, {
      method: 'PUT',

      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: brandData

    })

    const data=await res.json()
    
    if(!res.ok)return thunkAPI.rejectWithValue(data.message || 'Lỗi lấy brand');
    return data;

  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không lấy được brand');

  }
})
export const removeBrand = createAsyncThunk('brands/removeBrand', async (brandId, thunkAPI) => {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/brands/${brandId}`, {
      method: 'DELETE',

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },

    })

    const data=await res.json()
    if(!res.ok)return thunkAPI.rejectWithValue(data.message || 'Lỗi xóa brand');
    return data;

  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Không xóa được brand');

  }
})

export const addBrand = createAsyncThunk(
  'brands/addBrand',
  async (brandData, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/brands', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: brandData
      });

      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message || 'Thêm brand thất bại');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Lỗi khi thêm brand');
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brand:null,
    brands: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetBrandDetail:(state)=>{
      state.brand=null
      state.error=null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBrands.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchBrandById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.loading = false;
        state.brand = action.payload;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateBrand.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brand = action.payload;
      })
      .addCase(updateBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(removeBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBrand.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.id; 
        state.brands = state.brands.filter(brand => brand._id !== deletedId);
      })
      
      .addCase(removeBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload); // thêm brand vào danh sách
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const  {resetBrandDetail}=brandSlice.actions
export default brandSlice.reducer;