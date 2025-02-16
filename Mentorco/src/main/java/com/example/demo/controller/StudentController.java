package com.example.demo.controller;


import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import com.example.demo.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
public class StudentController {
	 
    @Autowired
    private StudentService studentService;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @GetMapping("/name/{email}")
    public ResponseEntity<Map<String, String>> getStudentNameByEmail(@PathVariable String email) {
        Optional<Student> studentOptional = studentService.getStudentByEmail(email);
        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            Map<String, String> response = new HashMap<>();
            response.put("name", student.getName());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    @GetMapping("/details/{email}")
    public ResponseEntity<Map<String, Object>> getStudentDetailsByEmail(@PathVariable String email) {
        Student student = studentService.getStudentDetailsByEmail(email);
        
        if (student != null) {
            // Exclude the institution field when returning the student data
            Map<String, Object> response = Map.of(
                "name", student.getName(),
                "email", student.getEmail(),
                "phone", student.getPhone(),
                "course", student.getCourse(),
                "year", student.getYearOfStudy(),
                "interests", student.getFieldOfInterest()
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    // Register a new student
    @PostMapping("/register")
    public ResponseEntity<String> registerStudent(@RequestBody Student student) {
        if (studentService.isEmailAvailable(student.getEmail())) {
            studentService.saveStudent(student);
            return ResponseEntity.ok("Registration successful");
        } else {
            return ResponseEntity.badRequest().body("Email is already in use");
        }
    }
 // StudentController.java
    @GetMapping("/getStudentIdByEmail1")
    public ResponseEntity<Long> getStudentIdByEmail1(@RequestParam String email) {
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(student.getId());
    }


    // Check if an email is available
    @PostMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean isAvailable = studentService.isEmailAvailable(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("isAvailable", isAvailable);
        return ResponseEntity.ok(response);
    }

    // Login a student
 // Login a student
 // In StudentController.java
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginDetails) {
        Map<String, Object> response = new HashMap<>();
        String email = loginDetails.get("email");
        String password = loginDetails.get("password");

        Optional<Student> studentOptional = studentService.getStudentByEmail(email);

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            
            // Check if student is blocked
            if ("blocked".equals(student.getStatus())) {
                response.put("success", false);
                response.put("message", "Your account has been blocked. Please contact administrator.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            
            if (passwordEncoder.matches(password, student.getPassword())) {
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("userType", "student");
                response.put("studentId", student.getId());
                response.put("studentName", student.getName());
                response.put("status", student.getStatus());
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } else {
            response.put("success", false);
            response.put("message", "Student not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }


    // Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // Get a student by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(@PathVariable String email) {
        Optional<Student> studentOptional = studentService.getStudentByEmail(email);

        if (studentOptional.isPresent()) {
            return ResponseEntity.ok(studentOptional.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404 if student not found
        }
    }

    @GetMapping("/id-by-email")
    public ResponseEntity<Map<String, Long>> getStudentIdByEmail(@RequestParam String email) {
        Long studentId = studentService.getStudentIdByEmail(email);
        if (studentId != null) {
            Map<String, Long> response = new HashMap<>();
            response.put("id", studentId);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
   
    

    // Update student details
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
        return studentService.updateStudent(id, updatedStudent);
    }

    // Delete a student
    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }
}
