package com.neurofleetx.service;

import com.neurofleetx.model.Schedule;
import com.neurofleetx.model.User;
import com.neurofleetx.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final UserService userService;

    public List<Schedule> getMySchedules() {
        User driver = userService.getCurrentUser();
        return scheduleRepository.findByDriverOrderByStartTimeAsc(driver);
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
}
