package com.example.demo.repository;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Student;


@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
   Optional<Student> findByEmail(String email);
   Optional<Student> findById(Long id);
    boolean existsByEmail(String email);
    @Query("SELECT s FROM Student s WHERE s.id = :studentId")
    Optional<Student> findStudentById(Long studentId);
}
