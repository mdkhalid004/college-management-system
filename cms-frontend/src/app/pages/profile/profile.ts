import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 *ngIf ke liye zaruri hai

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './profile.html', // (Apni file ka sahi naam check kar lena)
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  
  // Edit mode track karne ke liye
  isEditing: boolean = false;

  // Edit/Save button click hone par ye chalega
  toggleEdit() {
    this.isEditing = !this.isEditing;
    
    if(!this.isEditing) {
      console.log("Data Saved! (Backend API will be called here later)");
    }
  }
}