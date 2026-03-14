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
      const roomsRes = await axios.get("http://localhost:8080/api/rooms");
      const allRooms = roomsRes.data;

      const bookingsRes = await axios.get(
        "http://localhost:8080/api/bookings/user",
        { headers: authHeader() }
      );
      const userBookings = bookingsRes.data;

      const availableRooms = allRooms.filter((r) => r.availability).length;

      setStats({
        totalRooms: allRooms.length,
        availableRooms: availableRooms,
        totalBookings: userBookings.length,
      });

      setRooms(allRooms.slice(0, 3));
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

  // ── Room photo map (keyed by room type) ─────────────────
  const ROOM_PHOTOS = {
    Single: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=75&auto=format&fit=crop",
    Double: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=75&auto=format&fit=crop",
    Suite:  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=75&auto=format&fit=crop",
    Deluxe: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=75&auto=format&fit=crop",
    Family: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=75&auto=format&fit=crop",
  };

  const DEFAULT_ROOM_PHOTO =
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=75&auto=format&fit=crop";

  // ── JSX ─────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="dashboard-container">

        {/* ══ HERO BANNER ════════════════════════════════════ */}
        <div className="dashboard-hero">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="hero-eyebrow">Staff Dashboard</div>
              <h1 className="hero-greeting">
                Welcome back,<br />
                <em>{user?.username}</em>
              </h1>
              <p className="hero-sub">Ready to curate your next perfect stay?</p>
            </div>

            <div className="hero-date-badge">
              <span className="date-day">
                {new Date().toLocaleDateString("en-KE", { day: "numeric" })}
              </span>
              <span className="date-full">
                {new Date().toLocaleDateString("en-KE", {
                  weekday: "long",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* ══ MAIN CONTENT ══════════════════════════════════ */}
        <div className="dash-content">

          {/* ── Stats Row ──────────────────────────────────── */}
          <div className="stats-row" style={{ marginTop: "2.5rem" }}>

            <div className="stat-card">
              <div className="stat-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.totalRooms}</h3>
                <p className="stat-label">Total Rooms</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.availableRooms}</h3>
                <p className="stat-label">Available Now</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stats.totalBookings}</h3>
                <p className="stat-label">Your Bookings</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="stat-content">
                <h3 className="stat-value">4.8</h3>
                <p className="stat-label">Guest Rating</p>
              </div>
            </div>

          </div>

          {/* ── Featured Rooms ──────────────────────────────── */}
          <div className="featured-section">
            <div className="featured-header">
              <div>
                <div className="section-eyebrow">Our Rooms</div>
                <h2 className="section-title">Featured <em>Suites</em></h2>
              </div>
              <a href="/rooms" className="view-all-link">
                Explore All Rooms &nbsp;→
              </a>
            </div>

            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.id} className="featured-room-card">

                  <div className="featured-room-image">
                    <img
                      className="room-photo"
                      src={ROOM_PHOTOS[room.type] || DEFAULT_ROOM_PHOTO}
                      alt={`${room.type} Room`}
                      loading="lazy"
                    />
                    <div className="room-photo-overlay" />
                    <span className={`featured-badge ${room.availability ? "available" : "unavailable"}`}>
                      {room.availability ? "Available" : "Booked"}
                    </span>
                    <span className="room-type-label">{room.type}</span>
                  </div>

                  <div className="featured-room-body">
                    <p className="room-price">
                      Ksh {Number(room.price).toLocaleString()}
                      <span>/ night</span>
                    </p>

                    <div className="room-specs">
                      <span className="room-spec-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {room.capacity} Guests
                      </span>
                      <span className="room-spec-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        All Amenities
                      </span>
                    </div>

                    <p className="room-amenities">{room.amenities}</p>

                    <button
                      className={`btn-room ${room.availability ? "available" : "unavailable"}`}
                      disabled={!room.availability}
                    >
                      <span>{room.availability ? "Reserve Room" : "Unavailable"}</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* ── Quick Actions ───────────────────────────────── */}
          <div className="quick-actions-section">
            <div className="section-eyebrow">Navigate</div>
            <h2 className="section-title">Quick <em>Actions</em></h2>

            <div className="actions-grid">

              <a href="/rooms" className="action-card">
                <div
                  className="action-photo"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=70&auto=format&fit=crop')",
                  }}
                />
                <div className="action-card-body">
                  <div className="action-icon-ring">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <h4>Browse Rooms</h4>
                  <p>Explore our full collection of rooms, suites, and amenities.</p>
                  <span className="action-arrow">Explore &nbsp;→</span>
                </div>
              </a>

              <a href="/bookings" className="action-card">
                <div
                  className="action-photo"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=70&auto=format&fit=crop')",
                  }}
                />
                <div className="action-card-body">
                  <div className="action-icon-ring">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <h4>My Bookings</h4>
                  <p>View and manage all your active reservations and history.</p>
                  <span className="action-arrow">View All &nbsp;→</span>
                </div>
              </a>

              <div className="action-card disabled">
                <div
                  className="action-photo"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=70&auto=format&fit=crop')",
                  }}
                />
                <div className="action-card-body">
                  <div className="action-icon-ring">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h4>Concierge Chat</h4>
                  <p>Live support from our hospitality team — coming soon.</p>
                  <span className="action-arrow" style={{ opacity: 0.4 }}>Coming Soon</span>
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