package com.example.demo.controller;

import com.example.demo.model.Session;
import com.example.demo.model.SessionBookingRequest;
import com.example.demo.services.SessionService;

import java.util.List;
import java.util.Map; // Import Map class

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;
    
    @GetMapping
    public ResponseEntity<List<Session>> getSessionsByStudentId(@RequestParam Long studentId) {
        List<Session> sessions = sessionService.getSessionsByStudentId(studentId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/teacher")
    public ResponseEntity<List<Session>> getSessionsByTeacherId(@RequestParam Long teacherId) {
        List<Session> sessions = sessionService.getSessionsByTeacherId(teacherId);
        return ResponseEntity.ok(sessions);
    }

    // Update session status (Accept or Decline session request)
    @PutMapping("/{sessionId}")
    public ResponseEntity<Session> updateSessionStatus(
            @PathVariable Long sessionId, @RequestBody Map<String, String> statusRequest) {
        
        // Extract the status from the request body
        String status = statusRequest.get("status");

        // Validate if the status is one of the allowed statuses (e.g., "CONFIRMED", "CANCELLED")
        if (status == null || !(status.equals("CONFIRMED") || status.equals("CANCELLED"))) {
            return ResponseEntity.status(400).body(null); // Bad request if status is invalid
        }

        // Call the service to update the session status
        Session updatedSession = sessionService.updateSessionStatus(sessionId, status);

        // Return the updated session
        return ResponseEntity.ok(updatedSession);
    }


    @GetMapping("/teacher/id-by-email")
    public ResponseEntity<Long> getTeacherIdByEmail(@RequestParam String email) {
        Long teacherId = sessionService.getTeacherIdByEmail(email);
        return ResponseEntity.ok(teacherId);
    }

    // Endpoint to book a session
    @PostMapping("/book")
    public ResponseEntity<Session> bookSession(@RequestBody SessionBookingRequest sessionRequest) {
        try {
            Session session = sessionService.bookSession(sessionRequest);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    // Get session by ID
    @GetMapping("/{sessionId}")
    public ResponseEntity<Session> getSession(@PathVariable Long sessionId) {
        Session session = sessionService.getSessionById(sessionId);
        return ResponseEntity.ok(session);
    }
}
