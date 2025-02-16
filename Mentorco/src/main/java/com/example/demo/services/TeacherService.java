package com.example.demo.services;



import com.example.demo.model.Teacher;
import com.example.exceptions.ResourceNotFoundException; //

import com.example.demo.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
   


    // Save or register a teacher
    public void saveTeacher(Teacher teacher) {
        // Encrypt the password before saving
        teacher.setPassword(encryptPassword(teacher.getPassword()));
        teacherRepository.save(teacher);
        
    }
    public Long getTeacherIdByEmail(String email) {
        Optional<Teacher> teacher = teacherRepository.findByEmail(email);
        return teacher.map(Teacher::getId).orElse(null);  // Return the ID if present, else return null
    }
    public Teacher getTeacherById(Long teacherId) {
        return teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
    }

    private String encryptPassword(String password) {
        return passwordEncoder.encode(password);
    }

    // Authenticate user by email and password
    public boolean authenticateUser(String email, String password) {
        Optional<Teacher> teacherOptional = teacherRepository.findByEmail(email);

        if (teacherOptional.isPresent()) {
            Teacher teacher = teacherOptional.get();
            // Compare the hashed password with the provided password
            return passwordEncoder.matches(password, teacher.getPassword());
        }

        return false; // User not found or incorrect credentials
    }
    public Teacher getTeacherDetailsByEmail(String email) {
        return teacherRepository.findByEmail(email).orElse(null);
    }

    // Check if an email is available
    public boolean isEmailAvailable(String email) {
        return !teacherRepository.existsByEmail(email);
    }

    // Get all teachers
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
        
    }
    public Teacher getTeacherByEmail1(String email) {
        Optional<Teacher> teacher = teacherRepository.findByEmail(email);
        return teacher.orElse(null);
    }


    // Get a teacher by email
    public Optional<Teacher> getTeacherByEmail(String email) {
        return teacherRepository.findByEmail(email);
    }
    public Teacher updateTeacher(Long id, Teacher updates) {
        return teacherRepository.findById(id)
            .map(teacher -> {
                teacher.setName(updates.getName());
                teacher.setEmail(updates.getEmail());
                teacher.setPhone(updates.getPhone());
                teacher.setDepartment(updates.getDepartment());
                teacher.setExpertise(updates.getExpertise());
                teacher.setExperience(updates.getExperience());
                return teacherRepository.save(teacher);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
    }

    // Update a teacher's details

    // Delete a teacher
    public boolean deleteTeacher(Long id) {
        if (teacherRepository.existsById(id)) {
            teacherRepository.deleteById(id);
            return true;
        }
        return false;
    }
 // In TeacherService.java
    public Teacher updateStatus(Long id, String status) {
        if (status == null || (!status.equalsIgnoreCase("active") && !status.equalsIgnoreCase("blocked"))) {
            throw new IllegalArgumentException("Invalid status value. Must be 'active' or 'blocked'.");
        }

        Optional<Teacher> teacherOptional = teacherRepository.findById(id);
        if (teacherOptional.isPresent()) {
            Teacher teacher = teacherOptional.get();
            teacher.setStatus(status); // Update the status
            return teacherRepository.save(teacher); // Save and return the updated teacher
        } else {
            throw new ResourceNotFoundException("Teacher not found");
        }
    }


}
