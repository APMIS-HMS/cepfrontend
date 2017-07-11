import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Appointment, Facility } from '../../models/index';
import { AppointmentService }
  from '../../services/facility-manager/setup/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Injectable()
export class AppointmentResolverService implements Resolve<Appointment> {
  previousUrl: string = '/';
  selectedFacility: Facility = <Facility>{};
  constructor(private appointmentService: AppointmentService,
    private locker: CoolSessionStorage,
    private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Appointment> {
    let id = route.params['appId'];
    if (id === undefined) {
      return Observable.of(null);
    }
    return this.appointmentService.get(id, {}).then(payload => {
      if (payload) {
        return Observable.of(payload);
      }
      return Observable.of(null);
    }, error => {
      return Observable.of(null);
    });
  }
}
