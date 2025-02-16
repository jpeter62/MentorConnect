package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Feedback;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.services.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackService.saveFeedback(feedback);
        return ResponseEntity.ok(savedFeedback);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Feedback>> getFeedbackByStudent(@PathVariable Long studentId) {
        Student student = new Student(); // Assuming Student object is fetched elsewhere
        student.setId(studentId);
        List<Feedback> feedbackList = feedbackService.getFeedbackByStudent(student);
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Feedback>> getFeedbackByTeacher(@PathVariable Long teacherId) {
        Teacher teacher = new Teacher(); // Assuming Teacher object is fetched elsewhere
        teacher.setId(teacherId);
        List<Feedback> feedbackList = feedbackService.getFeedbackByTeacher(teacher);
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }
}
