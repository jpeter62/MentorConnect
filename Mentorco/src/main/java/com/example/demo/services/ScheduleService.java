package com.example.demo.services;

import com.example.demo.model.Schedule;
import com.example.demo.model.Teacher;
import com.example.demo.repository.ScheduleRepository;
import com.example.demo.repository.TeacherRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TeacherRepository teacherRepository;
    
    
    public List<Schedule> saveSchedules(List<Schedule> schedules) {
        return scheduleRepository.saveAll(schedules);
    }

    // ✅ Save a single schedule
    public Schedule saveSchedule(Long teacherId, LocalDate date, String timeSlot) {
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new RuntimeException("Teacher not found"));

        Schedule schedule = new Schedule(teacher, date, timeSlot, true);
        return scheduleRepository.save(schedule);
    }
    
    public List<String> getAvailableSlots(Long teacherId, LocalDate date) {
        List<Schedule> schedules = scheduleRepository.findByTeacherIdAndDateAndAvailableTrue(teacherId, date);
        return schedules.stream().map(Schedule::getTimeSlot).collect(Collectors.toList());
    }

    // ✅ Mark specific slots as unavailable
    public void setUnavailableSlots(Long teacherId, LocalDate date, List<String> unavailableSlots) {
        List<Schedule> schedules = scheduleRepository.findByTeacherIdAndDate(teacherId, date);
        
        for (Schedule schedule : schedules) {
            if (unavailableSlots.contains(schedule.getTimeSlot())) {
                schedule.setAvailable(false);
            }
        }
        scheduleRepository.saveAll(schedules);
    }

    // ✅ Save multiple schedules at once
   

    // ✅ Fetch schedules for a specific teacher
    public List<Schedule> getSchedulesByTeacher(Long teacherId) {
        return scheduleRepository.findByTeacherId(teacherId);
    }

    // ✅ Fetch available schedules for a teacher on a specific date
    public List<Schedule> getAvailableSchedules(Long teacherId, LocalDate date) {
        return scheduleRepository.findByTeacherIdAndDateAndAvailableTrue(teacherId, date);
    }
}
