import { FeescheduleService } from './../../services/feeschedule.service';
import { element } from 'protractor';

import { Program } from './../../models/program.model';
import { Academicterm } from './../../models/academicterm.model';
import { AcademicyearService } from './../../services/academicyear.service';
import { GroupstudentService } from './../../services/groupstudent.service';
import { Academicyear } from './../../models/acadmicyear.model';
import { FeeStructure } from './../../models/feeStructure.model';
import { FeestructureService } from './../../services/feestructure.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { MatTableDataSource } from '@angular/material/table';
import { Student } from '../../models/student.model';
import { StudentGroup } from '../../models/studentgroup.model';
import { AcademictermService } from '../../services/academicterm.service';
import { FeeCategoryService } from '../../services/fee-category.service';
import { ProgramService } from '../../services/program.service';

@Component({
  selector: 'app-feeschedule',
  templateUrl: './feeschedule.component.html',
  styleUrls: ['./feeschedule.component.css'],
})
export class FeescheduleComponent implements OnInit {
  ismatch: boolean = false;
  test: string = 'test';

  feestruct = {
    program: '',
    academicyear: '',
    academicterm: '',
    studentcat: '',
  };
  studentgrouptable: StudentGroup[] = [];
  feeschedule: any [] = [];
  studentgroups: [] = [];
  feeStructures: [] = [];
  studentsId: any[] = [];
  clrModalOpen4 : boolean = false;
  clrModalOpen2: boolean = false;
  clrModalOpenEdit: boolean =false;
  form1: FormGroup;
  form2: FormGroup;
  clrModalOpen: boolean = false;
  form: FormGroup;
  displayedColumns: string[] = ['studentgroup', 'totalestudent'];
  displayedColumns1: string[] = ['#', 'name', 'duedate', 'action'];

  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(
    private academicyearService: AcademicyearService,
    private programService: ProgramService,
    private academictermService: AcademictermService,
    private feeCategoryService: FeeCategoryService,
    private formBuilder: FormBuilder,
    private toasterService: ToasterService,
    private feeStructureService: FeestructureService,
    private groupstudentService: GroupstudentService,
    private feescheduleService: FeescheduleService
  ) {
    this.getfeeStructure();
    this.getfeeSchedule();
    this.getstudentgroup();
  }

  ngOnInit(): void {
    this.createForm();
    this.createForm1();
    this.createForm2();
  }

