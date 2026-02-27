package com.neurofleetx.repository;

import com.neurofleetx.model.Notification;
import com.neurofleetx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByTimestampDesc(User user);
}
