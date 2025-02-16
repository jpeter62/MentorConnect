package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.services.StudentService;
import com.example.demo.services.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000") // Add this for development
public class AdminController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private TeacherService teacherService;
    
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        // Authenticate admin credentials
        if ("admin1@gmail.com".equals(credentials.get("email")) && 
            "admin1".equals(credentials.get("password"))) {
            
            // Create a token (you could use JWT or any other approach here)
            String token = "generated-jwt-token"; // Replace with actual JWT generation logic
            
            // Return token or session information
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            
            return ResponseEntity.ok(response); // Send token and success status
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Invalid credentials"));
    }

    // Get all students
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        try {
            List<Student> students = studentService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all teachers
    @GetMapping("/teachers")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        try {
            List<Teacher> teachers = teacherService.getAllTeachers();
            return ResponseEntity.ok(teachers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a student
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete a teacher
    @DeleteMapping("/teachers/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        try {
            teacherService.deleteTeacher(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update a student
    @PutMapping("/students/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student updatedStudent
    ) {
        try {
            Student student = studentService.updateStudent(id, updatedStudent);
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update a teacher
    @PutMapping("/teachers/{id}")
    public ResponseEntity<Teacher> updateTeacher(
            @PathVariable Long id,
            @RequestBody Teacher updatedTeacher
    ) {
        try {
        	Teacher teacher = teacherService.updateTeacher(id, updatedTeacher);
            return ResponseEntity.ok(teacher);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
 // Add status update endpoints
    @PutMapping("/students/{id}/status")
    public ResponseEntity<?> updateStudentStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> status
    ) {
        try {
            String newStatus = status.get("status");
            if (newStatus == null || (!newStatus.equals("active") && !newStatus.equals("blocked"))) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid status value. Must be 'active' or 'blocked'"));
            }
            
            Student student = studentService.updateStatus(id, newStatus);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Status updated successfully",
                "student", student
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/teachers/{id}/status")
    public ResponseEntity<?> updateTeacherStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> status
    ) {
        try {
            String newStatus = status.get("status");
            if (newStatus == null || (!newStatus.equals("active") && !newStatus.equals("blocked"))) {
                return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid status value. Must be 'active' or 'blocked'"));
            }
            
            Teacher teacher = teacherService.updateStatus(id, newStatus);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Status updated successfully",
                "teacher", teacher
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", e.getMessage()));
        }
    }


    // Add admin login endpoint
   

   
    

}