  dataSource1: MatTableDataSource<any> = new MatTableDataSource<any>();
  getfeeSchedule() {
    this.feescheduleService.getFeesschedule().subscribe(
      (res) => {
        this.feeschedule = []
        for (var i = 0; i < res.response.length; i++) {
          const schedulefee = {
            _id: '',
            name: '',
            duedate: '',
            enabled:''
          };

          schedulefee.duedate = res.response[i].dueDate;
          schedulefee._id = res.response[i]._id;
          schedulefee.enabled = res.response[i].enabled;

          this.feescheduleService
            .getOneFeestructures(res.response[i].feeStructureId)
            .subscribe((res) => {
              
              schedulefee.name = res.response.name;
            },
           (error)=>{
             console.log("error get fee schedule",error)
           }  )
          
          this.feeschedule.push(schedulefee);


        }
        console.log('feeschedule', this.feeschedule)
        this.dataSource1 = new MatTableDataSource(this.feeschedule);
      },
      (error) => {
        console.error('get feeshcedule error :', error);
      }
    );
  }
  getfeeStructure() {
    this.feeStructureService.getFeestructures().subscribe(
      (res) => {
        this.feeStructures = res.response;
        console.log('fee structures:', this.feeStructures);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  getstudentgroup() {
    this.groupstudentService.getStudentgroup().subscribe(
      (res) => {
        this.studentgroups = res.response;
        console.log('fee structures:', this.studentgroups);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  createForm1() {
    this.form1 = this.formBuilder.group({
      _id: '',
      studentgroup: ['', [Validators.required]],
      totalestudent: ['', [Validators.required]],
    }) as FormGroup;
  }
  createForm() {
    this.form = this.formBuilder.group({
      _id: '',
      feestructure: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
    
    }) as FormGroup;
  }

  createForm2() {
    this.form2= this.formBuilder.group({
      _id: '',
      name: ['', [Validators.required]],
      duedate: ['', [Validators.required]],
      }) as FormGroup ; 
  }
  fillFormModel(body) {
    this.form.patchValue({
      _id: body._id,
      name: body.name,
      duedate: body.duedate,
      
     
    });
    
  }

  modalType: string;
  openModal() {
    this.clrModalOpen = true;
    this.modalType = 'add';
  }
  closeModal() {
    this.createForm1();
    this.clrModalOpen = false;
  }
  openModal2() {
    this.clrModalOpen2 = true;
  }
  closeModal2() {
    this.clrModalOpen2 = false;
  }
  dataSource4: MatTableDataSource<any> = new MatTableDataSource<any>();
  closeModaledit(){
    this.clrModalOpenEdit= false;
  }

  openmodal4(id:string){
    this.clrModalOpen4 = true;
  }

  // Save student group first save
  savefeeshcedule() {
    const feeschedule = {
      feeStructureId: this.form.value.feestructure,
      dueDate: this.form.value.duedate,

      studentgroup: this.studentgrouptable,
    };
    
    this.feescheduleService.createFeeschedule(feeschedule).subscribe(
      (result) => {
        console.log(result);
        this.toasterService.success('Created successfully');
        this.getfeeSchedule()
      },
      (err) => {
        console.log(err);
        this.toasterService.error('Something wrong ');
      }
    );
  }

  //set value to other inputs
  setinput(id: string) {
    this.feeStructureService.getFeestructures().subscribe(
      (res) => {
        for (var i = 0; i < res.response.length; i++) {
          if (res.response[i]._id == id) {
            this.programService
              .getOneProgram(res.response[i].program)
              .subscribe((res) => {
                this.feestruct.program = res.response.name;
              });

            this.academicyearService
              .getOneAcademicyear(res.response[i].academicyear)
              .subscribe((res) => {
                this.feestruct.academicyear = res.response.name;
              });

            this.academictermService
              .getOneAcademicterm(res.response[i].academicterm)
              .subscribe((res) => {
                this.feestruct.academicterm = res.response.name;
              });

            this.feeCategoryService
              .getOneFeeCatgory(res.response[i].feeCategory)
              .subscribe((res) => {
                this.feestruct.studentcat = res.response.name;
              });
            // this.feestruct.studentcat = res.response[i].studentCategory;
            // this.feestruct.academicyear = res.response[i].academicyear;
            // this.feestruct.academicterm = res.response[i].academicterm;
            // this.feestruct.program = res.response[i].program;
          }
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  dataSource: MatTableDataSource<StudentGroup> =
    new MatTableDataSource<StudentGroup>();
  addstudentgrouptotable() {
    const studg = {
      name: this.form1.value.studentgroup,
      numtot: this.form1.value.totalestudent,
    };

    this.studentgrouptable.push(studg);
    this.dataSource = new MatTableDataSource(this.studentgrouptable);
  }

  editById(body: Partial<Student>) {
    console.log("edit by id element",body)
    this.fillFormModel(body);

    
    this.clrModalOpenEdit = true
    
  }

  editfeeschedule(){
    const feeschedule={
      name:this.form.value.name,
      duedate : this.form.value.duedate,
    
  }
  
  this.feescheduleService.editfeeschedule(this.form.value._id,feeschedule).subscribe(
    (result)=>{
      console.log('edited successfully:',result);
      this.toasterService.success('Edited Successfully');
      this.getfeeSchedule();

    },(err)=>{
      console.log("edit error :",err)
      this.toasterService.error('Something wrong')
    }
  )
}

deletefeeschedule(id:string){
  this.feescheduleService.deletefeeschedule(id).subscribe(
    (res)=>{
      this.toasterService.success("Deleted successfully")
      this.getfeeSchedule();
   

    },
    (err)=>{
      this.toasterService.error('Something wrong ')
    }
  )
}
}
