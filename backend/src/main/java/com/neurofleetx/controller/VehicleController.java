package com.neurofleetx.controller;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleRepository repository;

    @GetMapping
    public List<Vehicle> getAllVehicles() {
        return repository.findAll();
    }

    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return repository.save(vehicle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicleDetails) {
        return repository.findById(id)
                .map(vehicle -> {
                    vehicle.setStatus(vehicleDetails.getStatus());
                    vehicle.setBatteryPercentage(vehicleDetails.getBatteryPercentage());
                    vehicle.setFuelLevel(vehicleDetails.getFuelLevel());
                    vehicle.setLatitude(vehicleDetails.getLatitude());
                    vehicle.setLongitude(vehicleDetails.getLongitude());
                    vehicle.setSpeed(vehicleDetails.getSpeed());
                    return ResponseEntity.ok(repository.save(vehicle));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
