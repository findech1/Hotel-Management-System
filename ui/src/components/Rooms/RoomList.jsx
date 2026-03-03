import React, { useEffect, useState } from "react";
import * as roomService from "../../services/roomService";
import BookingModal from "../Bookings/BookingModal";
import "./RoomList.css";

/**
 * RoomList Component - Displays available rooms with filtering and booking capability
 * Implements OOP principles with service classes for data management
 */
const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Fetch rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, []);

  /**
   * Fetch all rooms from the server
   */
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomService.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter rooms based on selected filter type
   */
  const filterRooms = (rooms) => {
    // For now, return all rooms (filtering can be added back later)
    return rooms;
  };

  /**
   * Handle booking button click
   */
  const handleBookClick = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  /**
   * Handle successful booking
   */
  const handleBookingSuccess = (booking) => {
    console.log("Booking successful:", booking);
    // Refresh rooms to update availability
    fetchRooms();
  };

  /**
   * Handle close booking modal
   */
  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
  };

  const filteredRooms = filterRooms(rooms);

  if (loading) {
    return (
      <div className="rooms-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <div>
          <h1>Available Rooms</h1>
          <p className="subtitle">Browse and book your perfect room</p>
        </div>
        <div className="room-count">
          {filteredRooms.length} of {rooms.length} rooms
        </div>
      </div>

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Rooms ({rooms.length})
        </button>
        <button
          className={`filter-btn ${filter === "available" ? "active" : ""}`}
          onClick={() => setFilter("available")}
        >
          Available ({rooms.filter((r) => r.availability).length})
        </button>
        <button
          className={`filter-btn ${filter === "booked" ? "active" : ""}`}
          onClick={() => setFilter("booked")}
        >
          Booked ({rooms.filter((r) => !r.availability).length})
        </button>
      </div>

      {filteredRooms.length === 0 ? (
        <div className="no-rooms">
          <p>No rooms found</p>
        </div>
      ) : (
        <div className="rooms-grid">
          {filteredRooms.map((room) => (
            <div key={room.id} className="room-card-wrapper">
              <div className="room-card">
                <div className="room-header">
                  <div className="room-emoji">{roomService.getRoomEmoji(room.type)}</div>
                  <span
                    className={`availability-badge ${
                      room.availability ? "available" : "booked"
                    }`}
                  >
                    {room.availability ? "✓ Available" : "⨯ Booked"}
                  </span>
                </div>

                <div className="room-body">
                  <h3 className="room-type">{room.type} Room</h3>
                  <div className="room-info">
                    <div className="info-item">
                      <span className="label">Price</span>
                      <span className="value">${room.price}/night</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Capacity</span>
                      <span className="value">{room.capacity} Guest(s)</span>
                    </div>
                  </div>

                  <div className="amenities">
                    <h4>Amenities</h4>
                    <p>{room.amenities}</p>
                  </div>
                </div>

                <div className="room-footer">
                  <button
                    className={`btn-book ${!room.availability ? "disabled" : ""}`}
                    onClick={() => handleBookClick(room)}
                    disabled={!room.availability}
                  >
                    {room.availability ? "📅 Book Now" : "❌ Not Available"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={handleCloseModal}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default RoomList;
