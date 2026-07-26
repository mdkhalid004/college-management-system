package com.cfs.cms.entity;

import com.cfs.cms.enums.FeeStatus;
import com.cfs.cms.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    // Foreign Key: User ID (Linking to your existing Auth User)
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String firstName;
    private String lastName;
    private  String enrollmentNumber;
    private String fatherName;
    private String motherName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate dob;
    private String mobile;
    private String address;

    // Foreign Key: Department (Entity hum aage banayenge)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    // Foreign Key: Course (Entity hum aage banayenge)
   @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    private Integer semester;
    private LocalDate admissionDate;

    @Enumerated(EnumType.STRING)
    private FeeStatus feeStatus;

    // Storing photo file path or URL string
    private String photo;
}