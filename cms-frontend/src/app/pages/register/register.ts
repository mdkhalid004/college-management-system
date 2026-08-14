import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '', 
    password: '',
    role: 'STUDENT'
  };

  constructor(private registerService: RegisterService, private router: Router) {}

  onRegister() {
    console.log('Registering data:', this.registerData);

    this.registerService.register(this.registerData).subscribe({
      next: (response: any) => {
        console.log('Registration Success:', response);
        alert(response.message || 'Registration successful! Ab aap login kar sakte hain.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration Failed:', err);
        const errorMessage = err.error?.error || err.error?.message || 'Registration failed! Kuch galat ho gaya hai.';
        alert(errorMessage);
      }
    });
  }
showPassword: boolean = false;
showConfirmPassword: boolean = false;
togglePasswordVisibility(field: 'password' | 'confirm') {
  if (field === 'password') {
    this.showPassword = !this.showPassword;
  } else {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
}