package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Message;
import com.example.demo.model.Student;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    List<Message> findByTeacherId(Long teacherId);
    List<Message> findByStudentId(Long studentId);
    
    @Query("SELECT m FROM Message m WHERE " +
            "(m.student.id = :studentId AND m.teacher.id = :teacherId) " +
            "ORDER BY m.timestamp DESC LIMIT 1")
     Message findLastMessageBetweenStudentAndTeacher(@Param("studentId") Long studentId, 
                                                    @Param("teacherId") Long teacherId);

    @Query("SELECT m FROM Message m WHERE (m.student.id = :studentId AND m.teacher.id = :teacherId) OR (m.student.id = :teacherId AND m.teacher.id = :studentId) ORDER BY m.timestamp ASC")
    List<Message> findConversationMessages(@Param("studentId") Long studentId, @Param("teacherId") Long teacherId);
    @Query("SELECT DISTINCT m.student FROM Message m WHERE m.teacher.id = :teacherId")
    List<Student> findStudentsByTeacherId(@Param("teacherId") Long teacherId);
}
