import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bookingService from "../services/bookingService";

/**
 * Async thunk for creating a booking
 */
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (booking, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(booking);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create booking",
      );
    }
  },
);

/**
 * Async thunk for fetching user bookings
 */
export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingService.getUserBookings();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings",
      );
    }
  },
);

/**
 * Async thunk for updating a booking
 */
export const updateBooking = createAsyncThunk(
  "bookings/updateBooking",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBooking(id, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update booking",
      );
    }
  },
);

/**
 * Async thunk for canceling a booking
 */
export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (id, { rejectWithValue }) => {
    try {
      await bookingService.cancelBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel booking",
      );
    }
  },
);

/**
 * Booking Slice - Redux state management for bookings
 */
const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    success: false,
    selectedBooking: null,
  },
  reducers: {
    /**
     * Clear error messages
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Clear success messages
     */
    clearSuccess: (state) => {
      state.success = false;
    },

    /**
     * Select a booking
     */
    selectBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },

    /**
     * Clear selected booking
     */
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },

    /**
     * Reset bookings state
     */
    resetBookings: (state) => {
      state.bookings = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.selectedBooking = null;
    },
  },
  extraReducers: (builder) => {
    // Create Booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Fetch User Bookings
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Booking
    builder
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Cancel Booking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookings = state.bookings.filter((b) => b.id !== action.payload);
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSuccess,
  selectBooking,
  clearSelectedBooking,
  resetBookings,
} = bookingSlice.actions;

// Export reducer
export default bookingSlice.reducer;
