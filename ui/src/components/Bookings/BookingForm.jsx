import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as bookingService from "../../services/bookingService";
import * as roomService from "../../services/roomService";
import { getCurrentUser } from "../../services/authService";
import "./BookingForm.css";

const BookingForm = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    roomService.getRooms().then((response) => {
      setRooms(response.data);
    });
  }, []);

  const handleBooking = (e) => {
    e.preventDefault();
    const booking = {
      roomId: selectedRoom,
      userId: currentUser.id,
      startDate,
      endDate,
    };

    bookingService
      .createBooking(booking)
      .then(() => {
        setMessage("Booking successful");
      })
      .catch(() => {
        setMessage("Booking failed");
      });
  };

  return (
    <div className="booking-form-page">
 
  {/* ── Hero Banner ─────────────────────────────────── */}
  <div className="bf-hero">
    <div className="bf-hero-inner">
      <div className="bookings-eyebrow">Reservations</div>
      <h1 className="bf-hero-title">Reserve Your <em>Suite</em></h1>
      <p className="bf-hero-sub">Select your preferred room and travel dates below</p>
    </div>
  </div>
 
  {/* ── Form Card ───────────────────────────────────── */}
  <div className="bf-card-wrap">
    <div className="bf-card">
 
      <div className="bf-card-header">
        <div className="bf-card-eyebrow">New Reservation</div>
        <h2 className="bf-card-title">Book a Room</h2>
      </div>
 
      <div className="bf-divider" />
 
      <form onSubmit={handleBooking} className="bf-form">
 
        {/* Room Select */}
        <div className="form-group">
          <label className="form-label" htmlFor="room">Room Type</label>
          <div className="select-wrapper">
            <select
              id="room"
              className="form-control"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              required
            >
              <option value="">Select a Room</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.type} — Ksh {Number(room.price).toLocaleString()}
                </option>
              ))}
            </select>
            <span className="select-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
        </div>
 
        {/* Check-in */}
        <div className="form-group">
          <label className="form-label" htmlFor="startDate">
            Check-in Date
          </label>
          <div className="date-input-wrap">
            <span className="date-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <input
              type="date"
              id="startDate"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
        </div>
 
        {/* Check-out */}
        <div className="form-group">
          <label className="form-label" htmlFor="endDate">
            Check-out Date
          </label>
          <div className="date-input-wrap">
            <span className="date-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </span>
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
 
        {/* Submit */}
        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <button type="submit" className="btn-book">
            <span>Confirm Reservation</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
 
        {/* Message */}
        {message && (
          <div
            className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}
            role="alert"
          >
            <span className="alert-icon">
              {message.includes("success") ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              )}
            </span>
            {message}
          </div>
        )}
 
      </form>
    </div>
  </div>
 
</div>
  );
};

export default BookingForm;
