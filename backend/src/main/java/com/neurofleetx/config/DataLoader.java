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
        // Find existing users or create dummy ones if needed (assuming some exist from testing)
        // For safety, let's just add notifications to whoever we find
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
        });

        // Seed some schedules for a Driver if exists
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.DRIVER)
                .findFirst()
                .ifPresent(driver -> {
                    if (scheduleRepository.findByDriverOrderByStartTimeAsc(driver).isEmpty()) {
                        Optional<Vehicle> vehicle = vehicleRepository.findAll().stream().findFirst();
                        if (vehicle.isPresent()) {
                            scheduleRepository.save(Schedule.builder()
                                    .routeName("Downtown Hub Express")
                                    .origin("Hub Alpha")
                                    .destination("Sector 7 Depot")
                                    .startTime(LocalDateTime.now().plusHours(2))
                                    .endTime(LocalDateTime.now().plusHours(4))
                                    .status(Schedule.ScheduleStatus.PENDING)
                                    .driver(driver)
                                    .vehicle(vehicle.get())
                                    .build());
                        }
                    }
                });
    }
}
