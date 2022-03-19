import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { AddEmployeeDialogComponent } from '../../components/add-employee-dialog/add-employee-dialog.component';
import { EmployeeDialogComponent } from '../../components/employee-dialog/employee-dialog.component';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css'],
})
export class ManageEmployeesComponent implements OnInit {
  users: User[];

  constructor(
    private employeeService: EmployeeSummaryService,
    public dialog: MatDialog,
    private toaster: ToasterService
  ) {}
  employees: File[];
  ngOnInit(): void {
    this.getAllEmployeesFiles();
    this.getUsers();
  }
  getUsers() {
    this.employeeService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
    });
  }
  getAllEmployeesFiles() {
    this.employeeService.getFiles().subscribe((result) => {
      this.employees = result['response'][0]['totalData'];
    });
  }

  deleteEmployee(id: string) {
    this.employeeService.deleteEmployeeFile(id).subscribe(
      (result) => {
        console.log('❌ ManageEmployeesComponent ~ deleteEmployee', result);
        this.getAllEmployeesFiles();
        this.toaster.success('Successfuly Deleted');
      },
      (error) => {
        this.toaster.error('Something Went Wrong!');
      }
    );
  }
  openUpdateDialog(event) {
    let _employee_id = event?.target?.id;
    console.log(event?.target);

    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        employee: this.employees.filter(
          (employee) => employee._id === _employee_id
        )[0],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateDialog(event) {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        users: this.users,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllEmployeesFiles();
    });
  }
}