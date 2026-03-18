package com.neurofleetx.controller;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.model.AIInsightAction;
import com.neurofleetx.repository.VehicleRepository;
import com.neurofleetx.repository.AIInsightActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AIOptimizationController {

    private final VehicleRepository vehicleRepository;
    private final AIInsightActionRepository aiInsightActionRepository;

    @GetMapping("/optimize/{vehicleId}")
    public Map<String, Object> getOptimizationReport(@PathVariable Long vehicleId, @RequestParam(required = false, defaultValue = "all") String active) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow();
        
        if (active == null) active = "all";
        boolean isAll = active.isEmpty() || active.equalsIgnoreCase("all");
        
        Map<String, Object> report = new HashMap<>();
        
        // Simulating complex AI logic based on all requested parameters
        double baseEta = 42.5; // base minutes for typical trip
        
        // 1. Traffic Density Impact
        double trafficImpact = (isAll || active.contains("Current Traffic Density")) ? ((vehicle.getTrafficDensity() != null ? vehicle.getTrafficDensity() : 20) * 0.8) : 0;
        
        // 2. Load Weight Impact (Energy consumption/speed)
        double loadImpact = (isAll || active.contains("Load Weight")) ? ((vehicle.getLoadWeight() != null ? vehicle.getLoadWeight() : 200) * 0.015) : 0;
        
        // 3. Weather Conditions
        double weatherImpact = 0.0;
        String weather = vehicle.getCurrentWeather() != null ? vehicle.getCurrentWeather() : "Clear";
        if (isAll || active.contains("Weather Conditions")) {
            if (weather.contains("Rain") || weather.contains("Storm")) weatherImpact = 12.0;
            else if (weather.contains("Fog")) weatherImpact = 8.0;
        }
        
        // 4. Peak Hour Indicator (Simulated)
        int hour = LocalTime.now().getHour();
        boolean isPeak = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
        double peakImpact = (isAll || active.contains("Peak Hour Status")) ? (isPeak ? 15.0 : 0.0) : 0.0;
        
        // 5. Vehicle Health (Reduced efficiency if low health)
        double healthImpact = (isAll || active.contains("Vehicle Health Status")) ? ((1.0 - (vehicle.getEngineHealth() != null ? vehicle.getEngineHealth() : 1.0)) * 20.0) : 0;
        
        // 6. Road Type Impact
        String roadFactor = vehicle.getRoadType() != null ? vehicle.getRoadType() : "City road";
        double roadImpact = 0;
        if (isAll || active.contains("Road Type Impact")) {
            roadImpact = roadFactor.contains("Highway") ? -5.0 : roadFactor.contains("Narrow") ? 10.0 : 0.0;
        }
        
        double predictedEta = baseEta + trafficImpact + loadImpact + weatherImpact + peakImpact + healthImpact + roadImpact;
        
        report.put("predictedEta", String.format("%.1f mins", predictedEta));
        report.put("energyOptimization", "Dynamic Eco-V4.2 (Efficiency: " + (int)(98 - (loadImpact/2)) + "%)");
        report.put("riskFactor", (healthImpact > 5 || trafficImpact > 30 || weatherImpact > 10) ? "MODERATE" : "LOW");
        report.put("peakHourActive", isPeak);
        
        Map<String, Object> factors = new HashMap<>();
        if (isAll || active.contains("Current Traffic Density")) factors.put("currentTrafficDensity", (vehicle.getTrafficDensity() != null ? vehicle.getTrafficDensity() : 20) + "%");
        if (isAll || active.contains("Historical Traffic Data")) factors.put("historicalTrafficData", "Entropy Analysis: Stable (Rank 4/10)");
        if (isAll || active.contains("Road Type Impact")) factors.put("roadType", roadFactor);
        if (isAll || active.contains("Distance to Destination")) factors.put("distanceToDestination", "14.2 km");
        if (isAll || active.contains("Weather Conditions")) factors.put("weatherConditions", weather);
        if (isAll || active.contains("Peak Hour Status")) factors.put("peakHourStatus", isPeak ? "PEAK ACTIVE" : "NOMINAL");
        if (isAll || active.contains("Accident / Roadblock Data")) factors.put("accidentRoadblockData", "No active roadblocks in 5km radius");
        if (isAll || active.contains("Vehicle Speed Tracking")) factors.put("vehicleSpeed", (vehicle.getSpeed() != null ? vehicle.getSpeed() : 65.0) + " km/h");
        if (isAll || active.contains("Fuel / Battery Levels")) factors.put("fuelBatteryLevel", (vehicle.getBatteryPercentage() != null ? vehicle.getBatteryPercentage() : 75) + "% / " + (vehicle.getFuelLevel() != null ? vehicle.getFuelLevel() : 80) + "%");
        if (isAll || active.contains("Vehicle Health Status")) factors.put("vehicleHealthStatus", (int)((vehicle.getEngineHealth() != null ? vehicle.getEngineHealth() : 0.95) * 100) + "% (Optimal)");
        if (isAll || active.contains("Load Weight")) factors.put("loadWeightPassengerCount", (vehicle.getLoadWeight() != null ? vehicle.getLoadWeight() : 150) + " kg / " + (vehicle.getPassengerCount() != null ? vehicle.getPassengerCount() : 1) + " px");
        if (isAll || active.contains("Driver Performance Score")) factors.put("driverPerformanceScore", (vehicle.getDriverPerformanceScore() != null ? vehicle.getDriverPerformanceScore() : 98.0) + "/100 (Elite)");
        if (isAll || active.contains("Idle Time Monitoring")) factors.put("idleTime", (vehicle.getIdleTime() != null ? vehicle.getIdleTime() : 2.4) + " mins");
        if (isAll || active.contains("Trip Start Time Sync")) factors.put("tripStartTime", LocalTime.now().minusMinutes(12).toString().substring(0, 5));
        if (isAll || active.contains("Pickup–Drop Coordinates")) factors.put("pickupDropCoordinates", String.format("%.4f, %.4f -> 37.8000, -122.4500", vehicle.getLatitude(), vehicle.getLongitude()));
        if (isAll || active.contains("EV Charging Availability")) factors.put("chargingStationAvailability", "Active Node: Hub Gamma (3 slots free)");
        if (isAll || active.contains("Past Delivery Records")) factors.put("pastDeliveryRecords", "Avg completion: 18.2 mins (Route Sync Target: 17.5)");
        
        report.put("neuroFactors", factors);
        report.put("optimizationPrompt", "Analyze current traffic density, historical data, road type, distance, weather, peak hours, accident data, vehicle speed, battery/fuel levels, vehicle health, load/passenger count, driver performance, idle time, trip start time, pickup-drop coordinates, charging availability, and past records to provide a neuro-optimized ETA and route.");
        
        return report;
    }

    @GetMapping("/insight/generate")
    public Map<String, String> generateInsight(@RequestParam(required = false, defaultValue = "") String activeFactors) {
        String[] possibleInsights = {
            "Based on recent Historical Traffic Data, route 4A will experience severe congestion in 45 mins. Pre-routing 2 EVs to avoid delays.",
            "Weather Conditions indicate heavy rain approaching Hub Beta. Suggesting activation of 3 auxiliary EVs to cover increased ETA times.",
            "Vehicle Health Status shows EV-92 requires immediate predictive maintenance on battery cells. Rerouting to nearest service center.",
            "Load Weight monitoring suggests upcoming deliveries exceed optimal efficiency for Route C. Splitting load across 2 available EVs recommended.",
            "Current traffic density in the downtown sector suggests a 12% increase in travel demand over the next 2 hours. Rerouting 4 available EVs to Hub Alpha for preemptive coverage.",
            "Idle Time Monitoring detected 3 EVs at Hub Gamma inactive for over 40 mins. Reallocating to high-demand Zone 7.",
            "Peak Hour Status activated for Sector 9. Temporary surge pricing suggested to balance demand."
        };

        // Here we'd normally use the activeFactors to filter the insight logic
        // For now, we simulate AI by randomly picking a relevant insight based on factors
        String selectedInsight = possibleInsights[(int) (Math.random() * possibleInsights.length)];
        
        // If factors are very few, give a generic one
        if (activeFactors != null && activeFactors.split(",").length < 3 && !activeFactors.isEmpty()) {
            selectedInsight = "Limited data points active. Analyzing baseline parameters... Optimal fleet distribution maintained.";
        }

        Map<String, String> response = new HashMap<>();
        response.put("insight", selectedInsight);
        response.put("timestamp", LocalTime.now().toString());
        return response;
    }

    @PostMapping("/insight/action")
    public Map<String, Object> handleInsightAction(@RequestBody Map<String, String> payload) {
        String action = payload.get("action"); // "APPROVE" or "DISMISS"
        String insight = payload.get("insight");

        // Save this action to the database to be visible in MySQL Workbench
        AIInsightAction savedAction = AIInsightAction.builder()
                .actionTaken(action)
                .insightText(insight)
                .timestamp(LocalDateTime.now())
                .build();
        aiInsightActionRepository.save(savedAction);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Action " + action + " saved to MySQL database successfully.");
        response.put("actionApplied", action.equals("APPROVE"));
        return response;
    }
}
