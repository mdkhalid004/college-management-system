import Swal from 'sweetalert2';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService, Event } from '../../services/event.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event.html',
  styleUrls: ['./event.css']
})
export class EventComponent implements OnInit {
  eventService = inject(EventService);
  cdr = inject(ChangeDetectorRef);

  eventList: Event[] = [];
  isLoading: boolean = false;
  selectedEventId: number | null = null;
  isAdmin: boolean = false;

  eventForm = new FormGroup({
    eventName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    eventDate: new FormControl('', Validators.required),
    eventTime: new FormControl('', Validators.required),
    venue: new FormControl('', Validators.required)
  });

  ngOnInit() {
    const role = localStorage.getItem('userRole');
    this.isAdmin = (role === 'ADMIN');

    this.loadAllEvents();
  }

  loadAllEvents() {
    this.isLoading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data: any) => {
        this.eventList = Array.isArray(data) ? data : (data.content || []);
        this.eventList.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => this.isLoading = false
    });
  }

  openModal() {
    this.selectedEventId = null;
    this.eventForm.reset();
    
    const modal = document.getElementById('addEventModal');
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }

  closeModal() {
    this.selectedEventId = null;
    const modal = document.getElementById('addEventModal');
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  }

  saveEvent() {
    if (this.eventForm.valid) {
      const dataToSave = this.eventForm.value;
      if (dataToSave.eventTime && dataToSave.eventTime.length === 5) {
        dataToSave.eventTime = dataToSave.eventTime + ':00';
      }

      const request = this.selectedEventId 
        ? this.eventService.updateEvent(this.selectedEventId, dataToSave)
        : this.eventService.addEvent(dataToSave);

      request.subscribe({
        next: () => {
          Swal.fire('Success!', `Event successfully ${this.selectedEventId ? 'updated' : 'scheduled'}!`, 'success');
          this.closeModal(); 
          this.loadAllEvents(); 
        },
        error: (err) => {
          Swal.fire('Error!', 'Failed to save the event.', 'error');
          console.error(err);
        }
      });
    } else {
      Swal.fire('Warning!', 'Please fill all required fields.', 'warning');
    }
  }
  
  deleteEvent(eventId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This event will be cancelled/deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Event deleted successfully.', 'success');
            this.loadAllEvents(); 
          },
          error: (err) => {
             if(err.status === 200 || err.statusText === 'OK') {
               Swal.fire('Deleted!', 'Event deleted successfully.', 'success');
               this.loadAllEvents();
             } else {
               Swal.fire('Error!', 'Failed to delete event.', 'error');
             }
          }
        });
      }
    });
  }

  openUpdateModal(event: any) {
    this.selectedEventId = event.eventId; 
    let formattedTime = event.eventTime;
    if (formattedTime && formattedTime.length === 8) {
      formattedTime = formattedTime.substring(0, 5); 
    }

    this.eventForm.patchValue({
      eventName: event.eventName,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: formattedTime,
      venue: event.venue
    });

    const modal = document.getElementById('addEventModal'); 
    if (modal) {
      modal.style.display = 'block';
      setTimeout(() => modal.classList.add('show'), 10);
    }
  }
}