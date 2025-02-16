package com.example.demo.repository;

import com.example.demo.model.Teacher;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    boolean existsByEmail(String email);

  
    Optional<Teacher> findByEmail(String email);
    Optional<Teacher> findById(Long id);
    @Query("SELECT t FROM Teacher t WHERE t.id = :teacherId")
    Optional<Teacher> findTeacherById(Long teacherId);
    
}
