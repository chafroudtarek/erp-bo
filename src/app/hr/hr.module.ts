import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './pages/summary/summary.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { EmployeeSummaryService } from './services/employee-summary.service';
import { HrdashboardComponent } from './pages/hrdashboard/hrdashboard.component';
import { HRRoutingModule } from './hr-routing.module';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CollaboratorsComponent } from './pages/collaborators/collaborators.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    SummaryComponent,
    InterviewsComponent,
    HrdashboardComponent,
    CollaboratorsComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, HRRoutingModule, RouterModule, SharedModule],
  exports: [
    SummaryComponent,
    InterviewsComponent,
    HrdashboardComponent,
    CollaboratorsComponent,
    ProfileComponent,
  ],
  providers: [
    EmployeeSummaryService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class HRModule {}