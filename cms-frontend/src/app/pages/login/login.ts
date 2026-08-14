import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private loginService: LoginService, private router: Router) {}

  onLogin() {
    console.log('Login button clicked with data:', this.loginData);

    // Backend Login API call
    this.loginService.login(this.loginData).subscribe({
      next: (response: any) => {
        console.log('Login Success Response:', response);
        
        // Token save karein (Backend response ke structure ke mutabiq)
        const token = response.token || response.accessToken || response;
        if (token) {
          localStorage.setItem('authToken', token);

          // 🌟 Pehle response se role check karein, agar na ho toh JWT token decode karke nikalein
          let role = response.role || response.userRole || response.user?.role;
          
          if (!role) {
            try {
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
              
              const decodedToken = JSON.parse(jsonPayload);
              console.log('Decoded Token:', decodedToken);
              
              // Token ke andar se role ya email ke base par role set karna
              role = decodedToken.role || decodedToken.authorities?.[0] || (decodedToken.sub === 'mdkhalid952338@gmail.com' ? 'ADMIN' : 'STUDENT');
            } catch (e) {
              console.error('Error decoding token for role', e);
            }
          }

          if (role) {
            localStorage.setItem('userRole', role);
          }
        }

        // 🌟 Avatar save karein taaki dashboard khulte hi turant dikhe
        const avatar = response.avatar || response.adminAvatar || response.user?.avatar;
        if (avatar) {
          localStorage.setItem('adminAvatar', avatar);
        }

        // Dashboard par bhej dein
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login Failed Error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid Email or Password! Please check your credentials.'
        });
      }
    });
  }

  // Password visibility toggle variable
  showPassword: boolean = false;

  // Password toggle function
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  } 
}