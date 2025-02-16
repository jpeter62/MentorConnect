package com.example.demo.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonIgnore // Prevents infinite recursion
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id")
    @JsonIgnore // Prevents recursion issues
    private Teacher teacher;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private boolean isRead = false; // Default value

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Long senderId; // NEW FIELD 🚀 (Stores either student ID or teacher ID)

    // Default constructor
    public Message() {}

    public Message(Student student, Teacher teacher, String content, Long senderId) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        this.student = student;
        this.teacher = teacher;
        this.content = content;
        this.senderId = senderId;
        this.timestamp = LocalDateTime.now(); // Auto-set timestamp
    }

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public String getContent() { return content; }
    public void setContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
        this.content = content;
    }

    public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

	public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getTimestamp() { return timestamp; }
    
    public Long getSenderId() { return senderId; } // NEW METHOD 🚀
    public void setSenderId(Long senderId) { this.senderId = senderId; } // NEW METHOD 🚀
}
