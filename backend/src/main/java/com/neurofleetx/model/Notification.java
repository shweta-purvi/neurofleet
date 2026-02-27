package com.neurofleetx.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    
    @Enumerated(EnumType.STRING)
    private NotificationType type; // ALERT, SUCCESS, INFO

    private LocalDateTime timestamp;
    private boolean isRead;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public enum NotificationType {
        ALERT, SUCCESS, INFO
    }
}
