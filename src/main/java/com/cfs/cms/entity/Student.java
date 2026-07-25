package com.cfs.cms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor // Creates the default empty constructor required by JPA
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique enrollment number for each student
    @Column(nullable = false, unique = true)
    private String enrollmentNumber;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String department;

    // Standard date format for birth date
    @Column(nullable = false)
    private LocalDate dateOfBirth;
}