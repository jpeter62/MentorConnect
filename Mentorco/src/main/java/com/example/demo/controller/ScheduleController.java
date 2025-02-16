package com.example.demo.controller;

import com.example.demo.model.Schedule;
import com.example.demo.model.Teacher;
import com.example.demo.services.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:3000") // Adjust frontend URL if needed
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;
  

    // ✅ Save a schedule for a teacher
    @PostMapping("/save")
    public ResponseEntity<List<Schedule>> saveSchedules(@RequestBody List<Map<String, Object>> scheduleRequests) {
        List<Schedule> schedules = scheduleRequests.stream().map(request -> {
            Long teacherId = Long.parseLong(request.get("teacherId").toString());
            LocalDate date = LocalDate.parse(request.get("date").toString());
            String timeSlot = request.get("timeSlot").toString();
            
            // ✅ Create a Teacher object with only ID
            Teacher teacher = new Teacher();
            teacher.setId(teacherId);

            return new Schedule(teacher, date, timeSlot, true);
        }).toList();

        List<Schedule> savedSchedules = scheduleService.saveSchedules(schedules);
        return ResponseEntity.ok(savedSchedules);
    }


    

    // ✅ Fetch schedules for a specific teacher
    @GetMapping("/{teacherId}")
    public ResponseEntity<List<Schedule>> getSchedulesByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByTeacher(teacherId));
    }

   
    
    @GetMapping("/available/{teacherId}/{date}")
    public ResponseEntity<List<String>> getAvailableSlots(
            @PathVariable Long teacherId, @PathVariable String date) {
        
        LocalDate selectedDate = LocalDate.parse(date);
        List<String> availableSlots = scheduleService.getAvailableSlots(teacherId, selectedDate);
        return ResponseEntity.ok(availableSlots);
    }

    // ✅ Mark time slots as unavailable
    @PostMapping("/set-unavailable")
    public ResponseEntity<String> setUnavailableSlots(@RequestBody Map<String, Object> request) {
        Long teacherId = Long.parseLong(request.get("teacherId").toString());
        LocalDate date = LocalDate.parse(request.get("date").toString());
        @SuppressWarnings("unchecked")
		List<String> unavailableSlots = (List<String>) request.get("unavailableSlots");

        scheduleService.setUnavailableSlots(teacherId, date, unavailableSlots);
        return ResponseEntity.ok("Unavailable slots updated successfully");
    }
}
