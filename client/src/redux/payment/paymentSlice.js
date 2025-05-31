import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/users';

// Async thunk để tạo Payment Intent
export const createPaymentIntent = createAsyncThunk(
    'payment/createPaymentIntent',
    async (paymentData, { rejectWithValue }) => {
        try {
            const { totalAmount, currency = 'vnd', metadata = {} } = paymentData;
            
            const response = await axios.post(`${API_BASE_URL}/payments/create-payment-intent`, {
                totalAmount,
                currency,
                metadata
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Nếu có authentication
                }
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Lỗi khi tạo Payment Intent'
            );
        }
    }
);

// Async thunk để xác nhận thanh toán
export const confirmPayment = createAsyncThunk(
    'payment/confirmPayment',
    async (paymentIntentId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/payments/confirm-payment`, {
                paymentIntentId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Lỗi khi xác nhận thanh toán'
            );
        }
    }
);

// Async thunk để lấy Stripe public key
export const getStripePublicKey = createAsyncThunk(
    'payment/getStripePublicKey',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/payments/public-key`);
            return response.data.data.publicKey;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Lỗi khi lấy public key'
            );
        }
    }
);

// Initial state
const initialState = {
    clientSecret: null,
    paymentIntentId: null,
    publicKey: null,
    amount: 0,
    currency: 'vnd',
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    loading: false,
    error: null,
    paymentStatus: null, // trạng thái thanh toán hiện tại
    paymentHistory: [] // lịch sử thanh toán
};

// Create slice
const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        // Reset payment state
        resetPaymentState: (state) => {
            state.clientSecret = null;
            state.paymentIntentId = null;
            state.amount = 0;
            state.status = 'idle';
            state.error = null;
            state.paymentStatus = null;
        },
        
        // Set payment status manually
        setPaymentStatus: (state, action) => {
            state.paymentStatus = action.payload;
        },
        
        // Clear error
        clearPaymentError: (state) => {
            state.error = null;
        },
        
        // Update amount
        updatePaymentAmount: (state, action) => {
            state.amount = action.payload;
        },
        
        // Add to payment history
        addToPaymentHistory: (state, action) => {
            state.paymentHistory.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        // Create Payment Intent
        builder
            .addCase(createPaymentIntent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = 'loading';
            })
            .addCase(createPaymentIntent.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                state.clientSecret = action.payload.clientSecret;
                state.paymentIntentId = action.payload.paymentIntentId;
                state.amount = action.payload.amount;
                state.currency = action.payload.currency;
                state.error = null;
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload;
                state.clientSecret = null;
                state.paymentIntentId = null;
            });

        // Confirm Payment
        builder
            .addCase(confirmPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(confirmPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentStatus = 'succeeded';
                state.error = null;
                
                // Add to payment history
                state.paymentHistory.unshift({
                    paymentIntentId: action.payload.paymentIntentId,
                    amount: action.payload.amount,
                    status: action.payload.status,
                    timestamp: new Date().toISOString()
                });
            })
            .addCase(confirmPayment.rejected, (state, action) => {
                state.loading = false;
                state.paymentStatus = 'failed';
                state.error = action.payload;
            });

        // Get Stripe Public Key
        builder
            .addCase(getStripePublicKey.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStripePublicKey.fulfilled, (state, action) => {
                state.loading = false;
                state.publicKey = action.payload;
                state.error = null;
            })
            .addCase(getStripePublicKey.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export actions
export const {
    resetPaymentState,
    setPaymentStatus,
    clearPaymentError,
    updatePaymentAmount,
    addToPaymentHistory
} = paymentSlice.actions;

// Selectors
export const selectPaymentState = (state) => state.payment;
export const selectClientSecret = (state) => state.payment.clientSecret;
export const selectPaymentLoading = (state) => state.payment.loading;
export const selectPaymentError = (state) => state.payment.error;
export const selectPaymentStatus = (state) => state.payment.paymentStatus;
export const selectPaymentHistory = (state) => state.payment.paymentHistory;
export const selectStripePublicKey = (state) => state.payment.publicKey;

// Export reducer
export default paymentSlice.reducer;