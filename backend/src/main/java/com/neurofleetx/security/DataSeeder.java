package com.neurofleetx.security;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (vehicleRepository.count() == 0) {
            Vehicle v1 = Vehicle.builder()
                .model("Tesla Model 3")
                .licensePlate("CA-9921")
                .status(Vehicle.VehicleStatus.AVAILABLE)
                .type("EV")
                .batteryPercentage(85.0)
                .latitude(37.7749)
                .longitude(-122.4194)
                .speed(0.0)
                .build();
            vehicleRepository.save(v1);

            Vehicle v2 = Vehicle.builder()
                .model("Ford F-150 Lightning")
                .licensePlate("TX-4402")
                .status(Vehicle.VehicleStatus.IN_USE)
                .type("EV")
                .batteryPercentage(42.0)
                .latitude(37.7849)
                .longitude(-122.4294)
                .speed(65.0)
                .build();
            vehicleRepository.save(v2);

            Vehicle v3 = Vehicle.builder()
                .model("Rivian R1S")
                .licensePlate("NY-1288")
                .status(Vehicle.VehicleStatus.MAINTENANCE)
                .type("EV")
                .batteryPercentage(12.0)
                .latitude(37.7649)
                .longitude(-122.4394)
                .speed(0.0)
                .build();
            vehicleRepository.save(v3);
        }
    }
}
