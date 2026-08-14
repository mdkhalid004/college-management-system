import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TeacherService, Teacher } from '../../services/teacher.service';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher.html',
  styleUrls: ['./teacher.css']
})
export class TeacherComponent implements OnInit {
  teacherService = inject(TeacherService);
  cdr = inject(ChangeDetectorRef);

  teachers: Teacher[] = [];
  departmentList: any[] = []; 

  isLoading: boolean = false;
  errorMessage: string = '';
  isAdmin: boolean = false;
  selectedTeacherId: number | null = null;
  teacherForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    departmentId: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    qualification: new FormControl('', Validators.required),
    salary: new FormControl('', [Validators.required, Validators.min(0)]),
    joiningDate: new FormControl('', Validators.required),
    address: new FormControl('')
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllTeachers();
    this.loadDepartments();    
  }

  loadDepartments() {
    this.teacherService.getAllDepartments().subscribe({
      next: (data: any) => {
        this.departmentList = Array.isArray(data) ? data : (data.content || []);
      },
      error: (err) => console.error('❌ Departments load nahi hue:', err)
    });
  }

  loadAllTeachers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.teacherService.getAllTeachers().subscribe({
      next: (data: any) => {
        this.teachers = Array.isArray(data) ? data : (data.content || []);
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
    this.selectedTeacherId = null; 
    this.teacherForm.reset();
    this.teacherForm.patchValue({ departmentId: '' }); 
    
    const modal = document.getElementById('addTeacherModal');
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedTeacherId = null;
    const modal = document.getElementById('addTeacherModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }
  saveTeacher() {
    if (this.teacherForm.valid) {
      const rawData = this.teacherForm.value;
      
      const teacherDataToSave = {
        name: rawData.name,
        phone: String(rawData.phone),
        departmentId: Number(rawData.departmentId), 
        subject: rawData.subject,
        qualification: rawData.qualification,
        salary: Number(rawData.salary),
        joiningDate: rawData.joiningDate,
        address: rawData.address || 'Not Provided'
      };

      if (this.selectedTeacherId) {
        this.teacherService.updateTeacher(this.selectedTeacherId, teacherDataToSave as any).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'The teacher has been successfully updated!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.selectedTeacherId = null;
            this.teacherForm.reset();
            this.closeModal(); 
            this.loadAllTeachers(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update the teacher. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Backend Error:", err);
          }
        });
      } else {
        this.teacherService.addTeacher(teacherDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'The teacher has been successfully added!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.teacherForm.reset();
            this.closeModal(); 
            this.loadAllTeachers(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add the teacher. Please try again.',
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
  deleteTeacher(teacherId: number) {
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
        this.teacherService.deleteTeacher(teacherId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The teacher has been successfully deleted!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.loadAllTeachers(); 
          },
          error: (err) => {
            if (err.status === 200 || err.status === 204 || err.statusText === 'OK') {
              Swal.fire({
                title: 'Deleted!',
                text: 'The teacher has been successfully deleted!',
                icon: 'success',
                confirmButtonColor: '#2d63ed'
              });
              this.loadAllTeachers();
            } else {
              Swal.fire('Error!', 'Failed to delete the teacher.', 'error');
              console.error(err);
            }
          }
        });
      }
    });
  }
  openUpdateModal(teacher: any) {
    this.selectedTeacherId = teacher.teacherId; 
    
    this.teacherForm.patchValue({
      name: teacher.name,
      phone: teacher.phone,
      departmentId: teacher.departmentId as any,
      subject: teacher.subject,
      qualification: teacher.qualification,
      salary: teacher.salary,
      joiningDate: teacher.joiningDate,
      address: teacher.address
    });

    const modal = document.getElementById('addTeacherModal'); 
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}