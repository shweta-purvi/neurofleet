package com.neurofleetx.controller;

import com.neurofleetx.model.Booking;
import com.neurofleetx.model.Vehicle;
import com.neurofleetx.repository.BookingRepository;
import com.neurofleetx.repository.UserRepository;
import com.neurofleetx.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository repository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    @GetMapping
    public List<Booking> getAllBookings() {
        return repository.findAll();
    }

    @GetMapping("/my")
    public List<Booking> getMyBookings(Authentication authentication) {
        var user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        return repository.findByUser(user);
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking, Authentication authentication) {
        var user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        if (booking.getVehicle() != null) {
            Long vehicleId = booking.getVehicle().getId();
            if (vehicleId != null) {
                var vehicle = vehicleRepository.findById(vehicleId).orElseThrow();
                vehicle.setStatus(Vehicle.VehicleStatus.IN_USE);
                vehicleRepository.save(vehicle);
                booking.setVehicle(vehicle);
            }
        }
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking.setUser(user);
        return repository.save(booking);
    }
}
