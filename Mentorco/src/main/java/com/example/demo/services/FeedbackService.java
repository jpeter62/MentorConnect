package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Feedback;
import com.example.demo.model.Session;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.repository.FeedbackRepository;
import com.example.demo.repository.SessionRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.TeacherRepository;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;
    private SessionRepository  sessionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public Feedback saveFeedback(Feedback feedback) {
        // Fetch associated entities to ensure they exist
        Student student = feedback.getStudent() != null ? 
            studentRepository.findById(feedback.getStudent().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid student ID")) : null;

        Teacher teacher = feedback.getTeacher() != null ? 
            teacherRepository.findById(feedback.getTeacher().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid teacher ID")) : null;

        Session session = feedback.getSession() != null ? 
            sessionRepository.findById(feedback.getSession().getId())
            .orElseThrow(() -> new IllegalArgumentException("Invalid session ID")) : null;

        // Set resolved entities
        feedback.setStudent(student);
        feedback.setTeacher(teacher);
        feedback.setSession(session);
        feedback.setCreatedAt(LocalDateTime.now());

        // Save feedback
        return feedbackRepository.save(feedback);
    }


    public List<Feedback> getFeedbackByStudent(Student student) {
        return feedbackRepository.findByStudent(student);
    }

    public List<Feedback> getFeedbackByTeacher(Teacher teacher) {
        return feedbackRepository.findByTeacher(teacher);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
