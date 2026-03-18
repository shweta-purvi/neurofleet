package com.neurofleetx.repository;

import com.neurofleetx.model.AIInsightAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIInsightActionRepository extends JpaRepository<AIInsightAction, Long> {
}
