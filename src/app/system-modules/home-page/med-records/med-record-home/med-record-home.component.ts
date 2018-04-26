import { Person } from 'app/models/index';
import { Component, OnInit, Input } from '@angular/core';
import { PendingBillService } from '../../../../services/facility-manager/setup';

@Component({
  selector: 'app-med-record-home',
  templateUrl: './med-record-home.component.html',
  styleUrls: ['./med-record-home.component.scss', '../med-records.component.scss']
})
export class MedRecordHomeComponent implements OnInit {
  schedule_appointment = false;
  @Input() selectedPerson: Person = <Person>{};
  @Input() listOfPatients: any[] = [];
  constructor(private pendingBillService:PendingBillService) { }

  ngOnInit() {
    console.log(this.listOfPatients);
    this.getPendingBills();
  }

  close_onClick(message: boolean): void {
    this.schedule_appointment = false;
  }
  set_appointment() {
    this.schedule_appointment = true;
  }
  getFacilityName(id){
    const facility = this.listOfPatients.filter(x =>x.facilityId == id);
    if(facility.length > 0){
      return facility[0].name;
    }
    return '';
  }
  getPendingBills(){
    this.pendingBillService.find({query:{patientIds:this.listOfPatients.map(x => x._id)}}).subscribe(payload =>{
      console.log(payload.data);
    })
  }
}
