package com.example.demo.controller;

import com.example.demo.model.PasswordResetToken;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.TeacherRepository;
import com.example.demo.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.MessagingException;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    // POST method to handle forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // Check if the email belongs to a Student or Teacher
        Optional<Student> student = studentRepository.findByEmail(email);
        Optional<Teacher> teacher = teacherRepository.findByEmail(email);

        if (student.isEmpty() && teacher.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No user found with this email.");
        }

        // Generate a unique token
        String token = UUID.randomUUID().toString();

        // Create a PasswordResetToken and link it to the correct user
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);

        if (student.isPresent()) {
            resetToken.setStudent(student.get());
        } else if (teacher.isPresent()) {
            resetToken.setTeacher(teacher.get());
        }

        tokenRepository.save(resetToken);

        // Construct the reset link (or token) that will be sent in the email
        String resetLink = "http://localhost:3000/reset-password/" + token;
        String subject = "Password Reset Request";
        String body = "Click the link to reset your password: " + resetLink;

        // Send the email with the reset link
        try {
            emailService.sendEmail(email, subject, body);
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending reset email.");
        }

        return ResponseEntity.ok("Password reset link sent to your email.");
    }
}
