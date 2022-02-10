import { Component, OnInit } from '@angular/core';
import { Contract } from '../../models/contract.model';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import moment from 'moment';
import { Interview } from '../../models/interview.model';
import { Timesheet } from '../../models/timesheet.model';

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
  public interview: Interview;
  public timesheets: Timesheet[];

  ngOnInit(): void {
    // this.getFiles();
    this.getEmployeeFileDetails();
    this.getEmployeeContract();

    this.getEmployeeInterview();
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

  getEmployeeContract() {
    this.summaryService.getContracts().subscribe((result) => {
      this.contract = result['response'][0];
      console.log('⚡getEmployeeContract :', this.contract);
    });
  }

  getEmployeeInterview() {
    this.summaryService.getInterviews().subscribe((result) => {
      this.interview = result['response'][0];
      console.log('⚡ this.interview', this.interview);
    });
  }
}
