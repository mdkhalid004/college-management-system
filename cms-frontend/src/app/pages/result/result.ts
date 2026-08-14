import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ResultService, Result } from '../../services/result.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './result.html',
  styleUrls: ['./result.css']
})
export class ResultComponent implements OnInit {
  resultService = inject(ResultService);
  cdr = inject(ChangeDetectorRef);

  resultsList: Result[] = [];
  studentList: any[] = [];
  courseList: any[] = [];
  
  isLoading: boolean = false;
  selectedResultId: number | null = null;
  isAdmin: boolean = false;

  resultForm = new FormGroup({
    studentId: new FormControl('', Validators.required),
    courseId: new FormControl('', Validators.required),
    marks: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
    grade: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllResults();
    this.loadStudentsAndCourses();
  }

  loadStudentsAndCourses() {
    this.resultService.getAllStudents().subscribe({
      next: (data: any) => this.studentList = Array.isArray(data) ? data : (data.content || [])
    });
    this.resultService.getAllCourses().subscribe({
      next: (data: any) => this.courseList = Array.isArray(data) ? data : (data.content || [])
    });
  }

  loadAllResults() {
    this.isLoading = true;
    this.resultService.getAllResults().subscribe({
      next: (data: any) => {
        this.resultsList = Array.isArray(data) ? data : (data.content || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }
  calculateGradeAndStatus() {
    const marks = Number(this.resultForm.get('marks')?.value) || 0;
    let grade = 'F';
    let status = 'Fail';

    if (marks >= 90) { grade = 'A+'; status = 'Pass'; }
    else if (marks >= 80) { grade = 'A'; status = 'Pass'; }
    else if (marks >= 70) { grade = 'B'; status = 'Pass'; }
    else if (marks >= 60) { grade = 'C'; status = 'Pass'; }
    else if (marks >= 40) { grade = 'D'; status = 'Pass'; }

    this.resultForm.patchValue({ grade, status });
  }
  getStudentDisplay(result: any): string {
    if (result.studentName) return result.studentName;
    if (result.student?.name) return result.student.name;
    if (result.student?.firstName) return `${result.student.firstName} ${result.student.lastName || ''}`.trim();
    
    if (result.studentId && this.studentList.length > 0) {
      const s = this.studentList.find(x => x.studentId === result.studentId || x.id === result.studentId);
      if (s) return s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim();
    }
    return `Student #${result.studentId || 'N/A'}`;
  }

  getCourseDisplay(result: any): string {
    if (result.courseName) return result.courseName;
    if (result.course?.name) return result.course.name;
    
    if (result.courseId && this.courseList.length > 0) {
      const c = this.courseList.find(x => x.courseId === result.courseId || x.id === result.courseId);
      if (c) return c.name;
    }
    return `Course #${result.courseId || 'N/A'}`;
  }

  openModal() {
    this.selectedResultId = null;
    this.resultForm.reset({ studentId: '', courseId: '', status: '' });
    
    const modal = document.getElementById('addResultModal');
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedResultId = null;
    const modal = document.getElementById('addResultModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  saveResult() {
    if (this.resultForm.valid) {
      const rawData = this.resultForm.value;
      const dataToSave = {
        studentId: Number(rawData.studentId),
        courseId: Number(rawData.courseId),
        marks: Number(rawData.marks),
        grade: rawData.grade,
        status: rawData.status
      };

      const request = this.selectedResultId 
        ? this.resultService.updateResult(this.selectedResultId, dataToSave)
        : this.resultService.addResult(dataToSave);

      request.subscribe({
        next: () => {
          Swal.fire('Success!', `Result successfully ${this.selectedResultId ? 'updated' : 'declared'}!`, 'success');
          this.closeModal(); 
          this.loadAllResults(); 
        },
        error: (err) => {
          Swal.fire('Error!', 'Operation failed.', 'error');
          console.error(err);
        }
      });
    } else {
      Swal.fire('Warning!', 'Please fill all required fields properly.', 'warning');
    }
  }
  
  deleteResult(resultId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this result?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resultService.deleteResult(resultId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Result deleted successfully.', 'success');
            this.loadAllResults(); 
          },
          error: (err) => {
             if(err.status === 200 || err.statusText === 'OK') {
               Swal.fire('Deleted!', 'Result deleted successfully.', 'success');
               this.loadAllResults();
             } else {
               Swal.fire('Error!', 'Failed to delete.', 'error');
             }
          }
        });
      }
    });
  }

  openUpdateModal(result: any) {
    this.selectedResultId = result.resultId; 
    
    this.resultForm.patchValue({
      studentId: (result.studentId || result.student?.studentId) as any,
      courseId: (result.courseId || result.course?.courseId) as any,
      marks: result.marks,
      grade: result.grade,
      status: result.status
    });

    const modal = document.getElementById('addResultModal'); 
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}