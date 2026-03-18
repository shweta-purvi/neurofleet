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
    private Double loadWeight; // in kg
    private Double tirePressure; // in PSI
    private Double engineHealth; // 0.0 - 1.0
    private String currentWeather; // Sunny, Rainy, Stormy, etc.
    private Integer trafficDensity; // 0 - 100 percentage
    private String roadType; // Highway, City, Narrow road
    private Double driverPerformanceScore; // 0 - 100
    private Double idleTime; // in minutes
    private Integer passengerCount;

    public enum VehicleStatus {
        AVAILABLE,
        IN_USE,
        MAINTENANCE,
        CRITICAL
    }
}
