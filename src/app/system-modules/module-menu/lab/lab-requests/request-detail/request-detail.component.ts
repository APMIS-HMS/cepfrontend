import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild, Input } from '@angular/core';
import { FacilitiesService } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() investigation: any;
  @ViewChild('fileInput') fileInput: ElementRef;

  showDocument = false;
  hasNo = false;
  hasSample = false;
  hasSpecimen = false;
  hasLabNo = false;

  constructor(private renderer: Renderer, private facilityService: FacilitiesService) { }

  ngOnInit() {
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  onChange() {
    //upload file
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  takeSample() {
    this.hasSample = true;
  }
  takeSpecimen() {
    this.hasSpecimen = true;
  }
  assignLabNo() {
    this.hasLabNo = true;
  }

}
