import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-health-coverage',
  templateUrl: './health-coverage.component.html',
  styleUrls: ['./health-coverage.component.scss']
})
export class HealthCoverageComponent implements OnInit {

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  pageInView = 'Company Retainership';

  companyCover = true;
  familyCover = false;
  hmoCover = false;
  staffCover = false;
  currentPath = '';

  constructor(private router: Router, private route: ActivatedRoute) {
    router.events.subscribe((payload: any) => {
    this.currentPath = payload.url;
    });
  }

  ngOnInit() {
  }
  getActivePath(value: string) {
    if (value === 'companyCover') {
      if (this.currentPath.endsWith('company-cover')) {
        return 'companyCover';
      } else {
        return '';
      }
    } else if (value === 'familyCover') {
      if (this.currentPath.endsWith('family-cover')) {
        return 'familyCover';
      } else {
        return '';
      }
    } else if (value === 'hmoCover') {
      if (this.currentPath.endsWith('hmo-cover')) {
        return 'hmoCover';
      } else {
        return '';
      }
    } else if (value === 'staffCover') {
      if (this.currentPath.endsWith('staff-cover')) {
        return 'staffCover';
      } else {
        return '';
      }
    }
  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }
  companyCover_show() {
    this.companyCover = true;
    this.familyCover = false;
    this.hmoCover = false;
    this.staffCover = false;
    this.router.navigate(['/dashboard/health-coverage/company-cover']);
  }
  familyCover_show() {
    this.companyCover = false;
    this.familyCover = true;
    this.hmoCover = false;
    this.staffCover = false;
    this.router.navigate(['/dashboard/health-coverage/family-cover']);
  }
  hmoCover_show() {
    this.companyCover = false;
    this.familyCover = false;
    this.hmoCover = true;
    this.staffCover = false;
    this.router.navigate(['/dashboard/health-coverage/hmo-cover']);
  }
  staffCover_show() {
    this.companyCover = false;
    this.familyCover = false;
    this.hmoCover = false;
    this.staffCover = true;
    this.router.navigate(['/dashboard/health-coverage/staff-cover']);
  }

}
