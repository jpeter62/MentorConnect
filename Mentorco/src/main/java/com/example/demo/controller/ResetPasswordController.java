package com.example.demo.controller;

import com.example.demo.model.PasswordResetToken;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class ResetPasswordController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Add PasswordEncoder for hashing

    // Step 2: Reset Password using token
    @PutMapping("/reset-password/{token}")
    public ResponseEntity<?> resetPassword(@PathVariable String token, @RequestBody Map<String, String> request) {
        String newPassword = request.get("password");

        // Validate the token
        Optional<PasswordResetToken> resetToken = tokenRepository.findByToken(token);
        if (resetToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }

        PasswordResetToken tokenDetails = resetToken.get();

        // Hash the new password
        String hashedPassword = passwordEncoder.encode(newPassword);

        // Reset password for the associated user
        if (tokenDetails.getStudent() != null) {
            Student student = tokenDetails.getStudent();
            student.setPassword(hashedPassword); // Set the hashed password
            studentRepository.save(student);
        } else if (tokenDetails.getTeacher() != null) {
            Teacher teacher = tokenDetails.getTeacher();
            teacher.setPassword(hashedPassword); // Set the hashed password
            teacherRepository.save(teacher);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No user associated with this token.");
        }

        // Delete the token after use
        tokenRepository.delete(tokenDetails);

        return ResponseEntity.ok("Password has been reset successfully.");
    }
}
