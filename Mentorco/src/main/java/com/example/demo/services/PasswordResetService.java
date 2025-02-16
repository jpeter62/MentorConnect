package com.example.demo.services;

import com.example.demo.model.PasswordResetToken;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.repository.PasswordResetTokenRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    public PasswordResetToken createTokenForUser(String email, String token) {
        Optional<Student> student = studentRepository.findByEmail(email);
        Optional<Teacher> teacher = teacherRepository.findByEmail(email);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);

        if (student.isPresent()) {
            resetToken.setStudent(student.get());
        } else if (teacher.isPresent()) {
            resetToken.setTeacher(teacher.get());
        } else {
            throw new IllegalArgumentException("No user found with email: " + email);
        }

        return passwordResetTokenRepository.save(resetToken);
    }
}
