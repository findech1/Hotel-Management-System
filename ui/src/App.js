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
import RoomList from "./components/Rooms/RoomList";
import BookingForm from "./components/Bookings/BookingForm";

const ProtectedRoute = ({ element, isLoggedIn }) => {
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/rooms" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/rooms"
              element={
                <ProtectedRoute
                  element={<RoomList />}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute
                  element={<BookingForm />}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
