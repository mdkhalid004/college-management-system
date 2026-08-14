import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AttendanceService, Attendance } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class AttendanceComponent implements OnInit {
  attendanceService = inject(AttendanceService);
  cdr = inject(ChangeDetectorRef);

  attendanceList: Attendance[] = [];
  studentList: any[] = [];
  courseList: any[] = [];
  
  isLoading: boolean = false;
  selectedAttendanceId: number | null = null;
  isAdmin: boolean = false;

  attendanceForm = new FormGroup({
    studentId: new FormControl('', Validators.required),
    courseId: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    status: new FormControl('', Validators.required)
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadStudentsAndCourses();
    this.loadAllAttendances();
  }

  loadStudentsAndCourses() {
    this.attendanceService.getAllStudents().subscribe({
      next: (data: any) => this.studentList = Array.isArray(data) ? data : (data.content || [])
    });
    this.attendanceService.getAllCourses().subscribe({
      next: (data: any) => this.courseList = Array.isArray(data) ? data : (data.content || [])
    });
  }

  loadAllAttendances() {
    this.isLoading = true;
    this.attendanceService.getAllAttendances().subscribe({
      next: (data: any) => {
        this.attendanceList = Array.isArray(data) ? data : (data.content || []);
        this.attendanceList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }
  getStudentDisplay(record: any): string {
    if (record.studentName) return record.studentName;
    if (record.student?.name) return record.student.name;
    if (record.student?.firstName) return `${record.student.firstName} ${record.student.lastName || ''}`.trim();
    
    if (record.studentId && this.studentList.length > 0) {
      const s = this.studentList.find(x => x.studentId === record.studentId || x.id === record.studentId);
      if (s) return s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim();
    }
    return `Student #${record.studentId || 'N/A'}`;
  }

  getCourseDisplay(record: any): string {
    if (record.courseName) return record.courseName;
    if (record.course?.name) return record.course.name;
    
    if (record.courseId && this.courseList.length > 0) {
      const c = this.courseList.find(x => x.courseId === record.courseId || x.id === record.courseId);
      if (c) return c.name;
    }
    return `Course #${record.courseId || 'N/A'}`;
  }

  openModal() {
    this.selectedAttendanceId = null;
    this.attendanceForm.reset({ studentId: '', courseId: '', status: '' });
    this.attendanceForm.patchValue({
      date: new Date().toISOString().split('T')[0]
    });
    
    const modal = document.getElementById('addAttendanceModal');
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedAttendanceId = null;
    const modal = document.getElementById('addAttendanceModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  saveAttendance() {
    if (this.attendanceForm.valid) {
      const rawData = this.attendanceForm.value;
      const dataToSave = {
        studentId: Number(rawData.studentId),
        courseId: Number(rawData.courseId),
        date: rawData.date,
        status: rawData.status
      };

      const request = this.selectedAttendanceId 
        ? this.attendanceService.updateAttendance(this.selectedAttendanceId, dataToSave)
        : this.attendanceService.addAttendance(dataToSave);

      request.subscribe({
        next: () => {
          Swal.fire('Success!', `Attendance successfully ${this.selectedAttendanceId ? 'updated' : 'marked'}!`, 'success');
          this.closeModal(); 
          this.loadAllAttendances(); 
        },
        error: (err) => {
          Swal.fire('Error!', 'Operation failed.', 'error');
          console.error(err);
        }
      });
    } else {
      Swal.fire('Warning!', 'Please fill all required fields.', 'warning');
    }
  }
  
  deleteAttendance(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this attendance record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.attendanceService.deleteAttendance(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Record deleted successfully.', 'success');
            this.loadAllAttendances(); 
          },
          error: (err) => {
             if(err.status === 200 || err.statusText === 'OK') {
               Swal.fire('Deleted!', 'Record deleted successfully.', 'success');
               this.loadAllAttendances();
             } else {
               Swal.fire('Error!', 'Failed to delete.', 'error');
             }
          }
        });
      }
    });
  }

  openUpdateModal(record: any) {
    this.selectedAttendanceId = record.attendanceId; 
    
    this.attendanceForm.patchValue({
      studentId: (record.studentId || record.student?.studentId) as any,
      courseId: (record.courseId || record.course?.courseId) as any,
      date: record.date,
      status: record.status
    });

    const modal = document.getElementById('addAttendanceModal'); 
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}