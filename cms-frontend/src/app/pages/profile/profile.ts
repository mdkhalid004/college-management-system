import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './profile.html', 
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  isEditing: boolean = false;
  toggleEdit() {
    this.isEditing = !this.isEditing;
    
    if(!this.isEditing) {
      console.log("Data Saved! (Backend API will be called here later)");
    }
  }
}