import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { getToken } from '../helpers/getToken';
// import { getToken } from '../helpers/getToken';
import { Contract } from '../models/contract.model';
import { File } from '../models/file.models';
import { Interview } from '../models/interview.model';
import { Timeoff } from '../models/timeoff.model';
import { Timesheet } from '../models/timesheet.model';
import { TimesheetDeclaration } from '../models/timesheetDeclaration.model';
import { Timeslot } from '../models/timeslot.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSummaryService {
  // public decodedToken = jwtDecode(
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVkaXQiOjAsImNoYXRzIjpbXSwiX2lkIjoiNjIwMGYwNTU1ZTBlOWI5ZWFjM2YyMmFlIiwidXNlcm5hbWUiOiJzYWlmZWRkaW4wMSIsImVtYWlsIjoic2FpZjFAZ21haWwuY29tIiwicHJvZmlsZSI6eyJmdWxsTmFtZSI6IlNhaWZlZGRpbiBNYXRvdWkiLCJwaG9uZSI6IjEyMzQ1Njc4IiwibGlua2VkSW4iOiJzYWlmZWRkaW4wMSIsImZhY2Vib29rIjoiIn0sInR5cGUiOiJFU1RVREVOVCIsInN0dWRlbnROaXZlYXVJZCI6IjYxMDgyYTlkNmM1MzYwMmIxYzYwYzhhZiIsImNyZWF0ZWRBdCI6IjIwMjItMDItMDdUMTA6MTE6MzMuMjMxWiIsInVwZGF0ZWRBdCI6IjIwMjItMDItMTVUMDg6NDg6NDIuNzAxWiIsIl9fdiI6MCwiaWF0IjoxNjQ0OTE2MjI4LCJleHAiOjE2NjI5MTYyMjh9.0tPzDABqmcNXw8frdKF5dgkdyz6It_PAOkoRZgKpUU0'
  // );

  public decodedToken = jwtDecode(getToken());

  private BASE_URL: string = 'http://localhost:8001';

  constructor(private http: HttpClient) {}

  getUser() {
    console.log(this.decodedToken,"****************************")
    return this.decodedToken;
  }
  // ---------------------------- CONTRACTS 📜  ----------------------------------
  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(
      `${this.BASE_URL}/contracts/employeeContracts`
    );
  }
  getContractsWithSalary(): Observable<Contract[]> {
    return this.http.get<Contract[]>(
      `${this.BASE_URL}/contracts/employeeContractsWithSalary`
    );
  }

  // ---------------------------- INTERVIEW -----------------------
  getInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(
      `${this.BASE_URL}/interviews/employeeInterviews?limit=99`
    );
  }

  // --------------------------------- PROFILE / FILE -----------------------------
  getCollaborators(): Observable<File[]> {
    return this.http.get<File[]>(`${this.BASE_URL}/files/getCollaborators`);
  }

  getFiles(): Observable<File[]> {
    return this.http.get<File[]>(`${this.BASE_URL}/files`);
  }

  getFileDetails(): Observable<File> {
    console.log('😁😁😁😁😁', getToken())
    return this.http.get<File>(`${this.BASE_URL}/files/employeeFileDetails`);
  }

  updateProfile(body: any): Observable<File> {
    return this.http.put<File>(
      `${this.BASE_URL}/files/employeeFileDetails`,
      JSON.stringify(body),
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  // ------------------------------------- TIMESHEET ---------------------------------------
  getEmployeeTimeSheets(): Observable<Timesheet[]> {
    return this.http.get<Timesheet[]>(
      `${this.BASE_URL}/timesheets/getEmployeeTimeSheets`
    );
  }

  getEmployeeCurrentTimeSheet(date): Observable<Timesheet> {
    return this.http.get<Timesheet>(
      `${this.BASE_URL}/timesheets/getCurrentTimeSheet/${date}`
    );
  }

  updateEmployeeTimeSheets(sheet_id: string, body): Observable<Object> {
    return this.http.put<Object>(
      `${this.BASE_URL}/timesheets/updateTimeSheetForEmployee/${sheet_id}`,
      body
    );
  }
  createEmployeeTimeSheets(body): Observable<Object> {
    return this.http.post<Object>(`${this.BASE_URL}/timesheets`, body);
  }

  createTimesheetDeclaration(body): Observable<TimesheetDeclaration> {
    return this.http.post<TimesheetDeclaration>(
      `${this.BASE_URL}/timesheetDeclarations`,
      body
    );
  }
  deleteDeclaration(id: string): Observable<TimesheetDeclaration> {
    return this.http.delete<TimesheetDeclaration>(
      `${this.BASE_URL}/timesheetDeclarations/${id}`
    );
  }

  getCurrentDeclaration(month: number): Observable<TimesheetDeclaration> {
    return this.http.get<TimesheetDeclaration>(
      `${this.BASE_URL}/timesheetDeclarations/getCurrentDeclaration/${month}`
    );
  }
  // --------------------------------- TIMETABLE ----------------------------
  getTimeSlots(): Observable<Timeslot[]> {
    return this.http.get<Timeslot[]>(`${this.BASE_URL}/timeslots`);
  }
  // ------------------------------- TIMEOFFS 😴 -----------------------------
  getEmployeeTimeoffHistory(): Observable<Timeoff> {
    return this.http.get<Timeoff>(
      `${this.BASE_URL}/timeoffs/employeeTimeoffHistory`
    );
  }
  createTimeoffRequest(body: Timeoff): Observable<Timeoff> {
    return this.http.post<Timeoff>(
      `${this.BASE_URL}/timeOffs/createTimeOffAsEmployee`,
      body
    );
  }

  updateTimeoffStatus(body, id: string): Observable<Timeoff> {
    return this.http.put<Timeoff>(
      `${this.BASE_URL}/timeoffs/updateStatus/${id}`,
      body
    );
  }
}
