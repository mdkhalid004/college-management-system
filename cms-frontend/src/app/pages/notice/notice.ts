import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NoticeService, Notice } from '../../services/notice.service';

@Component({
  selector: 'app-notice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './notice.html',
  styleUrls: ['./notice.css']
})
export class NoticeComponent implements OnInit {
  noticeService = inject(NoticeService);
  cdr = inject(ChangeDetectorRef);

  noticeList: Notice[] = [];
  isLoading: boolean = false;
  selectedNoticeId: number | null = null;
  isAdmin: boolean = false;

  noticeForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    publishDate: new FormControl('', Validators.required)
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllNotices();
  }

  loadAllNotices() {
    this.isLoading = true;
    this.noticeService.getAllNotices().subscribe({
      next: (data: any) => {
        this.noticeList = Array.isArray(data) ? data : (data.content || []);
        this.noticeList.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }

  openModal() {
    this.selectedNoticeId = null;
    this.noticeForm.reset();
    this.noticeForm.patchValue({
      publishDate: new Date().toISOString().split('T')[0]
    });
    
    const modal = document.getElementById('addNoticeModal');
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedNoticeId = null;
    const modal = document.getElementById('addNoticeModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  saveNotice() {
    if (this.noticeForm.valid) {
      const dataToSave = this.noticeForm.value;

      const request = this.selectedNoticeId 
        ? this.noticeService.updateNotice(this.selectedNoticeId, dataToSave)
        : this.noticeService.addNotice(dataToSave);

      request.subscribe({
        next: () => {
          Swal.fire('Success!', `Notice successfully ${this.selectedNoticeId ? 'updated' : 'published'}!`, 'success');
          this.closeModal(); 
          this.loadAllNotices(); 
        },
        error: (err) => {
          Swal.fire('Error!', 'Failed to save the notice.', 'error');
          console.error(err);
        }
      });
    } else {
      Swal.fire('Warning!', 'Please fill all required fields.', 'warning');
    }
  }
  
  deleteNotice(noticeId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This notice will be removed permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticeService.deleteNotice(noticeId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Notice deleted successfully.', 'success');
            this.loadAllNotices(); 
          },
          error: (err) => {
             if(err.status === 200 || err.statusText === 'OK') {
               Swal.fire('Deleted!', 'Notice deleted successfully.', 'success');
               this.loadAllNotices();
             } else {
               Swal.fire('Error!', 'Failed to delete notice.', 'error');
             }
          }
        });
      }
    });
  }

  openUpdateModal(notice: any) {
    this.selectedNoticeId = notice.noticeId; 
    
    this.noticeForm.patchValue({
      title: notice.title,
      description: notice.description,
      publishDate: notice.publishDate
    });

    const modal = document.getElementById('addNoticeModal'); 
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}