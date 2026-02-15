package com.neurofleetx.controller;

import com.neurofleetx.model.MaintenanceRecord;
import com.neurofleetx.repository.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceRepository repository;

    @GetMapping
    public List<MaintenanceRecord> getAllRecords() {
        return repository.findAll();
    }

    @PostMapping
    public MaintenanceRecord addRecord(@RequestBody MaintenanceRecord record) {
        return repository.save(record);
    }
}
