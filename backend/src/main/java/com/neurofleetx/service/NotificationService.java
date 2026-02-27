package com.neurofleetx.service;

import com.neurofleetx.model.Notification;
import com.neurofleetx.model.User;
import com.neurofleetx.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public List<Notification> getMyNotifications() {
        User user = userService.getCurrentUser();
        return notificationRepository.findByUserOrderByTimestampDesc(user);
    }

    public Notification markAsRead(Long id) {
        if (id == null) return null;
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}
