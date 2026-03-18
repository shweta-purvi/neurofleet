package com.neurofleetx.controller;

import com.neurofleetx.model.Booking;
import com.neurofleetx.model.Message;
import com.neurofleetx.repository.BookingRepository;
import com.neurofleetx.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {

    private final MessageRepository messageRepository;
    private final BookingRepository bookingRepository;

    @GetMapping("/{bookingId}")
    public List<Message> getMessages(@PathVariable Long bookingId) {
        if (bookingId == null) return java.util.Collections.emptyList();
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        return messageRepository.findByBookingOrderByTimestampAsc(booking);
    }

    @PostMapping("/{bookingId}")
    public Message sendMessage(@PathVariable Long bookingId, @RequestBody Message msg) {
        if (bookingId == null || msg == null) return null;
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        msg.setBooking(booking);
        msg.setTimestamp(LocalDateTime.now());
        Message saved = messageRepository.save(msg);

        // Responsive Dummy Reply Logic based on User Input
        if ("user".equals(msg.getSender())) {
            String userText = msg.getText() != null ? msg.getText().toLowerCase() : "";
            String replyText = "Acknowledged. I'm navigating towards your pickup point now.";

            if (userText.contains("where") || userText.contains("location")) {
                replyText = "I'm about 500 meters away, currently passing the main junction. See you in a few minutes!";
            } else if (userText.contains("late") || userText.contains("hurry") || userText.contains("fast")) {
                replyText = "I understand you're in a hurry. I've optimized my route to bypass the current congestion. Moving as fast as safely possible!";
            } else if (userText.contains("hi") || userText.contains("hello")) {
                replyText = "Hello! I'm your assigned driver for this trip. I'm en route to pick you up.";
            } else if (userText.contains("reach") || userText.contains("time")) {
                replyText = "Based on current traffic, I should reach your location in approximately 3 to 4 minutes.";
            } else if (userText.contains("number") || userText.contains("call")) {
                replyText = "You can contact me via the system dispatch if needed, but I have your exact GPS coordinates.";
            }

            Message reply = Message.builder()
                .booking(booking)
                .sender("driver")
                .text(replyText)
                .timestamp(LocalDateTime.now().plusSeconds(1))
                .build();
            messageRepository.save(reply);
        }

        return saved;
    }
}
