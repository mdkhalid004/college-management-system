import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { 
  DashboardService, 
  DashboardStats, 
  RecentActivity, 
  UpcomingEvent, 
  MonthlyData 
} from '../../services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.css']
})
export class DashboardHomeComponent implements OnInit {
  private apiService = inject(DashboardService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef); 
  stats: DashboardStats = { totalStudents: 0, totalTeachers: 0, totalCourses: 0, totalDepartments: 0 };
  activities: RecentActivity[] = [];
  events: UpcomingEvent[] = [];
  monthlyFees: MonthlyData[] = [];
  monthlyAttendance: MonthlyData[] = [];
  public chart: any;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    this.apiService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error("❌ Stats load fail:", err)
    });
    this.apiService.getRecentActivities().subscribe({
      next: (data) => {
        this.activities = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error("❌ Activity load fail:", err)
    });
    this.apiService.getUpcomingEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error("❌ Events load fail:", err)
    });
    forkJoin({
      fees: this.apiService.getMonthlyFees(),
      attendance: this.apiService.getMonthlyAttendance()
    }).subscribe({
      next: (result) => {
        this.monthlyFees = result.fees;
        this.monthlyAttendance = result.attendance;
        this.createChart();
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error(err)
    });
  }

  createChart() {
    const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const feesValues = shortMonths.map(shortMonth => {
      const found = this.monthlyFees.find(d => d.month.toLowerCase().startsWith(shortMonth.toLowerCase()));
      return found ? found.totalValue : 0; 
    });

    const attendanceValues = shortMonths.map(shortMonth => {
      const found = this.monthlyAttendance.find(d => d.month.toLowerCase().startsWith(shortMonth.toLowerCase()));
      return found ? found.totalValue : 0;
    });

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("myChart", {
      type: 'bar', 
      data: {
        labels: shortMonths, 
        datasets: [
          {
            label: 'Total Fees (₹)',
            data: feesValues,
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderRadius: 4,
            yAxisID: 'y', 
            barPercentage: 0.9, 
            categoryPercentage: 0.8 
          },
          {
            label: 'Attendance (%)',
            data: attendanceValues,
            backgroundColor: 'rgba(255, 159, 64, 0.8)',
            borderRadius: 4,
            yAxisID: 'y1', 
            barPercentage: 0.9,
            categoryPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { type: 'linear', display: true, position: 'left', beginAtZero: true },
          y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, max: 100, grid: { drawOnChartArea: false } }
        }
      }
    });
  }
}