package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Feedback;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByStudent(Student student);
    List<Feedback> findByTeacher(Teacher teacher);
}
