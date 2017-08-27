import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-health-coverage',
  templateUrl: './health-coverage.component.html',
  styleUrls: ['./health-coverage.component.scss']
})
export class HealthCoverageComponent implements OnInit {

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  pageInView = 'Health Insurance';

  companyCover = false;
  familyCover = false;
  payment = false;
  hmoCover = true;
  staffCover = false;
  currentPath = '';
  contentSecMenuShow = false;
  

  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.subscribe((payload: any) => {
    this.currentPath = payload.url;
    });
  }

  ngOnInit() {
  }
  contentSecMenuToggle(){

  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }
  companyCover_show() {
    this.companyCover = true;
    this.familyCover = false;
    this.payment = false;
    this.hmoCover = false;
    this.pageInView = "Company Retainership";
    this.router.navigate(['/dashboard/health-coverage/company-cover']);
  }
  familyCover_show() {
    this.companyCover = false;
    this.familyCover = true;
    this.payment = false;
    this.hmoCover = false;
    this.pageInView = "Family Cover";
    this.router.navigate(['/dashboard/health-coverage/family-cover']);
  }
  hmoCover_show() {
    this.companyCover = false;
    this.familyCover = false;
    this.payment = false;
    this.hmoCover = true;
    this.pageInView = "Health Insurance";
    this.router.navigate(['/dashboard/health-coverage/hmo-cover']);
  }
  payment_show() {
    this.companyCover = false;
    this.familyCover = false;
    this.payment = true;
    this.hmoCover = false;
    this.pageInView = "Payment";
    this.router.navigate(['/dashboard/health-coverage/payment']);
  }

}
