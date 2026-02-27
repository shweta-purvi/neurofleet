package com.neurofleetx.controller;

import com.neurofleetx.model.Schedule;
import com.neurofleetx.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ScheduleController {
    private final ScheduleService scheduleService;

    @GetMapping("/my")
    public ResponseEntity<List<Schedule>> getMySchedules() {
        return ResponseEntity.ok(scheduleService.getMySchedules());
    }

    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }
}
