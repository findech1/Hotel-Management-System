import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/bookings/";

export const createBooking = (booking) => {
  return axios.post(API_URL, booking, { headers: authHeader() });
};

export const getUserBookings = () => {
  return axios.get(`${API_URL}user`, { headers: authHeader() });
};

export const updateBooking = (id, updates) => {
  return axios.put(`${API_URL}${id}`, updates, { headers: authHeader() });
};

export const cancelBooking = (id) => {
  return axios.delete(`${API_URL}${id}`, { headers: authHeader() });
};

export const calculateTotalPrice = (roomPrice, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return roomPrice * nights;
};

export const validateDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start < today) {
    return { isValid: false, error: "Check-in date cannot be in the past" };
  }
  if (end <= start) {
    return {
      isValid: false,
      error: "Check-out date must be after check-in date",
    };
  }
  return { isValid: true, error: null };
};

export const formatBooking = (booking) => {
  return {
    ...booking,
    nights: Math.ceil(
      (new Date(booking.endDate) - new Date(booking.startDate)) /
        (1000 * 60 * 60 * 24),
    ),
    totalPrice: calculateTotalPrice(
      booking.room.price,
      booking.startDate,
      booking.endDate,
    ),
  };
};
