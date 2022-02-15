import { Component, OnInit } from '@angular/core';
import { Contract } from '../../models/contract.model';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import moment from 'moment';
import { Interview } from '../../models/interview.model';
import { Timesheet } from '../../models/timesheet.model';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-emplyee-profile',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  constructor(private summaryService: EmployeeSummaryService) {}
  public currUser = this?.summaryService?.getUser();

  public files: File[];
  public userFile: File;
  public contract: Contract;
  public interviews: Interview[];
  public timesheets: Timesheet[];

  ngOnInit(): void {
    // this.getFiles();
    this.getEmployeeFileDetails();
    this.getEmployeeActiveContract();

    this.getEmployeeInterviews();
    this.getTimeSheets();
    console.log('🤦 EmplyeeProfileComponent ~ currUser', this.currUser);
  }

  getTimeSheets() {
    this.summaryService.getTimeSheets().subscribe((result) => {
      this.timesheets = result['response'];
      console.log('⚡ this.timesheets', result);
    });
  }

  formatDate(date) {
    let newDate = moment.utc(date)?.format('MMMM Do YYYY');
    return newDate;
  }

  getFiles() {
    this.summaryService.getFiles().subscribe((result) => {
      this.files = result['response'][0]?.totalData;
      console.log('✅ this.summaryService.getFiles ~ ', this.files);
    });
  }

  getEmployeeFileDetails() {
    this.summaryService.getFileDetails().subscribe((result) => {
      this.userFile = result['response'][0];
      console.log(
        '✅ this.summaryService.getEmployeeFileDetails ~ ',
        this.userFile
      );
    });
  }

  getEmployeeActiveContract() {
    let today = new Date();
    return this.summaryService.getContractsWithSalary().subscribe((result) => {
      this.contract = result['response'].filter(
        (c) => new Date(c.endDate) >= new Date(today)
      )[0];
      console.log(this.contract);
    });
  }

  getEmployeeInterviews() {
    let today = new Date();
    this.summaryService.getInterviews().subscribe((result) => {
      this.interviews = result['response'].filter(
        (intr) => new Date(intr.date) >= new Date(today)
      );

      console.log(
        '⚡ this.interview',
        result['response'].filter(
          (intr) => new Date(intr.date) >= new Date(today)
        )
      );
    });
  }
}
