package com.example.demo.controller;

import com.example.demo.model.Message;
import com.example.demo.model.Student;
import com.example.demo.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:3000") // Adjust if your frontend runs on a different port
public class MessageController {

    @Autowired
    private MessageService messageService;

    
    // Send a new message with senderId
    @PostMapping("/send")
    public Message sendMessage(
            @RequestParam Long studentId,
            @RequestParam Long teacherId,
            @RequestParam Long senderId, // NEW PARAMETER
            @RequestParam String content) {
        return messageService.sendMessage(studentId, teacherId, senderId, content);
    }
    
    @GetMapping("/conversation/last")
    public ResponseEntity<Message> getLastMessage(
            @RequestParam Long studentId,
            @RequestParam Long teacherId) {
        Message lastMessage = messageService.getLastMessage(studentId, teacherId);
        return ResponseEntity.ok(lastMessage);
    }

    // Get all messages between a specific student and teacher
    @GetMapping("/conversation")
    public List<Message> getMessagesBetweenStudentAndTeacher(@RequestParam Long studentId, @RequestParam Long teacherId) {
        List<Message> messages = messageService.getMessagesBetweenStudentAndTeacher(studentId, teacherId);

        // 🔍 Debugging: Print messages before returning
        messages.forEach(msg -> System.out.println(
            "Message ID: " + msg.getId() +
            ", Student ID: " + (msg.getStudent() != null ? msg.getStudent().getId() : "N/A") +
            ", Teacher ID: " + (msg.getTeacher() != null ? msg.getTeacher().getId() : "N/A") +
            ", Sender ID: " + msg.getSenderId() +
            ", Content: " + msg.getContent()
        ));

        return messages;
    }

    @GetMapping("/students/{teacherId}")
    public ResponseEntity<List<Student>> getStudentsForTeacher(@PathVariable Long teacherId) {
        List<Student> students = messageService.getStudentsByTeacherId(teacherId);
        return ResponseEntity.ok(students);
    }

    // Get all messages for a specific teacher
    @GetMapping("/teacher/{teacherId}")
    public List<Message> getMessagesForTeacher(@PathVariable Long teacherId) {
        return messageService.getMessagesForTeacher(teacherId);
    }

    // Get all messages for a specific student
    @GetMapping("/student/{studentId}")
    public List<Message> getMessagesForStudent(@PathVariable Long studentId) {
        return messageService.getMessagesForStudent(studentId);
    }
}
