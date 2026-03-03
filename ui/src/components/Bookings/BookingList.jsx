import React, { useEffect, useState } from "react";
import * as bookingService from "../../services/bookingService";
import * as roomService from "../../services/roomService";
import "./BookingList.css";

/**
 * BookingList Component - Displays user's bookings and allows cancellation
 */
const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await bookingService.getUserBookings();
      setBookings(response.data);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle booking cancellation
   */
  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await bookingService.cancelBooking(id);
        await fetchBookings();
      } catch (err) {
        setError("Failed to cancel booking");
      }
    }
  };

  /**
   * Get room emoji
   */
  const getRoomEmoji = (roomType) => {
    const emojis = {
      Single: "🛏️",
      Double: "🛏️🛏️",
      Suite: "👑",
      Deluxe: "💎",
      Family: "👨‍👩‍👧‍👦",
    };
    return emojis[roomType] || "🏨";
  };

  /**
   * Get status badge color and text
   */
  const getStatusBadge = (status) => {
    const badges = {
      CONFIRMED: { color: "success", text: "✓ Confirmed" },
      CANCELLED: { color: "danger", text: "✕ Cancelled" },
      PENDING: { color: "warning", text: "⏳ Pending" },
    };
    return badges[status] || { color: "secondary", text: status };
  };

  if (loading) {
    return (
      <div className="booking-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-list-container">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p className="subtitle">Manage your room reservations</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-bookings-icon">📭</div>
          <h3>No Bookings Yet</h3>
          <p>
            You haven't made any bookings. Browse available rooms to make your
            first booking!
          </p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => {
            const badge = getStatusBadge(booking.status);
            const startDate = new Date(booking.startDate).toLocaleDateString();
            const endDate = new Date(booking.endDate).toLocaleDateString();
            const nights = Math.ceil(
              (new Date(booking.endDate) - new Date(booking.startDate)) /
                (1000 * 60 * 60 * 24),
            );

            return (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <div className="booking-room-info">
                    <div className="room-emoji">
                      {getRoomEmoji(booking.room.type)}
                    </div>
                    <div>
                      <h3>{booking.room.type} Room</h3>
                      <p className="booking-id">Booking ID: #{booking.id}</p>
                    </div>
                  </div>
                  <span className={`status-badge status-${badge.color}`}>
                    {badge.text}
                  </span>
                </div>

                <div className="booking-body">
                  <div className="booking-detail">
                    <span className="detail-label">Check-in</span>
                    <span className="detail-value">📅 {startDate}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="detail-label">Check-out</span>
                    <span className="detail-value">📅 {endDate}</span>
                  </div>
                  <div className="booking-detail">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">🌙 {nights} Night(s)</span>
                  </div>
                  <div className="booking-detail">
                    <span className="detail-label">Price per Night</span>
                    <span className="detail-value">
                      💰 ${booking.room.price}
                    </span>
                  </div>
                  <div className="booking-detail total">
                    <span className="detail-label">Total Price</span>
                    <span className="detail-value">
                      ${booking.room.price * nights}
                    </span>
                  </div>

                  {booking.room.amenities && (
                    <div className="booking-amenities">
                      <span className="amenities-label">Amenities:</span>
                      <p>{booking.room.amenities}</p>
                    </div>
                  )}
                </div>

                <div className="booking-footer">
                  {booking.status === "CONFIRMED" && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingList;
