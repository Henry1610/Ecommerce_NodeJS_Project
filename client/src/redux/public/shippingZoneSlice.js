import { createAsyncThunk,createSlice  } from '@reduxjs/toolkit';

export const fetchPublicShippingZones = createAsyncThunk(
  'publicShippingZones/fetchPublicShippingZones',
  async (_, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:5000/api/shipping-zones', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
       
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Error fetching shipping zones:', data);
        return thunkAPI.rejectWithValue(data.message || 'Không thể lấy vùng vận chuyển');
      }

      return data;
    } catch (error) {
      console.error('Network error fetching shipping zones:', error);
      return thunkAPI.rejectWithValue('Lỗi kết nối server');
    }
  }
);

const shippingZoneSlice = createSlice({
    name: 'publicShippingZones',
    initialState: {
      zones: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchPublicShippingZones.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPublicShippingZones.fulfilled, (state, action) => {
         
          state.loading = false;
          state.zones = action.payload;

        })
        .addCase(fetchPublicShippingZones.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Lỗi khi lấy vùng vận chuyển';
        });
    },
  });
  
  export default shippingZoneSlice.reducer;