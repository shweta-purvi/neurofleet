package com.neurofleetx.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String licensePlate;
    private String model;
    private String type; // EV, SUV, Sedan, etc.

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    private Double batteryPercentage;
    private Double fuelLevel;
    private Double latitude;
    private Double longitude;
    private Double speed;

    public enum VehicleStatus {
        AVAILABLE,
        IN_USE,
        MAINTENANCE,
        CRITICAL
    }
}
