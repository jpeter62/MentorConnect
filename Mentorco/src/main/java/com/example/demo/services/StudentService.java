package com.example.demo.services;



import com.example.demo.model.Student;
import com.example.exceptions.ResourceNotFoundException; // Replace with your actual package

import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    


    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
    public Student getStudentDetailsByEmail(String email) {
        // Fetch the student by email from the repository
        Optional<Student> studentOptional = studentRepository.findByEmail(email);
        
        if (studentOptional.isPresent()) {
            return studentOptional.get(); // Return the student object
        } else {
            return null; // No student found
        }
    }
    public Long getStudentIdByEmail(String email) {
        Optional<Student> student = studentRepository.findByEmail(email);
        return student.map(Student::getId).orElse(null);
    }

    // Save or register a student
    public void saveStudent(Student student) {
        // Perform any additional logic, e.g., password encryption
        student.setPassword(encryptPassword(student.getPassword()));
        studentRepository.save(student);
    }

    private String encryptPassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }
    public boolean authenticateUser(String email, String password) {
        Optional<Student> studentOptional = studentRepository.findByEmail(email);

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            // Compare the hashed password with the provided password
            return passwordEncoder.matches(password, student.getPassword());
        }

        return false; // User not found or incorrect credentials
    }

    


    public boolean isEmailAvailable(String email) {
        return !studentRepository.existsByEmail(email);
    }
    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get a student by email
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public Student updateStudent(Long id, Student updates) {
        return studentRepository.findById(id)
            .map(student -> {
                student.setName(updates.getName());
                student.setEmail(updates.getEmail());
                student.setPhone(updates.getPhone());
                student.setRollNo(updates.getRollNo());
                student.setCourse(updates.getCourse());
                student.setYearOfStudy(updates.getYearOfStudy());
                student.setFieldOfInterest(updates.getFieldOfInterest());
                return studentRepository.save(student);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }
    

    // Delete a student
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    public Student updateStatus(Long id, String status) {
    if (status == null || (!status.equalsIgnoreCase("active") && !status.equalsIgnoreCase("blocked"))) {
        throw new IllegalArgumentException("Invalid status value. Must be 'active' or 'blocked'.");
    }

    Optional<Student> studentOptional = studentRepository.findById(id);
    if (studentOptional.isPresent()) {
        Student student = studentOptional.get();
        student.setStatus(status); // Update the status
        return studentRepository.save(student); // Save and return the updated student
    } else {
        throw new ResourceNotFoundException("Student not found");
    }
}


}
