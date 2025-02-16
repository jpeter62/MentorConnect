package com.example.demo.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "teachers")
public class Teacher {

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
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages;



    public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}
	
	public Teacher(Long id) {
	    this.id = id;
	}


	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(nullable = false)
    private String confirmPassword;

    @Column(nullable = false)
    private String phone;

    // Teacher-specific fields
    private String teachingId;
    private String department;
    private String expertise;
    private String experience;

    // Constructors
    

    public Teacher(Long id, String name, String email, String password, String confirmPassword, String phone,
                   String teachingId, String department, String expertise, String experience) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.phone = phone;
        this.teachingId = teachingId;
        this.department = department;
        this.expertise = expertise;
        this.experience = experience;
    }

    public Teacher() {
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

    public String getTeachingId() {
        return teachingId;
    }

    public void setTeachingId(String teachingId) {
        this.teachingId = teachingId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getExpertise() {
        return expertise;
    }

    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    @Override
    public String toString() {
        return "Teacher [id=" + id + ", name=" + name + ", email=" + email + ", phone=" + phone +
               ", teachingId=" + teachingId + ", department=" + department + 
               ", expertise=" + expertise + ", experience=" + experience + "]";
    }
}
