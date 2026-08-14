import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TimetableService, Timetable } from '../../services/timetable.service'; 

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './timetable.html',
  styleUrls: ['./timetable.css']
})
export class TimetableComponent implements OnInit {
  timetableService = inject(TimetableService);
  cdr = inject(ChangeDetectorRef);

  timetablesList: Timetable[] = [];
  departmentList: any[] = [];
  courseList: any[] = [];
  teacherList: any[] = [];
  
  isLoading: boolean = false;
  selectedTimetableId: number | null = null;
  isAdmin: boolean = false;
  timetableForm = new FormGroup({
    departmentId: new FormControl('', Validators.required),
    semester: new FormControl('', Validators.required),
    courseId: new FormControl('', Validators.required),
    teacherId: new FormControl('', Validators.required),
    dayOfWeek: new FormControl('', Validators.required),
    classTime: new FormControl('', Validators.required),
    roomNumber: new FormControl('', Validators.required)
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllTimetables();
    this.loadDropdownDependencies();
  }

  loadDropdownDependencies() {
    this.timetableService.getAllDepartments().subscribe({
      next: (data: any) => this.departmentList = Array.isArray(data) ? data : (data.content || [])
    });
    this.timetableService.getAllCourses().subscribe({
      next: (data: any) => this.courseList = Array.isArray(data) ? data : (data.content || [])
    });
    this.timetableService.getAllTeachers().subscribe({
      next: (data: any) => this.teacherList = Array.isArray(data) ? data : (data.content || [])
    });
  }

  loadAllTimetables() {
    this.isLoading = true;
    this.timetableService.getAllTimetables().subscribe({
      next: (data: any) => {
        this.timetablesList = Array.isArray(data) ? data : (data.content || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }

  openModal() {
    this.selectedTimetableId = null;
    this.timetableForm.reset({ departmentId: '', courseId: '', teacherId: '', dayOfWeek: '', semester: '' });
    
    const modal = document.getElementById('addTimetableModal');
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedTimetableId = null;
    const modal = document.getElementById('addTimetableModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  saveTimetable() {
    if (this.timetableForm.valid) {
      const rawData = this.timetableForm.value;
      
      const dataToSave = {
        departmentId: Number(rawData.departmentId),
        semester: rawData.semester,
        courseId: Number(rawData.courseId),
        teacherId: Number(rawData.teacherId),
        dayOfWeek: rawData.dayOfWeek,
        classTime: rawData.classTime,
        roomNumber: rawData.roomNumber
      };

      const request = this.selectedTimetableId 
        ? this.timetableService.updateTimetable(this.selectedTimetableId, dataToSave)
        : this.timetableService.addTimetable(dataToSave);

      request.subscribe({
        next: () => {
          Swal.fire('Success!', `Timetable successfully ${this.selectedTimetableId ? 'updated' : 'added'}!`, 'success');
          this.closeModal(); 
          this.loadAllTimetables(); 
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
  
  deleteTimetable(timetableId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this schedule?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.timetableService.deleteTimetable(timetableId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Schedule deleted successfully.', 'success');
            this.loadAllTimetables(); 
          },
          error: (err) => {
             if(err.status === 200 || err.statusText === 'OK') {
               Swal.fire('Deleted!', 'Schedule deleted successfully.', 'success');
               this.loadAllTimetables();
             } else {
               Swal.fire('Error!', 'Failed to delete.', 'error');
             }
          }
        });
      }
    });
  }

  openUpdateModal(schedule: any) {
    this.selectedTimetableId = schedule.timetableId; 
    
    this.timetableForm.patchValue({
      departmentId: (schedule.departmentId || schedule.department?.departmentId) as any,
      semester: schedule.semester,
      courseId: (schedule.courseId || schedule.course?.courseId) as any,
      teacherId: (schedule.teacherId || schedule.teacher?.teacherId) as any,
      dayOfWeek: schedule.dayOfWeek,
      classTime: schedule.classTime,
      roomNumber: schedule.roomNumber
    });

    const modal = document.getElementById('addTimetableModal'); 
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}