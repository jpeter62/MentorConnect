package com.example.demo.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

//Session.java
@Entity
@Table(name = "sessions")
public class Session {
 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @ManyToOne
 @JoinColumn(name = "student_id")
 private Student student;

 @ManyToOne
 @JoinColumn(name = "teacher_id")
 private Teacher teacher;

 
private LocalDate date;
 private String timeSlot;
 private String topic;
 private String status; // PENDING, CONFIRMED, COMPLETED, CANCELLED

 @Column(name = "created_at")
 private LocalDateTime createdAt;

public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

public Student getStudent() {
	return student;
}

public void setStudent(Student student) {
	this.student = student;
}

public Teacher getTeacher() {
	return teacher;
}

public void setTeacher(Teacher teacher) {
	this.teacher = teacher;
}

public LocalDate getDate() {
	return date;
}

public void setDate(LocalDate date) {
	this.date = date;
}

public String getTimeSlot() {
	return timeSlot;
}

public void setTimeSlot(String timeSlot) {
	this.timeSlot = timeSlot;
}

public String getTopic() {
	return topic;
}

public void setTopic(String topic) {
	this.topic = topic;
}

public String getStatus() {
	return status;
}

public void setStatus(String status) {
	this.status = status;
}

public LocalDateTime getCreatedAt() {
	return createdAt;
}

public void setCreatedAt(LocalDateTime createdAt) {
	this.createdAt = createdAt;
}

 // Getters, setters, constructors
}

