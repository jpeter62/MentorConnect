package com.example.demo.services;

import com.example.demo.model.Admin;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.TeacherRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private TeacherRepository teacherRepository;

    // Admin methods
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    // Student update methods
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existingStudent = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        // Update fields
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setEmail(updatedStudent.getEmail());
        existingStudent.setPhone(updatedStudent.getPhone());
        existingStudent.setRollNo(updatedStudent.getRollNo());
        existingStudent.setCourse(updatedStudent.getCourse());
        existingStudent.setYearOfStudy(updatedStudent.getYearOfStudy());
        existingStudent.setFieldOfInterest(updatedStudent.getFieldOfInterest());

        return studentRepository.save(existingStudent);
    }

    // Student status update
    public Student updateStudentStatus(Long id, String status) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        student.setStatus(status);
        return studentRepository.save(student);
    }

    // Teacher/Mentor update methods
    public Teacher updateTeacher(Long id, Teacher updatedTeacher) {
        Teacher existingTeacher = teacherRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Update fields
        existingTeacher.setName(updatedTeacher.getName());
        existingTeacher.setEmail(updatedTeacher.getEmail());
        existingTeacher.setPhone(updatedTeacher.getPhone());
        existingTeacher.setTeachingId(updatedTeacher.getTeachingId());
        existingTeacher.setDepartment(updatedTeacher.getDepartment());
        existingTeacher.setExpertise(updatedTeacher.getExpertise());
        existingTeacher.setExperience(updatedTeacher.getExperience());

        return teacherRepository.save(existingTeacher);
    }

    // Teacher status update
    public Teacher updateTeacherStatus(Long id, String status) {
        Teacher teacher = teacherRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Teacher not found"));
        teacher.setStatus(status);
        return teacherRepository.save(teacher);
    }
}
