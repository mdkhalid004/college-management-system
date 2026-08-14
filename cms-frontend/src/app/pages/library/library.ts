import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { LibraryService, Library } from '../../services/library.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent implements OnInit {
  libraryService = inject(LibraryService);
  cdr = inject(ChangeDetectorRef);

  libraryList: Library[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  selectedBookId: number | null = null;
  isAdmin: boolean = false;

  libraryForm = new FormGroup({
    name: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    isbn: new FormControl('', Validators.required),
    issueDate: new FormControl(''),
    returnDate: new FormControl(''),
    fine: new FormControl(0, [Validators.required, Validators.min(0)])
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllLibraryRecords();
  }

  loadAllLibraryRecords() {
    this.isLoading = true;
    this.errorMessage = '';

    this.libraryService.getAllLibraryRecords().subscribe({
      next: (data: any) => {
        this.libraryList = Array.isArray(data) ? data : (data.content || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Backend se library records laane mein error aayi!';
        this.cdr.detectChanges();
      }
    });
  }

  openModal() {
    this.selectedBookId = null;
    this.libraryForm.reset();
    this.libraryForm.patchValue({ 
      fine: 0,
      issueDate: new Date().toISOString().split('T')[0]
    });
    
    const modal = document.getElementById('addLibraryModal');
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedBookId = null;
    const modal = document.getElementById('addLibraryModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  saveLibrary() {
    if (this.libraryForm.valid) {
      const rawData = this.libraryForm.value;
      
      const libraryDataToSave = {
        name: rawData.name,
        author: rawData.author,
        isbn: rawData.isbn,
        issueDate: rawData.issueDate || null,
        returnDate: rawData.returnDate || null,
        fine: Number(rawData.fine)
      };

      if (this.selectedBookId) {
        this.libraryService.updateLibraryRecord(this.selectedBookId, libraryDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'The book record has been successfully updated!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.selectedBookId = null;
            this.libraryForm.reset();
            this.closeModal(); 
            this.loadAllLibraryRecords(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to update the book record. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33'
            });
            console.error("Backend Error:", err);
          }
        });
      } else {
        this.libraryService.addLibraryRecord(libraryDataToSave).subscribe({
          next: () => {
            Swal.fire({
              title: 'Success!',
              text: 'The book record has been successfully added!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.libraryForm.reset();
            this.closeModal(); 
            this.loadAllLibraryRecords(); 
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add the book record. Please try again.',
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
  
  deleteLibrary(bookId: number) {
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
        this.libraryService.deleteLibraryRecord(bookId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'The book record has been successfully deleted!',
              icon: 'success',
              confirmButtonColor: '#2d63ed'
            });
            this.loadAllLibraryRecords(); 
          },
          error: (err) => {
            if (err.status === 200 || err.status === 204 || err.statusText === 'OK') {
              Swal.fire({
                title: 'Deleted!',
                text: 'The book record has been successfully deleted!',
                icon: 'success',
                confirmButtonColor: '#2d63ed'
              });
              this.loadAllLibraryRecords();
            } else {
              Swal.fire('Error!', 'Failed to delete the book record.', 'error');
              console.error(err);
            }
          }
        });
      }
    });
  }

  openUpdateModal(book: any) {
    this.selectedBookId = book.bookId; 
    
    this.libraryForm.patchValue({
      name: book.name,
      author: book.author,
      isbn: book.isbn,
      issueDate: book.issueDate,
      returnDate: book.returnDate,
      fine: book.fine
    });

    const modal = document.getElementById('addLibraryModal'); 
    if (modal) {
      modal.style.display = 'block';
      modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}