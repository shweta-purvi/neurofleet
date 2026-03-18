package com.neurofleetx.service;

import com.neurofleetx.model.Booking;
import com.neurofleetx.model.Vehicle;
import com.neurofleetx.repository.BookingRepository;
import com.neurofleetx.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleSimulationService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;

    // Run every 5 seconds to simulate movement
    @Scheduled(fixedRate = 5000)
    public void simulateMovement() {
        List<Booking> activeBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED)
                .toList();

        for (Booking booking : activeBookings) {
            Vehicle vehicle = booking.getVehicle();
            if (vehicle == null || booking.getPickupLat() == null) continue;

            double currentLat = vehicle.getLatitude();
            double currentLng = vehicle.getLongitude();
            double destLat = booking.getPickupLat();
            double destLng = booking.getPickupLng();

            // Calculate step (approx 0.002 degrees ~ 200m per 5 sec)
            double step = 0.002;
            double deltaLat = destLat - currentLat;
            double deltaLng = destLng - currentLng;
            double distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);

            if (distance < step) {
                // Arrived at pickup
                vehicle.setLatitude(destLat);
                vehicle.setLongitude(destLng);
                // In a real app we'd change status to 'ON_TRIP' but for demo we just keep it moving
            } else {
                double ratio = step / distance;
                vehicle.setLatitude(currentLat + deltaLat * ratio);
                vehicle.setLongitude(currentLng + deltaLng * ratio);
            }
            
            vehicleRepository.save(vehicle);
        }
    }
}
