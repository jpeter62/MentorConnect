package com.example.demo.services;
import com.example.demo.model.Session;
import com.example.demo.model.SessionBookingRequest;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.repository.SessionRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;
    

    
    
    public List<Session> getSessionsByStudentId(Long studentId) {
        // Fetch all sessions for the student
        List<Session> sessions = sessionRepository.findByStudentId(studentId);

        // Set the mentor's name in each session
        return sessions.stream().map(session -> {
            Teacher teacher = teacherRepository.findById(session.getTeacher().getId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));
            session.getTeacher().setName(teacher.getName()); // Setting teacher name in the session
            return session;
        }).collect(Collectors.toList());
    }
    
    public Session getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }
    public Session updateSessionStatus(Long sessionId, String status) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(status);
        
        // Save and return the updated session
        return sessionRepository.save(session);
    }

    
    public List<Session> getSessionsByTeacherId(Long teacherId) {
        // Fetch all sessions for the teacher
        List<Session> sessions = sessionRepository.findByTeacherId(teacherId);

        // Set the student's name in each session
        return sessions.stream().map(session -> {
            Student student = studentRepository.findById(session.getStudent().getId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            session.getStudent().setName(student.getName()); // Setting student name in the session
            return session;
        }).collect(Collectors.toList());
    }
    public Long getTeacherIdByEmail(String email) {
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found for email: " + email));
        return teacher.getId();
    }

    // Method to update the session status
    

    public Session bookSession(SessionBookingRequest sessionRequest) {
        // Fetch the student and teacher based on the provided IDs
        Student student = studentRepository.findById(sessionRequest.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Teacher teacher = teacherRepository.findById(sessionRequest.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Validate if the time slot is available (you can add custom logic here for validation)

        // Create and save the session
        Session session = new Session();
        session.setStudent(student);
        session.setTeacher(teacher);
        session.setDate(LocalDate.parse(sessionRequest.getDate()));
        session.setTimeSlot(sessionRequest.getTimeSlot());
        session.setTopic(sessionRequest.getTopic());
        session.setStatus("PENDING");  // Default status (can be changed to BOOKED on confirmation)
        session.setCreatedAt(LocalDateTime.now());

        return sessionRepository.save(session); // Save session to DB
    }
}