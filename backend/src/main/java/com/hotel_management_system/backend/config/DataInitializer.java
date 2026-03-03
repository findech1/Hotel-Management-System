package com.hotel_management_system.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hotel_management_system.backend.entities.Room;
import com.hotel_management_system.backend.entities.User;
import com.hotel_management_system.backend.repositories.RoomRepository;
import com.hotel_management_system.backend.repositories.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default user if no users exist
        if (userRepository.count() == 0) {
            User user = new User();
            user.setUsername("admin");
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setRole("ADMIN");
            userRepository.save(user);

            User user2 = new User();
            user2.setUsername("user");
            user2.setPassword(passwordEncoder.encode("user123"));
            user2.setRole("CUSTOMER");
            userRepository.save(user2);

            System.out.println("Default users created!");
            System.out.println("Credentials:");
            System.out.println("  Admin: username=admin, password=admin123");
            System.out.println("  User: username=user, password=user123");
        }

        // Only add rooms if the database is empty
        if (roomRepository.count() == 0) {
            // Sample rooms
            Room room1 = new Room();
            room1.setType("Single");
            room1.setPrice(50.0);
            room1.setCapacity(1);
            room1.setAmenities("WiFi, Air Conditioning, TV");
            room1.setAvailability(true);
            roomRepository.save(room1);

            Room room2 = new Room();
            room2.setType("Double");
            room2.setPrice(80.0);
            room2.setCapacity(2);
            room2.setAmenities("WiFi, Air Conditioning, TV, Mini Bar");
            room2.setAvailability(true);
            roomRepository.save(room2);

            Room room3 = new Room();
            room3.setType("Suite");
            room3.setPrice(120.0);
            room3.setCapacity(4);
            room3.setAmenities("WiFi, Air Conditioning, TV, Mini Bar, Kitchen, Jacuzzi");
            room3.setAvailability(true);
            roomRepository.save(room3);

            Room room4 = new Room();
            room4.setType("Deluxe");
            room4.setPrice(150.0);
            room4.setCapacity(2);
            room4.setAmenities("WiFi, Air Conditioning, Smart TV, Wine Bar, Ocean View");
            room4.setAvailability(true);
            roomRepository.save(room4);

            Room room5 = new Room();
            room5.setType("Family");
            room5.setPrice(100.0);
            room5.setCapacity(5);
            room5.setAmenities("WiFi, Air Conditioning, TV, Large Kitchen, Multiple Bathrooms");
            room5.setAvailability(true);
            roomRepository.save(room5);

            System.out.println("Sample rooms added to the database!");
        }
    }
}
