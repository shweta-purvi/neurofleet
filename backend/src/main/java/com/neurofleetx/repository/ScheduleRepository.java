package com.neurofleetx.repository;

import com.neurofleetx.model.Schedule;
import com.neurofleetx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByDriverOrderByStartTimeAsc(User driver);
}
