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
@Table(name = "maintenance_records")
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    private String issue;
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status;

    private String description;

    public enum MaintenanceStatus {
        PENDING,
        IN_PROGRESS,
        RESOLVED,
        CRITICAL
    }
}
