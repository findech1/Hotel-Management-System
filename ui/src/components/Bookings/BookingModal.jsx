import React, { useState } from "react";
import * as bookingService from "../../services/bookingService";
import "./BookingModal.css";

/**
 * BookingModal Component - Modal for booking rooms
 * Handles room booking with date selection and validation
 */
const BookingModal = ({ room, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Update total price when dates change
  React.useEffect(() => {
    if (startDate && endDate) {
      const price = bookingService.calculateTotalPrice(
        room.price,
        startDate,
        endDate,
      );
      setTotalPrice(price);
    }
  }, [startDate, endDate, room.price]);

  /**
   * Handle booking submission
   */
  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    // Validate dates
    const validation = bookingService.validateDates(startDate, endDate);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);

    try {
      // Create booking object
      const booking = {
        room: {
          id: room.id,
        },
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: "CONFIRMED",
      };

      // Call API to create booking
      const response = await bookingService.createBooking(booking);

      // Show success message and close modal
      if (response.status === 200 || response.status === 201) {
        setError("");
        setStartDate("");
        setEndDate("");
        if (onSuccess) {
          onSuccess(response.data);
        }
        onClose();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to create booking. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get minimum date (today)
   */
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  /**
   * Get minimum checkout date (after check-in)
   */
  const getMinCheckoutDate = () => {
    if (!startDate) return getMinDate();
    const start = new Date(startDate);
    start.setDate(start.getDate() + 1);
    return start.toISOString().split("T")[0];
  };

  /**
   * Calculate number of nights
   */
  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Book {room.type} Room</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Room Details */}
          <div className="booking-room-info">
            <div className="room-info-item">
              <span className="label">Room Type</span>
              <span className="value">{room.type}</span>
            </div>
            <div className="room-info-item">
              <span className="label">Price per Night</span>
              <span className="value">${room.price}</span>
            </div>
            <div className="room-info-item">
              <span className="label">Capacity</span>
              <span className="value">{room.capacity} Guest(s)</span>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBooking} className="booking-form">
            {/* Error Message */}
            {error && (
              <div className="alert alert-danger">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Check-in Date */}
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                Check-in Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={getMinDate()}
                required
              />
            </div>

            {/* Check-out Date */}
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                Check-out Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={getMinCheckoutDate()}
                required
              />
            </div>

            {/* Booking Summary */}
            {startDate && endDate && (
              <div className="booking-summary">
                <div className="summary-item">
                  <span>Nights:</span>
                  <strong>{calculateNights()}</strong>
                </div>
                <div className="summary-item">
                  <span>Price per Night:</span>
                  <strong>${room.price}</strong>
                </div>
                <div className="summary-total">
                  <span>Total Price:</span>
                  <strong>${totalPrice}</strong>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !startDate || !endDate}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
