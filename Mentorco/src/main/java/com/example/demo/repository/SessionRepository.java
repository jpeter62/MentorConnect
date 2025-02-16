package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByStudentId(Long studentId);
    List<Session> findByTeacherId(Long teacherId);
    List<Session> findByTeacherIdAndStatus(Long teacherId, String status);
    
}