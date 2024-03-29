import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { ADMIN, HR } from '../../../lms/constants/roles.constant';
import { ToasterService } from '../../../lms/services/toaster.service';
import { TimeoffAddDialogComponent } from '../../components/timeoff-add-dialog/timeoff-add-dialog.component';
import { formatDate } from '../../helpers/formatDate';
import { Notification } from '../../models/notification.model';
import { Timeoff } from '../../models/timeoff.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-timeoffs',
  templateUrl: './timeoffs.component.html',
  styleUrls: ['./timeoffs.component.css'],
})
export class TimeoffsComponent implements OnInit {
  timeoffs: Timeoff[]; // to be used in dialog
  timeoffHistory: MatTableDataSource<Timeoff> =
    new MatTableDataSource<Timeoff>();
  isOpen: boolean = false;
  newNotification: Notification;
  isAdmin: boolean;
  isHR: boolean;
  shouldDisplay: boolean;
  displayedColumns: string[] = ['#', 'startdate', 'status'];
  page: number = 1;
  limit: number = 7;
  total: number = 7;
  displayedOptionColumns: string[] = ['name', 'action'];
  notificationItems: any;

  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;

  constructor(
    private toaster: ToasterService,
    private employeeService: EmployeeSummaryService,
    private dialog: MatDialog
  ) {
    this.isAdmin = this.currUser['type'] === ADMIN;
    this.isHR = this.currUser['type'] === HR;
    this.shouldDisplay = this.isHR || this.isAdmin;

    this.newNotification = {
      userId: '',
      content: '',
    };

    if (this.isAdmin) {
      this.displayedColumns.splice(2, 0, 'offDays');
      this.displayedColumns.splice(1, 0, 'user');
    } else {
      this.displayedColumns.splice(2, 0, 'endDate');
    }

    if (this.shouldDisplay) {
      this.displayedColumns.splice(this.displayedColumns.length, 0, 'action');
    }
  }
  ngOnInit(): void {
    this.getEmlpoyeeTimeoffs();
    console.log(this.isAdmin, this.isHR, this.shouldDisplay);
  }
  currUser = this.employeeService.getUser();
  formatedDate(date) {
    return formatDate(date);
  }

  getEndDate(date: Date, days: number) {
    var someDate = new Date(date);
    var result = someDate.setDate(someDate.getDate() + days);

    return new Date(result);
  }

  deleteRequest(toff: Timeoff) {
    return this.employeeService.deleteTimeoff(toff._id).subscribe((result) => {
      console.log(result);
      this.getEmlpoyeeTimeoffs();
      this.toaster.success('Deleted Successfully');
    });
  }
  getEmlpoyeeTimeoffs() {
    return this.isAdmin || this.isHR
      ? this.employeeService
          .getAllTimeoffs(this.page, this.limit)
          .subscribe((result) => {
            this.timeoffHistory = result['response'][0]['totalData'];
            this.timeoffs = result['response'][0]['totalData'];
            this.total = result['response'][0]['totalCount'][0]['count'];
            this.isLoading = false;
            console.log(
              '⚡ TimeoffsComponent  this.timeoffHistory',
              this.timeoffHistory
            );
          })
      : this.employeeService
          .getEmployeeTimeoffHistory(this.page, this.limit)
          .subscribe((result) => {
            this.timeoffHistory = result['response'][0]['totalData'];
            this.total = result['response'][0]['totalCount'][0]['count'];
            this.timeoffs = result['response'][0]['totalData'];
            this.isLoading = false;
            console.log(
              '⚡ TimeoffsComponent  this.timeoffHistory',
              this.timeoffHistory
            );
          });
  }

  changePage(event) {
    console.log(event);
    this.page = event;
    this.getEmlpoyeeTimeoffs();
  }
  // for hr agent

  updateStatus(timeoff) {
    this.employeeService
      .updateTimeoffStatus({ status: timeoff.status }, timeoff._id)
      .subscribe(
        (result) => {
          console.log(
            result,
            result['response']['userId'],
            result['response']['content']
          );
          this.toaster.success(result['message']);
          this.createNotification({
            userId: result['response']['userId'],
            content: `Timeoff #${timeoff._id} has been ${timeoff.status}`,
          });
          this.getNotifications();
          // this.newNotification.userId = result['response']['userId'];
          // this.newNotification.content = result['response']['content'];
        },
        (error) => this.toaster.error(error['error']['message'])
      );
  }

  getNotifications() {
    this.employeeService.getUserNotifications().subscribe((result) => {
      this.notificationItems = result['response'][0]['totalData'];
      console.log(
        '🔕 ~ file: app.component.ts ~ line 47 getUserNotifications',
        result
      );
    });
  }

  createNotification(body) {
    return this.employeeService.createNotification(body).subscribe((result) => {
      console.log('🔕  ~ result', result);
    });
  }
  // for admin
  updateTimeoffRequest(timeoff) {
    return this.employeeService.updateTimeoff(timeoff._id, timeoff).subscribe(
      (result) => {
        console.log(result);
        this.toaster.success(result['message']);
      },
      (error) => this.toaster.error(error['error']['message'])
    );
  }

  openDialog(event, operation, toff_id) {
    this.isOpen = true;
    const dialogRef = this.dialog.open(TimeoffAddDialogComponent, {
      height: 'auto',
      width: 'auto',
      data: {
        timeoffRequest:
          operation === 'add'
            ? {
                startDate: null,
                offDays: 0,
              }
            : this.timeoffs.filter((toff) => toff._id === toff_id)[0],
        operation: operation,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.isOpen = false;
      this.getEmlpoyeeTimeoffs();
    });
  }
}
