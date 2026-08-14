import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CourseService, Course } from '../../services/course.service'; 

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course.html',
  styleUrls: ['./course.css']
})
export class CourseComponent implements OnInit {
  courseService = inject(CourseService);
  cdr = inject(ChangeDetectorRef);

  courses: Course[] = [];
  departmentList: any[] = []; 

  isLoading: boolean = false;
  errorMessage: string = '';
  selectedCourseId: number | null = null;
  isAdmin: boolean = false;
  courseForm = new FormGroup({
    name: new FormControl('', Validators.required),
    departmentId: new FormControl('', Validators.required),
    duration: new FormControl('', Validators.required),
    totalFees: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllCourses();
    this.loadDepartments();
  }
  loadDepartments() {
    this.courseService.getAllDepartments().subscribe({
      next: (data: any) => {
        this.departmentList = Array.isArray(data) ? data : (data.content || []);
      },
      error: (err) => console.error('❌ Departments load nahi hue:', err)
    });
  }
  loadAllCourses() {
    this.isLoading = true;
    this.errorMessage = '';

    this.courseService.getAllCourses().subscribe({
      next: (data: any) => {
        this.courses = Array.isArray(data) ? data : (data.content || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Backend se courses laane mein error aayi!';
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.selectedCourseId = null; 
    this.courseForm.reset();
    this.courseForm.patchValue({ departmentId: '', totalFees: 0 });
    
    const modal = document.getElementById('addCourseModal');
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedCourseId = null;
    const modal = document.getElementById('addCourseModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }
  saveCourse() {
    if (this.courseForm.valid) {
      const rawData = this.courseForm.value;
      
      const courseDataToSave = {
        name: rawData.name,
        departmentId: Number(rawData.departmentId),
        duration: rawData.duration,
        totalFees: Number(rawData.totalFees)
      };

      if (this.selectedCourseId) {
        this.courseService.updateCourse(this.selectedCourseId, courseDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'The course has been successfully updated!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.selectedCourseId = null;
            this.courseForm.reset();
            this.closeModal(); 
            this.loadAllCourses(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update the course. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Backend Error:", err);
          }
        });
      } else {
        this.courseService.addCourse(courseDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'The course has been successfully added!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.courseForm.reset();
            this.closeModal(); 
            this.loadAllCourses(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add the course. Please try again.',
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
  deleteCourse(courseId: number) {
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
        this.courseService.deleteCourse(courseId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The course has been successfully deleted!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.loadAllCourses(); 
          },
          error: (err) => {
            if (err.status === 200 || err.status === 204 || err.statusText === 'OK') {
              Swal.fire({
                title: 'Deleted!',
                text: 'The course has been successfully deleted!',
                icon: 'success',
                confirmButtonColor: '#2d63ed'
              });
              this.loadAllCourses();
            } else {
              Swal.fire('Error!', 'Failed to delete the course.', 'error');
              console.error(err);
            }
          }
        });
      }
    });
  }
  openUpdateModal(course: any) {
    this.selectedCourseId = course.courseId; 
    
    this.courseForm.patchValue({
      name: course.name,
      departmentId: (course.departmentId || course.department?.departmentId) as any,
      duration: course.duration,
      totalFees: course.totalFees
    });

    const modal = document.getElementById('addCourseModal'); 
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}