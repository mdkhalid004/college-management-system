import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { StudentService, Student } from '../../services/student.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student.html',
  styleUrls: ['./student.css']
})
export class StudentComponent implements OnInit {
  studentService = inject(StudentService);
  cdr = inject(ChangeDetectorRef);

  students: Student[] = [];
  departmentList: any[] = []; 
  courseList: any[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';
  isAdmin: boolean = false;
  selectedStudentId: number | null = null;

  studentForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    enrollmentNumber: new FormControl('', Validators.required),
    mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    fatherName: new FormControl(''), 
    motherName: new FormControl(''),
    gender: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required),
    departmentId: new FormControl('', Validators.required),
    courseId: new FormControl('', Validators.required),
    semester: new FormControl('', Validators.required),
    feeStatus: new FormControl('', Validators.required),
    admissionDate: new FormControl('', Validators.required),
    address: new FormControl('')
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllStudents();
    this.loadDepartments(); 
    this.loadCourses();    
  }

  loadDepartments() {
    this.studentService.getAllDepartments().subscribe({
      next: (data: any) => {
        this.departmentList = Array.isArray(data) ? data : (data.content || []);
      },
      error: (err) => console.error('❌ Departments load nahi hue:', err)
    });
  }

  loadCourses() {
    this.studentService.getAllCourses().subscribe({
      next: (data: any) => {
        this.courseList = Array.isArray(data) ? data : (data.content || []);
      },
      error: (err) => console.error('❌ Courses load nahi hue:', err)
    });
  }

  loadAllStudents() {
    this.isLoading = true;
    this.errorMessage = '';

    this.studentService.getAllStudents().subscribe({
      next: (data: any) => {
        this.students = Array.isArray(data) ? data : (data.content || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Backend se data laane mein error aayi!';
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.selectedStudentId = null; 
    this.studentForm.reset();
    this.studentForm.patchValue({ gender: '', departmentId: '', courseId: '', semester: '', feeStatus: '' });
    
    const modal = document.getElementById('addStudentModal');
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedStudentId = null;
    const modal = document.getElementById('addStudentModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }
  saveStudent() {
    if (this.studentForm.valid) {
      const rawData = this.studentForm.value;
      const semesterString = String(rawData.semester || '1');
      const semesterNumber = parseInt(semesterString.replace(/[^0-9]/g, ''), 10) || 1;
      
      const studentDataToSave = {
        firstName: rawData.firstName,
        lastName: rawData.lastName,
        enrollmentNumber: rawData.enrollmentNumber,
        mobile: String(rawData.mobile),
        semester: semesterNumber, 
        departmentId: Number(rawData.departmentId), 
        courseId: Number(rawData.courseId),                
        fatherName: rawData.fatherName || 'Not Provided',
        motherName: rawData.motherName || 'Not Provided',
        gender: rawData.gender, 
        dob: rawData.dob, 
        address: rawData.address || 'Not Provided',
        admissionDate: rawData.admissionDate, 
        feeStatus: rawData.feeStatus 
      };

      if (this.selectedStudentId) {
        this.studentService.updateStudent(this.selectedStudentId, studentDataToSave as any).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'The student has been successfully updated!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.selectedStudentId = null;
            this.studentForm.reset();
            this.closeModal(); 
            this.loadAllStudents(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update the student. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Backend Error:", err);
          }
        });
      } else {
        this.studentService.addStudent(studentDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'The student has been successfully added!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.studentForm.reset();
            this.closeModal(); 
            this.loadAllStudents(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add the student. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Backend Error:", err);
          }
        });
      }
    } else {
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill all the required fields correctly.',
        icon: 'warning',
        confirmButtonColor: '#f39c12'
      });
    }
  }
  
  deleteStudent(studentId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.deleteStudent(studentId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The student has been successfully deleted!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.loadAllStudents(); 
          },
          error: (err) => {
            if (err.status === 200 || err.status === 204 || err.statusText === 'OK') {
              Swal.fire({
                title: 'Deleted!',
                text: 'The student has been successfully deleted!',
                icon: 'success',
                confirmButtonColor: '#2d63ed'
              });
              this.loadAllStudents(); 
            } else {
              Swal.fire('Error!', 'Failed to delete the student.', 'error');
              console.error(err);
            }
          }
        });
      }
    });
  }
  openUpdateModal(student: any) {
    this.selectedStudentId = student.studentId; 
    
    this.studentForm.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      enrollmentNumber: student.enrollmentNumber,
      mobile: student.mobile,
      fatherName: student.fatherName,
      motherName: student.motherName,
      gender: student.gender,
      dob: student.dob,
      departmentId: student.departmentId as any,
      courseId: student.courseId as any,
      semester: student.semester as any,
      feeStatus: student.feeStatus,
      admissionDate: student.admissionDate,
      address: student.address
    });

    const modal = document.getElementById('addStudentModal');
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}