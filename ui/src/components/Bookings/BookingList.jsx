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
 
  {/* ── Hero Header ─────────────────────────────────── */}
  <div className="bookings-header">
    <div className="bookings-header-inner">
      <div className="bookings-eyebrow">Guest Portal</div>
      <h1>My <em>Reservations</em></h1>
      <p className="subtitle">Manage your room reservations and stays</p>
    </div>
  </div>
 
  <div className="bookings-content">
 
    {/* Error */}
    {error && (
      <div className="alert alert-danger">
        <span className="alert-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </span>
        {error}
      </div>
    )}
 
    {/* Empty State */}
    {bookings.length === 0 ? (
      <div className="no-bookings">
        <div className="no-bookings-icon">
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
            <line x1="9" y1="15" x2="15" y2="15" strokeOpacity=".4"/>
          </svg>
        </div>
        <h3>No Reservations Yet</h3>
        <p>You have no active bookings. Browse our available rooms to plan your perfect stay.</p>
      </div>
    ) : (
      <div className="bookings-grid">
        {bookings.map((booking) => {
          const badge = getStatusBadge(booking.status);
          const startDate = new Date(booking.startDate).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });
          const endDate   = new Date(booking.endDate).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });
          const nights    = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));
 
          return (
            <div key={booking.id} className="booking-card">
 
              {/* Card Header with room photo bg */}
              <div className="booking-header">
                <div className="booking-room-info">
                  <div className="room-icon">
                    <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <div>
                    <h3>{booking.room.type} Room</h3>
                    <p className="booking-id">#{booking.id}</p>
                  </div>
                </div>
                <span className={`status-badge status-${badge.color}`}>
                  {badge.text}
                </span>
              </div>
 
              {/* Card Body */}
              <div className="booking-body">
                <div className="booking-detail">
                  <span className="detail-label">Check-in</span>
                  <span className="detail-value">
                    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    {startDate}
                  </span>
                </div>
                <div className="booking-detail">
                  <span className="detail-label">Check-out</span>
                  <span className="detail-value">
                    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    {endDate}
                  </span>
                </div>
                <div className="booking-detail">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {nights} Night{nights !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="booking-detail">
                  <span className="detail-label">Rate / Night</span>
                  <span className="detail-value">Ksh {Number(booking.room.price).toLocaleString()}</span>
                </div>
                <div className="booking-detail total">
                  <span className="detail-label">Total</span>
                  <span className="detail-value">Ksh {Number(booking.room.price * nights).toLocaleString()}</span>
                </div>
 
                {booking.room.amenities && (
                  <div className="booking-amenities">
                    <span className="amenities-label">Amenities</span>
                    <p>{booking.room.amenities}</p>
                  </div>
                )}
              </div>
 
              {/* Card Footer */}
              <div className="booking-footer">
                {booking.status === "CONFIRMED" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    <span>Cancel Reservation</span>
                  </button>
                )}
              </div>
 
            </div>
          );
        })}
      </div>
    )}
 
  </div>
</div>
  );
};

export default BookingList;
