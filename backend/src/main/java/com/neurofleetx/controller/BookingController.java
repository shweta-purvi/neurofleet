package com.neurofleetx.controller;

import com.neurofleetx.model.Booking;
import com.neurofleetx.repository.BookingRepository;
import com.neurofleetx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingRepository repository;
    private final UserRepository userRepository;

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
        booking.setUser(user);
        return repository.save(booking);
    }
}
