package com.example.demo.controller;


import com.example.demo.model.Teacher;
import com.example.demo.repository.TeacherRepository;
import com.example.demo.services.TeacherService;
import com.example.exceptions.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private TeacherRepository teacherRepository;


    // Register a new teacher
    @PostMapping("/register")
    public ResponseEntity<String> registerTeacher(@RequestBody Teacher teacher) {
        if (teacherService.isEmailAvailable(teacher.getEmail())) {
            teacherService.saveTeacher(teacher);
            return ResponseEntity.ok("Registration successful");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already in use");
        }
    }
    @PutMapping("/details/{email}")
    public ResponseEntity<String> updateTeacherDetails(@PathVariable String email, @RequestBody Teacher updatedTeacher) {
        Teacher existingTeacher = teacherService.getTeacherByEmail1(email);

        if (existingTeacher != null) {
            // Update the teacher's details
            existingTeacher.setName(updatedTeacher.getName());
            existingTeacher.setPhone(updatedTeacher.getPhone());
            existingTeacher.setTeachingId(updatedTeacher.getTeachingId());
            existingTeacher.setDepartment(updatedTeacher.getDepartment());
            existingTeacher.setExpertise(updatedTeacher.getExpertise());
            existingTeacher.setExperience(updatedTeacher.getExperience());

            // Save the updated teacher details
            teacherService.saveTeacher(existingTeacher);

            return ResponseEntity.ok("Profile updated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Teacher not found.");
        }
    }


    // Check if an email is available
    @PostMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean isAvailable = teacherService.isEmailAvailable(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isAvailable", isAvailable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/details/{email}")
    public ResponseEntity<Map<String, Object>> getTeacherDetailsByEmail(@PathVariable String email) {
        Teacher teacher = teacherService.getTeacherDetailsByEmail(email);
        
        if (teacher != null) {
            // Return the relevant fields for the teacher
            Map<String, Object> response = Map.of(
                "name", teacher.getName(),
                "email", teacher.getEmail(),
                "phone", teacher.getPhone(),
                "teachingId", teacher.getTeachingId(),
                "department", teacher.getDepartment(),
                "expertise", teacher.getExpertise(),
                "experience", teacher.getExperience()
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

// Teacher Login
 // In TeacherController.java
 // In TeacherController.java
 // In TeacherController.java
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginDetails) {
        Map<String, Object> response = new HashMap<>();
        String email = loginDetails.get("email");
        String password = loginDetails.get("password");

        Optional<Teacher> teacherOptional = teacherService.getTeacherByEmail(email);

        if (teacherOptional.isPresent()) {
            Teacher teacher = teacherOptional.get();
            
            // Check if user is blocked
            if ("blocked".equals(teacher.getStatus())) {
                response.put("success", false);
                response.put("message", "Your account has been blocked. Please contact the administrator.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            
            if (passwordEncoder.matches(password, teacher.getPassword())) {
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("userType", "teacher");
                response.put("teacherId", teacher.getId());
                response.put("teacherName", teacher.getName());
                response.put("status", teacher.getStatus());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } else {
            response.put("success", false);
            response.put("message", "Teacher not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }


    
    @GetMapping("/{teacherId}")
    public ResponseEntity<Teacher> getTeacherDetails(@PathVariable Long teacherId) {
        try {
            Teacher teacher = teacherRepository.findById(teacherId)
                                               .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
            return ResponseEntity.ok(teacher);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    

    @GetMapping("/name/{email}")
    public ResponseEntity<Map<String, String>> getTeacherNameByEmail(@PathVariable String email) {
        Optional<Teacher> teacherOptional = teacherService.getTeacherByEmail(email);
        if (teacherOptional.isPresent()) {
            Teacher teacher = teacherOptional.get();
            Map<String, String> response = new HashMap<>();
            response.put("name", teacher.getName());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }



    // Get all teachers
    @GetMapping
    public List<Teacher> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    // Get a teacher by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<Teacher> getTeacherByEmail(@PathVariable String email) {
        return teacherService.getTeacherByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
    @GetMapping("/teachers/id-by-email")
    public ResponseEntity<Long> getTeacherIdByEmail(@RequestParam String email) {
        try {
            Long teacherId = teacherService.getTeacherIdByEmail(email);
            return ResponseEntity.ok(teacherId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
   



    // Update teacher details
    @PutMapping("/{id}")
    public Teacher updateTeacher(@PathVariable Long id, @RequestBody Teacher updatedTeacher) {
        return teacherService.updateTeacher(id, updatedTeacher);
                
    }
  

    // Delete a teacher
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        if (teacherService.deleteTeacher(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
