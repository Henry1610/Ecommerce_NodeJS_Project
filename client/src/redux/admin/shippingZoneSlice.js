import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all shipping zones
export const fetchShippingZones = createAsyncThunk(
  'shippingZones/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/shipping-zones', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
    }
  }
);

// Fetch by ID
export const fetchShippingZoneById = createAsyncThunk(
  'shippingZones/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/shipping-zones/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);
      return data; // 
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
    }
  }
);

// Create
export const createShippingZone = createAsyncThunk(
  'shippingZones/create',
  async (zoneData, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/shipping-zones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(zoneData),
      });
      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);
      return data; //
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
    }
  }
);

// Update
export const updateShippingZone = createAsyncThunk(
  'shippingZones/update',
  async ({ id, city, fee }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/shipping-zones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ city, fee }),
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Lỗi khi cập nhật vùng vận chuyển');
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
    }
  }
);

// Delete
export const deleteShippingZone = createAsyncThunk(
  'shippingZones/delete',
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/shipping-zones/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) return thunkAPI.rejectWithValue(data.message);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue('Lỗi kết nối đến server');
    }
  }
);

// SLICE
const shippingZoneSlice = createSlice({
  name: 'shippingZones',
  initialState: {
    zones: [],
    currentZone: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchShippingZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload;
      })
      .addCase(fetchShippingZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch by ID
      .addCase(fetchShippingZoneById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentZone = null;
      })
      .addCase(fetchShippingZoneById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentZone = action.payload;
      })
      .addCase(fetchShippingZoneById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createShippingZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShippingZone.fulfilled, (state, action) => {
        state.loading = false;
        state.zones.push(action.payload); 
      })
      .addCase(createShippingZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateShippingZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingZone.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = state.zones.map(zone =>
          zone._id === action.payload._id ? action.payload : zone
        );
        state.currentZone = action.payload;
      })
      .addCase(updateShippingZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteShippingZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShippingZone.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = state.zones.filter((zone) => zone._id !== action.payload);
      })
      .addCase(deleteShippingZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shippingZoneSlice.reducer;
