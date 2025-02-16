package com.example.demo.repository;

import com.example.demo.model.MentorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MentorAvailabilityRepository extends JpaRepository<MentorAvailability, Long> {
    List<MentorAvailability> findByTeacherId(Long teacherId);
    List<MentorAvailability> findByTeacherIdAndDate(Long teacherId, LocalDate date);
}
