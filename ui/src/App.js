import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import RoomList from "./components/Rooms/RoomList";
import BookingList from "./components/Bookings/BookingList";
import Navbar from "./components/Navbar/Navbar";

const ProtectedRoute = ({ element, isLoggedIn }) => {
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute element={<Dashboard />} isLoggedIn={isLoggedIn} />
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Navbar />
                    <div className="container-large">
                      <RoomList />
                    </div>
                  </>
                }
                isLoggedIn={isLoggedIn}
              />
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Navbar />
                    <div className="container-large">
                      <BookingList />
                    </div>
                  </>
                }
                isLoggedIn={isLoggedIn}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
