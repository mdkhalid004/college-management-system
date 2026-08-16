import Swal from 'sweetalert2';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, filter } from 'rxjs/operators';
import { DashboardService, SearchResultDto, Settings } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RouterLink], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'] 
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  private router = inject(Router); 
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  isProfileMenuOpen: boolean = false;
  isNotificationMenuOpen: boolean = false;
  searchText: string = '';
  isSidebarOpen: boolean = false;
  isProfileModalOpen: boolean = false;
  isSettingsModalOpen: boolean = false;
  profileActiveTab: 'view' | 'edit' | 'password' = 'view';

  avatarFileName: string = 'No file chosen';

  adminProfile = {
    name: '',
    email: '',
    phone: '',
    role: '',
    avatar: 'A'
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  settingsData: Settings = {
    isDarkMode: false,
    academicYear: '2026-2027'
  };

  searchResults: SearchResultDto[] = [];
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private routerSubscription!: Subscription;

  notifications = [
    { message: 'New student John Doe registered', time: '5 mins ago', icon: 'bi-person-plus text-primary' },
    { message: 'Server update completed successfully', time: '1 hour ago', icon: 'bi-check-circle text-success' }
  ];

  ngOnInit(): void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isProfileMenuOpen = false;
      this.isNotificationMenuOpen = false;
      this.closeSidebar();
    });

    const cachedAvatar = localStorage.getItem('adminAvatar');
    if (cachedAvatar && cachedAvatar.length > 10) {
      this.adminProfile.avatar = cachedAvatar;
    }

    const savedFileName = localStorage.getItem('adminAvatarName');
    if (savedFileName) {
      this.avatarFileName = savedFileName;
    }

    const localDarkMode = localStorage.getItem('isDarkMode');
    if (localDarkMode !== null) {
      this.settingsData.isDarkMode = localDarkMode === 'true';
      this.applyTheme(this.settingsData.isDarkMode);
    }

    this.loadAdminProfile();
    this.loadSettings();

    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300), 
      distinctUntilChanged(), 
      switchMap(query => {
        if (!query || query.trim() === '') {
          this.isSearching = false;
          return of([]);
        }
        this.isSearching = true;
        return this.dashboardService.searchGlobal(query).pipe(
          catchError(() => {
            this.isSearching = false;
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.searchResults = results;
      this.isSearching = false;
    });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.updateBodyScroll(false);
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.isProfileMenuOpen = false;
    this.isNotificationMenuOpen = false;
    if (this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  toggleSidebar(event?: Event) {
    event?.stopPropagation();
    this.isSidebarOpen = !this.isSidebarOpen;
    this.updateBodyScroll(this.isSidebarOpen);
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.updateBodyScroll(false);
  }

  onModuleClick(event?: Event) {
    event?.stopPropagation();
    this.isProfileMenuOpen = false;
    this.isNotificationMenuOpen = false;
    this.closeSidebar();
  }

  private updateBodyScroll(isLocked: boolean) {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }

  loadAdminProfile() {
    this.dashboardService.getAdminProfile().subscribe({
      next: (res) => {
        this.adminProfile = res;
        if (res.avatar && res.avatar.length > 10) {
          localStorage.setItem('adminAvatar', res.avatar);
        }
      },
      error: (err) => {
        console.error('Failed to fetch admin profile:', err);
      }
    });
  }

  loadSettings() {
    this.dashboardService.getSettings().subscribe({
      next: (res) => {
        if (res) {
          this.settingsData = res;
          const localDark = localStorage.getItem('isDarkMode') === 'true';
          if (localDark) {
            this.settingsData.isDarkMode = true;
          }
          this.applyTheme(this.settingsData.isDarkMode); 
        }
      },
      error: (err) => {
        console.error('Failed to load settings:', err);
        const localDark = localStorage.getItem('isDarkMode') === 'true';
        this.settingsData.isDarkMode = localDark;
        this.applyTheme(localDark);
      }
    });
  }

  onDarkModeToggle() {
    localStorage.setItem('isDarkMode', String(this.settingsData.isDarkMode));
    this.applyTheme(this.settingsData.isDarkMode);
  }

  applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  saveSettings() {
    const userSelectedDarkMode = this.settingsData.isDarkMode;
    localStorage.setItem('isDarkMode', String(userSelectedDarkMode));
    localStorage.setItem('academicYear', this.settingsData.academicYear);
    this.applyTheme(userSelectedDarkMode);

    this.dashboardService.updateSettings(this.settingsData).subscribe({
      next: (res) => {
        if (res) {
          this.settingsData = res;
          this.settingsData.isDarkMode = userSelectedDarkMode;
          localStorage.setItem('isDarkMode', String(userSelectedDarkMode));
          this.applyTheme(userSelectedDarkMode);
        }
        Swal.fire({
          icon: 'success',
          title: 'Settings Saved!',
          text: 'System configurations updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        this.isSettingsModalOpen = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        Swal.fire({
          icon: 'success',
          title: 'Settings Saved Locally!',
          text: 'Configurations updated successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        this.isSettingsModalOpen = false;
        this.cdr.detectChanges();
        console.error('Backend save settings error:', err);
      }
    });
  }

  toggleProfileMenu(event?: Event) { 
    event?.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen; 
    this.isNotificationMenuOpen = false; 
  }
  
  toggleNotificationMenu(event?: Event) { 
    event?.stopPropagation();
    this.isNotificationMenuOpen = !this.isNotificationMenuOpen; 
    this.isProfileMenuOpen = false; 
  }
  
  goToProfile() { 
    this.isProfileModalOpen = true; 
    this.isProfileMenuOpen = false;
    this.profileActiveTab = 'view';
    this.loadAdminProfile();
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }

  cancelPassword() {
    this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    this.profileActiveTab = 'view';
  }

  saveProfileChanges() {
    const profilePayload: any = {
      ...this.adminProfile,
      phone: this.adminProfile.phone && this.adminProfile.phone.trim() !== '' ? this.adminProfile.phone : null
    };

    this.dashboardService.updateAdminProfile(profilePayload).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully!',
          timer: 2000,
          showConfirmButton: false
        });
        this.adminProfile = res;
        if (res.avatar && res.avatar.length > 10) {
          localStorage.setItem('adminAvatar', res.avatar);
        }
        this.isProfileModalOpen = false;
        this.profileActiveTab = 'view';
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to update profile!'
        });
        console.error(err);
      }
    });
  }

  updatePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'New password and confirm password do not match!'
      });
      return;
    }

    const payload = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    this.dashboardService.changePassword(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password changed successfully!',
          timer: 2000,
          showConfirmButton: false
        });
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.isProfileModalOpen = false;
        this.profileActiveTab = 'view';
        this.cdr.detectChanges();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to change password. Please check your current password!'
        });
        console.error(err);
      }
    });
  }

  openSettings() {
    this.isSettingsModalOpen = true;
    this.isProfileMenuOpen = false;
    this.loadSettings();
  }

  closeSettings() {
    this.isSettingsModalOpen = false;
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchText = query;

    if (!query || query.trim() === '') {
      this.searchResults = [];
      this.isSearching = false;
    }

    this.searchSubject.next(query);
  }

  onSelectResult(result: SearchResultDto) {
    this.searchText = '';
    this.searchResults = [];
    this.router.navigate([result.redirectUrl]);
  }

  onSearch() {
    if (this.searchText.trim() !== '') {
      this.dashboardService.searchGlobal(this.searchText).subscribe(res => {
        this.searchResults = res;
      });
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminAvatar'); 
    localStorage.removeItem('adminAvatarName'); 
    this.isProfileMenuOpen = false;
    this.router.navigate(['/login']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.avatarFileName = file.name; 
      localStorage.setItem('adminAvatarName', file.name); 

      const reader = new FileReader();
      reader.onload = () => {
        this.adminProfile.avatar = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}