package com.example.demo.model;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    private LocalDate date;
    private String timeSlot;
    private boolean available;  // ✅ Renamed to avoid `isAvailable()` issues

    public Schedule() {}

    public Schedule(Teacher teacher, LocalDate date, String timeSlot, boolean available) {
        this.teacher = teacher;
        this.date = date;
        this.timeSlot = timeSlot;
        this.available = available;
    }

    // ✅ Getters & Setters
    public Long getId() { return id; }
    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    
    public boolean getAvailable() { return available; }  // ✅ Fix getter
    public void setAvailable(boolean available) { this.available = available; }
}
