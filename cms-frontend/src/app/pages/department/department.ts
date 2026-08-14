import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService, Department } from '../../services/department.service'; 

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department.html',
  styleUrls: ['./department.css']
})
export class DepartmentComponent implements OnInit {
  departmentService = inject(DepartmentService);
  cdr = inject(ChangeDetectorRef);

  departments: Department[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';
  selectedDepartmentId: number | null = null;
  isAdmin: boolean = false;
  departmentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    hod: new FormControl('', Validators.required),
    totalTeachers: new FormControl(0, [Validators.required, Validators.min(0)]),
    totalStudents: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllDepartments();
  }

  loadAllDepartments() {
    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.getAllDepartments().subscribe({
      next: (data: any) => {
        this.departments = Array.isArray(data) ? data : (data.content || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Backend se departments laane mein error aayi!';
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.selectedDepartmentId = null;
    this.departmentForm.reset();
    this.departmentForm.patchValue({ totalTeachers: 0, totalStudents: 0 }); 
    
    const modal = document.getElementById('addDepartmentModal');
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedDepartmentId = null;
    const modal = document.getElementById('addDepartmentModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }
  saveDepartment() {
    if (this.departmentForm.valid) {
      const rawData = this.departmentForm.value;
      
      const departmentDataToSave = {
        name: rawData.name,
        hod: rawData.hod,
        totalTeachers: Number(rawData.totalTeachers),
        totalStudents: Number(rawData.totalStudents)
      };

      if (this.selectedDepartmentId) {
        this.departmentService.updateDepartment(this.selectedDepartmentId, departmentDataToSave as any).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'The department has been successfully updated!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.selectedDepartmentId = null;
            this.departmentForm.reset();
            this.closeModal(); 
            this.loadAllDepartments(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update the department. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Backend Error:", err);
          }
        });
      } else {
        this.departmentService.addDepartment(departmentDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'The department has been successfully added!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.departmentForm.reset();
            this.closeModal(); 
            this.loadAllDepartments(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add the department. Please try again.',
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
  deleteDepartment(departmentId: number) {
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
        this.departmentService.deleteDepartment(departmentId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The department has been successfully deleted!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.loadAllDepartments(); 
          },
          error: (err) => {
            if (err.status === 200 || err.status === 204 || err.statusText === 'OK') {
              Swal.fire({
                title: 'Deleted!',
                text: 'The department has been successfully deleted!',
                icon: 'success',
                confirmButtonColor: '#2d63ed'
              });
              this.loadAllDepartments();
            } else {
              Swal.fire('Error!', 'Failed to delete the department.', 'error');
              console.error(err);
            }
          }
        });
      }
    });
  }
  openUpdateModal(department: any) {
    this.selectedDepartmentId = department.departmentId; 
    
    this.departmentForm.patchValue({
      name: department.name,
      hod: department.hod,
      totalTeachers: department.totalTeachers,
      totalStudents: department.totalStudents
    });

    const modal = document.getElementById('addDepartmentModal'); 
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}