import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FeesService, Fees } from '../../services/fees.service'; // Path verify kar lena

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fees.html',
  styleUrls: ['./fees.css']
})
export class FeesComponent implements OnInit {
  feesService = inject(FeesService);
  cdr = inject(ChangeDetectorRef);

  feesList: Fees[] = [];
  studentList: any[] = []; 
  
  // Enum/Dropdown values for Payment Mode
  paymentModes: string[] = ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'CHEQUE'];

  isLoading: boolean = false;
  errorMessage: string = '';

  // 🔴 Track karega ki nayi fees add ho rahi hai ya edit
  selectedReceiptId: number | null = null;

  // 🌟 Role-Based Access Control variable
  isAdmin: boolean = false;

  // 🔴 Reactive Form: Fees Entity ke fields
  feesForm = new FormGroup({
    receiptNo: new FormControl('', Validators.required),
    studentId: new FormControl('', Validators.required),
    totalFees: new FormControl(0, [Validators.required, Validators.min(0)]),
    paidAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
    dueAmount: new FormControl(0, [Validators.required, Validators.min(0)]),
    paymentDate: new FormControl('', Validators.required),
    paymentMode: new FormControl('', Validators.required),
    transactionId: new FormControl('') // Optional for CASH
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllFees();
    this.loadStudents();

  // 💡 Pro-tip: Auto-calculate Due Amount jab user total ya paid amount enter kare
    this.feesForm.valueChanges.subscribe(values => {
      // != null check se null aur undefined dono filter ho jayenge
      if (values.totalFees != null && values.paidAmount != null) {
        // TypeScript error hatane ke liye explicitly Number() use kiya hai
        const calculatedDue = Number(values.totalFees) - Number(values.paidAmount);
        
        // Infinite loop na bane isliye { emitEvent: false } use kiya hai
        if (this.feesForm.get('dueAmount')?.value !== calculatedDue) {
           this.feesForm.patchValue({ dueAmount: calculatedDue }, { emitEvent: false });
        }
      }
    });
  }

  // 💡 Table mein student ka naam safely display karne ke liye helper method
  getStudentDisplay(fee: any): string {
    // 1. Agar backend direct 'studentName' bhej raha hai
    if (fee.studentName) return fee.studentName;
    
    // 2. Agar backend nested 'student' object bhej raha hai
    if (fee.student) {
      if (fee.student.name) return fee.student.name;
      if (fee.student.firstName) return `${fee.student.firstName} ${fee.student.lastName || ''}`.trim();
    }

    // 3. Agar backend ne sirf 'studentId' bheja hai, toh hum 'studentList' se naam dhoondhenge!
    if (fee.studentId && this.studentList.length > 0) {
      const foundStudent = this.studentList.find(s => s.studentId === fee.studentId || s.id === fee.studentId);
      if (foundStudent) {
        return foundStudent.name || `${foundStudent.firstName || ''} ${foundStudent.lastName || ''}`.trim() || `Student #${fee.studentId}`;
      }
      return `Student #${fee.studentId}`;
    }

    // 4. Kuch na mile toh ID dikha do
    return `Student #${fee.studentId || fee.receiptId || 'N/A'}`;
  }

  // Student Dropdown ke liye data load karna
  loadStudents() {
    this.feesService.getAllStudents().subscribe({
      next: (data: any) => {
        this.studentList = Array.isArray(data) ? data : (data.content || []);
      },
      error: (err) => console.error('❌ Students load nahi hue:', err)
    });
  }

  // Saare Fees records load karna
  loadAllFees() {
    this.isLoading = true;
    this.errorMessage = '';

    this.feesService.getAllFees().subscribe({
      next: (data: any) => {
        this.feesList = Array.isArray(data) ? data : (data.content || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Backend se fees data laane mein error aayi!';
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.selectedReceiptId = null; // Null matlab naya record
    this.feesForm.reset();
    
    // Default values set karna
    this.feesForm.patchValue({ 
      studentId: '', 
      paymentMode: '',
      totalFees: 0,
      paidAmount: 0,
      dueAmount: 0,
      paymentDate: new Date().toISOString().split('T')[0] // Aaj ki date default
    }); 
    
    const modal = document.getElementById('addFeesModal');
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedReceiptId = null;
    const modal = document.getElementById('addFeesModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  // 🔴 SAVE / UPDATE FUNCTION
  saveFees() {
    if (this.feesForm.valid) {
      const rawData = this.feesForm.value;
      
      const feesDataToSave = {
        receiptNo: rawData.receiptNo,
        studentId: Number(rawData.studentId),
        totalFees: Number(rawData.totalFees),
        paidAmount: Number(rawData.paidAmount),
        dueAmount: Number(rawData.dueAmount),
        paymentDate: rawData.paymentDate,
        paymentMode: rawData.paymentMode,
        transactionId: rawData.transactionId || null
      };

      if (this.selectedReceiptId) {
        // --- UPDATE API CALL ---
        this.feesService.updateFees(this.selectedReceiptId, feesDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'The fees record has been successfully updated!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.selectedReceiptId = null;
            this.feesForm.reset();
            this.closeModal(); 
            this.loadAllFees(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update the fees record. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Backend Error:", err);
          }
        });
      } else {
        // --- CREATE API CALL ---
        this.feesService.addFees(feesDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'The fees record has been successfully added!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.feesForm.reset();
            this.closeModal(); 
            this.loadAllFees(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add the fees record. Please try again.',
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
  
  // 🔴 DELETE FUNCTION
  deleteFees(receiptId: number) {
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
        this.feesService.deleteFees(receiptId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The fees record has been successfully deleted!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.loadAllFees(); 
          },
          error: (err) => {
            if (err.status === 200 || err.status === 204 || err.statusText === 'OK') {
              Swal.fire({
                title: 'Deleted!',
                text: 'The fees record has been successfully deleted!',
                icon: 'success',
                confirmButtonColor: '#2d63ed'
              });
              this.loadAllFees();
            } else {
              Swal.fire('Error!', 'Failed to delete the fees record.', 'error');
              console.error(err);
            }
          }
        });
      }
    });
  }

  // 🔴 EDIT MODAL FUNCTION
  openUpdateModal(fee: any) {
    this.selectedReceiptId = fee.receiptId; 
    
    this.feesForm.patchValue({
      receiptNo: fee.receiptNo,
      studentId: (fee.studentId || fee.student?.studentId) as any,
      totalFees: fee.totalFees,
      paidAmount: fee.paidAmount,
      dueAmount: fee.dueAmount,
      paymentDate: fee.paymentDate,
      paymentMode: fee.paymentMode,
      transactionId: fee.transactionId
    });

    const modal = document.getElementById('addFeesModal'); 
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}