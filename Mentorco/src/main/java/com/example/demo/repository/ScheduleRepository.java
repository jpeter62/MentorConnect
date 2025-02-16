package com.example.demo.repository;

import com.example.demo.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    // Fetch all schedules for a given teacher
    List<Schedule> findByTeacherId(Long teacherId);

    List<Schedule> findByTeacherIdAndDateAndAvailableTrue(Long teacherId, LocalDate date);

    List<Schedule> findByTeacherIdAndDate(Long teacherId, LocalDate date);
}
