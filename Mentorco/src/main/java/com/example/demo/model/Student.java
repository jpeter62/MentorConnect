package com.example.demo.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
   
    @Column
    private String status = "active";
    
    public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages;


   

	@Column(nullable = false)
    private String confirmPassword;

    @Column(nullable = false)
    private String phone;

    // Student-specific fields
    private String rollNo;
    private String course;
    private String yearOfStudy;
    private String fieldOfInterest;

    // Constructors
    

    public Student(Long id, String name, String email, String password, String confirmPassword, String phone, 
                   String rollNo, String course, String yearOfStudy, String fieldOfInterest) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.phone = phone;
        this.rollNo = rollNo;
        this.course = course;
        this.yearOfStudy = yearOfStudy;
        this.fieldOfInterest = fieldOfInterest;
    }

    public Student() {
		super();
		// TODO Auto-generated constructor stub
	}

	// Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Student(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRollNo() {
        return rollNo;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(String yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getFieldOfInterest() {
        return fieldOfInterest;
    }
   

    public void setFieldOfInterest(String fieldOfInterest) {
        this.fieldOfInterest = fieldOfInterest;
    }

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

    @Override
    public String toString() {
        return "Student [id=" + id + ", name=" + name + ", email=" + email + ", phone=" + phone + 
               ", rollNo=" + rollNo + ", course=" + course + ", yearOfStudy=" + yearOfStudy + 
               ", fieldOfInterest=" + fieldOfInterest + "]";
    }
}
