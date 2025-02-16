package com.example.demo.services;

import com.example.demo.model.Message;
import com.example.demo.model.Student;
import com.example.demo.model.Teacher;
import com.example.demo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    // Get messages between a specific student and teacher
    public List<Message> getMessagesBetweenStudentAndTeacher(Long studentId, Long teacherId) {
        return messageRepository.findConversationMessages(studentId, teacherId);
    }

    // Get all messages for a specific teacher
    public List<Message> getMessagesForTeacher(Long teacherId) {
        return messageRepository.findByTeacherId(teacherId);
    }
    
    public Message getLastMessage(Long studentId, Long teacherId) {
        return messageRepository.findLastMessageBetweenStudentAndTeacher(studentId, teacherId);
    }

    // Get all messages for a specific student
    public List<Message> getMessagesForStudent(Long studentId) {
        return messageRepository.findByStudentId(studentId);
    }

    public List<Student> getStudentsByTeacherId(Long teacherId) {
        return messageRepository.findStudentsByTeacherId(teacherId);
    }

    // Send a new message with senderId
    public Message sendMessage(Long studentId, Long teacherId, Long senderId, String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

        Message message = new Message();
        message.setStudent(new Student(studentId)); // Assuming Student has an ID constructor
        message.setTeacher(new Teacher(teacherId)); // Assuming Teacher has an ID constructor
        message.setSenderId(senderId); // NEW FIELD: Identifies who sent the message
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }
}
