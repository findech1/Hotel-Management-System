package com.hotel_management_system.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.hotel_management_system.backend.entities.Booking;
import com.hotel_management_system.backend.entities.Room;
import com.hotel_management_system.backend.entities.User;
import com.hotel_management_system.backend.repositories.BookingRepository;
import com.hotel_management_system.backend.repositories.RoomRepository;
import com.hotel_management_system.backend.repositories.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        try {
            // Get the current user from authentication
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByUsername(authentication.getName()).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().build();
            }

            booking.setUser(user);
            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userRepository.findByUsername(authentication.getName()).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().build();
            }

            List<Booking> bookings = bookingRepository.findByUserId(user.getId());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking booking) {
        return bookingRepository.findById(id)
                .map(existingBooking -> {
                    existingBooking.setStatus(booking.getStatus());
                    existingBooking.setStartDate(booking.getStartDate());
                    existingBooking.setEndDate(booking.getEndDate());
                    return ResponseEntity.ok(bookingRepository.save(existingBooking));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        if (bookingRepository.existsById(id)) {
            bookingRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
