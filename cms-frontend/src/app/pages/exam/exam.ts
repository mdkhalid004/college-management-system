import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ExamService, Exam } from '../../services/exam.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam.html',
  styleUrls: ['./exam.css']
})
export class ExamComponent implements OnInit {
  examService = inject(ExamService);
  cdr = inject(ChangeDetectorRef);

  examsList: Exam[] = [];
  courseList: any[] = [];
  
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedExamId: number | null = null;

  // 🌟 Role-Based Access Control variable
  isAdmin: boolean = false;

  examForm = new FormGroup({
    name: new FormControl('', Validators.required),
    courseId: new FormControl('', Validators.required),
    examDate: new FormControl('', Validators.required),
    examTime: new FormControl('', Validators.required),
    roomNumber: new FormControl('', Validators.required)
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllExams();
    this.loadCourses();
  }

  loadCourses() {
    this.examService.getAllCourses().subscribe({
      next: (data: any) => {
        this.courseList = Array.isArray(data) ? data : (data.content || []);
      },
      error: (err) => console.error('❌ Courses load nahi hue:', err)
    });
  }

  loadAllExams() {
    this.isLoading = true;
    this.errorMessage = '';

    this.examService.getAllExams().subscribe({
      next: (data: any) => {
        this.examsList = Array.isArray(data) ? data : (data.content || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Backend se exams laane mein error aayi!';
        this.cdr.detectChanges();
      }
    });
  }

  // Safe display method for Course Name
  getCourseDisplay(exam: any): string {
    if (exam.courseName) return exam.courseName;
    if (exam.course) {
      if (exam.course.name) return exam.course.name;
    }
    if (exam.courseId && this.courseList.length > 0) {
      const foundCourse = this.courseList.find(c => c.courseId === exam.courseId || c.id === exam.courseId);
      if (foundCourse) {
        return foundCourse.name || `Course #${exam.courseId}`;
      }
    }
    return `Course #${exam.courseId || 'N/A'}`;
  }

  openModal() {
    this.selectedExamId = null;
    this.examForm.reset();
    this.examForm.patchValue({ 
      courseId: '',
      examDate: new Date().toISOString().split('T')[0],
      examTime: '10:00'
    });
    
    const modal = document.getElementById('addExamModal');
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedExamId = null;
    const modal = document.getElementById('addExamModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  saveExam() {
    if (this.examForm.valid) {
      const rawData = this.examForm.value;
      
      const examDataToSave = {
        name: rawData.name,
        courseId: Number(rawData.courseId),
        examDate: rawData.examDate,
        examTime: rawData.examTime,
        roomNumber: rawData.roomNumber
      };

      if (this.selectedExamId) {
        this.examService.updateExam(this.selectedExamId, examDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'The exam has been successfully updated!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.selectedExamId = null;
            this.examForm.reset();
            this.closeModal(); 
            this.loadAllExams(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update the exam. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Backend Error:", err);
          }
        });
      } else {
        this.examService.addExam(examDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'The exam has been successfully scheduled!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.examForm.reset();
            this.closeModal(); 
            this.loadAllExams(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to schedule the exam. Please try again.',
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
  
  deleteExam(examId: number) {
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
        this.examService.deleteExam(examId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The exam has been successfully deleted!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.loadAllExams(); 
          },
          error: (err) => {
            if (err.status === 200 || err.status === 204 || err.statusText === 'OK') {
              Swal.fire({
                title: 'Deleted!',
                text: 'The exam has been successfully deleted!',
                icon: 'success',
                confirmButtonColor: '#2d63ed'
              });
              this.loadAllExams();
            } else {
              Swal.fire('Error!', 'Failed to delete the exam.', 'error');
              console.error(err);
            }
          }
        });
      }
    });
  }

  openUpdateModal(exam: any) {
    this.selectedExamId = exam.examId; 
    
    this.examForm.patchValue({
      name: exam.name,
      courseId: (exam.courseId || exam.course?.courseId) as any,
      examDate: exam.examDate,
      examTime: exam.examTime,
      roomNumber: exam.roomNumber
    });

    const modal = document.getElementById('addExamModal'); 
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}