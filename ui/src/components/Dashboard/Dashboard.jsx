import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import "./Dashboard.css";
import authHeader from "../../services/auth-header";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all rooms
      const roomsRes = await axios.get("http://localhost:8080/api/rooms");
      const allRooms = roomsRes.data;

      // Fetch user bookings
      const bookingsRes = await axios.get(
        "http://localhost:8080/api/bookings/user",
        { headers: authHeader() },
      );
      const userBookings = bookingsRes.data;

      // Calculate stats
      const availableRooms = allRooms.filter((r) => r.availability).length;

      setStats({
        totalRooms: allRooms.length,
        availableRooms: availableRooms,
        totalBookings: userBookings.length,
      });

      setRooms(allRooms.slice(0, 3)); // Show top 3 rooms
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  const getRoomEmoji = (type) => {
    const emojis = {
      Single: "🛏️",
      Double: "🛏️🛏️",
      Suite: "👑",
      Deluxe: "💎",
      Family: "👨‍👩‍👧‍👦",
    };
    return emojis[type] || "🏨";
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="container-fluid py-5">
          {/* Welcome Section */}
          <div className="welcome-section mb-5">
            <div className="welcome-content">
              <h1 className="display-4 fw-bold">
                Welcome, <span className="text-gradient">{user?.username}</span>
                ! 👋
              </h1>
              <p className="lead text-muted">
                Ready to book your next perfect stay?
              </p>
            </div>
            <div className="welcome-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-5">
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue">🏨</div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.totalRooms}</h3>
                  <p className="stat-label">Total Rooms</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="stat-card">
                <div className="stat-icon stat-icon-green">✅</div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.availableRooms}</h3>
                  <p className="stat-label">Available Now</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="stat-card">
                <div className="stat-icon stat-icon-purple">📅</div>
                <div className="stat-content">
                  <h3 className="stat-value">{stats.totalBookings}</h3>
                  <p className="stat-label">Your Bookings</p>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-md-6 mb-3">
              <div className="stat-card">
                <div className="stat-icon stat-icon-orange">⭐</div>
                <div className="stat-content">
                  <h3 className="stat-value">4.8</h3>
                  <p className="stat-label">User Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Rooms Section */}
          <div className="featured-section">
            <div className="section-header">
              <h2>Featured Rooms</h2>
              <a href="/rooms" className="view-all-link">
                View All Rooms →
              </a>
            </div>

            <div className="row">
              {rooms.map((room) => (
                <div key={room.id} className="col-md-4 mb-4">
                  <div className="featured-room-card">
                    <div className="featured-room-image">
                      <div className="room-emoji-large">
                        {getRoomEmoji(room.type)}
                      </div>
                      <div
                        className={`featured-badge ${
                          room.availability ? "available" : "unavailable"
                        }`}
                      >
                        {room.availability ? "Available" : "Booked"}
                      </div>
                    </div>
                    <div className="featured-room-body">
                      <h4>{room.type}</h4>
                      <p className="room-price">${room.price}/night</p>
                      <div className="room-specs">
                        <span>👥 {room.capacity} Guests</span>
                        <span>🏠 Amenities</span>
                      </div>
                      <p className="room-amenities">{room.amenities}</p>
                      <button
                        className={`btn btn-sm w-100 ${
                          room.availability ? "btn-primary" : "btn-secondary"
                        }`}
                        disabled={!room.availability}
                      >
                        {room.availability ? "Book Now" : "Unavailable"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="quick-actions-section mt-5">
            <h2 className="mb-4">Quick Actions</h2>
            <div className="row">
              <div className="col-md-4 mb-3">
                <a href="/rooms" className="action-card">
                  <div className="action-icon">🔍</div>
                  <h4>Browse Rooms</h4>
                  <p>Explore all available rooms and amenities</p>
                  <span className="action-arrow">→</span>
                </a>
              </div>
              <div className="col-md-4 mb-3">
                <a href="/bookings" className="action-card">
                  <div className="action-icon">📅</div>
                  <h4>My Bookings</h4>
                  <p>View and manage your reservations</p>
                  <span className="action-arrow">→</span>
                </a>
              </div>
              <div className="col-md-4 mb-3">
                <div className="action-card disabled">
                  <div className="action-icon">💬</div>
                  <h4>Live Chat</h4>
                  <p>Get instant support from our team</p>
                  <span className="action-arrow">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
