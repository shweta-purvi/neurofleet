package com.neurofleetx.config;

import com.neurofleetx.model.*;
import com.neurofleetx.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import java.time.LocalDateTime;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final ScheduleRepository scheduleRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Ensure specific AI Vehicles are seeded with telemetry
        upsertVehicle("CYB-99-NRF", "Cyber Bus Elite 500", "EV BUS", 88.0, 1200.0, 32.0, 0.98, "Sunny", 28, "Highway", 98.5, 2.4, 12);
        upsertVehicle("NS-88-FLT", "Neuro Sedan S-1", "SEDAN", 42.0, 450.0, 30.0, 0.85, "Rainy", 65, "City road", 92.0, 5.8, 2);
        upsertVehicle("EV-8842", "Tesla Model S Plaid", "LUXURY SEDAN", 92.0, 400.0, 35.0, 0.99, "Clear", 15, "Highway", 99.0, 1.2, 1);
        upsertVehicle("EV-3921", "Rivian R1T", "PREMIUM TRUCK", 85.0, 1500.0, 40.0, 0.95, "Sunny", 40, "Off-road", 94.0, 3.5, 2);
        upsertVehicle("EV-1109", "Polestar 2", "HATCHBACK", 78.0, 300.0, 32.0, 0.92, "Cloudy", 80, "City road", 90.0, 4.1, 1);
        upsertVehicle("EV-5541", "Lucid Air", "LUXURY SEDAN", 95.0, 450.0, 34.0, 0.99, "Clear", 20, "Highway", 98.0, 1.0, 1);
        upsertVehicle("EV-9993", "Porsche Taycan", "SPORTS SEDAN", 70.0, 420.0, 36.0, 0.97, "Sunny", 50, "Highway", 97.0, 2.0, 1);

        // Find existing users and seed notifications/schedules
        userRepository.findAll().forEach(user -> {
            if (notificationRepository.findByUserOrderByTimestampDesc(user).isEmpty()) {
                notificationRepository.save(Notification.builder()
                        .title("System Integration Successful")
                        .description("Welcome to the NeuroFleetX Control Interface.")
                        .type(Notification.NotificationType.SUCCESS)
                        .timestamp(LocalDateTime.now())
                        .isRead(false)
                        .user(user)
                        .build());
            }

            if (user.getRole() == Role.DRIVER) {
                if (scheduleRepository.findByDriverOrderByStartTimeAsc(user).isEmpty()) {
                    Optional<Vehicle> vehicle = vehicleRepository.findAll().stream().findFirst();
                    if (vehicle.isPresent()) {
                        scheduleRepository.save(Schedule.builder()
                                .routeName("Downtown Hub Express")
                                .origin("Hub Alpha")
                                .destination("Sector 7 Depot")
                                .startTime(LocalDateTime.now().plusHours(2))
                                .endTime(LocalDateTime.now().plusHours(4))
                                .status(Schedule.ScheduleStatus.PENDING)
                                .driver(user)
                                .vehicle(vehicle.get())
                                .build());
                    }
                }
            }
        });
    }

    private void upsertVehicle(String plate, String model, String type, Double battery, Double load, Double pressure, Double health, String weather, Integer traffic, String roadType, Double driverScore, Double idle, Integer passengers) {
        Vehicle v = vehicleRepository.findAll().stream()
                .filter(veh -> plate.equals(veh.getLicensePlate()))
                .findFirst()
                .orElse(new Vehicle());
        
        v.setLicensePlate(plate);
        v.setModel(model);
        v.setType(type);
        v.setBatteryPercentage(battery);
        v.setStatus(Vehicle.VehicleStatus.AVAILABLE);
        v.setLatitude(37.7749 + (Math.random() * 0.05));
        v.setLongitude(-122.4194 + (Math.random() * 0.05));
        v.setSpeed(40.0);
        v.setLoadWeight(load);
        v.setTirePressure(pressure);
        v.setEngineHealth(health);
        v.setCurrentWeather(weather);
        v.setTrafficDensity(traffic);
        v.setRoadType(roadType);
        v.setDriverPerformanceScore(driverScore);
        v.setIdleTime(idle);
        v.setPassengerCount(passengers);
        
        vehicleRepository.save(v);
    }
}
