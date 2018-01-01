import { Country } from './../../models/facility-manager/setup/country';
import { CountriesService } from './../../services/facility-manager/setup/countries.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CountryServiceFacadeService {
  private countries: Country[] = [];
  private states: any[] = [];
  constructor(private countriesService: CountriesService) { }

  getOnlyCountries() {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.countries.length > 0) {
        resolve(that.countries);
      } else {
        console.log('refresh');
        that.countriesService.find({
          query: {
            $select: { 'states': 0 }
          }
        }).then((payload) => {
          that.countries = payload.data;
          resolve(that.countries);
        }, error => {
          reject(error);
        });
      }
    });
  }

  getOnlyStates(country: string) {
    let that = this;
    return new Promise(function (resolve, reject) {
      if (that.states.length > 0) {
        resolve(that.states);
      } else {
        console.log('refresh state');
        that.countriesService.find({
          query: {
            'name': country,
            $select: { 'states.cities': 0, 'states.lgs': 0 }
          }
        }).then((payload) => {
          if(payload.data.length > 0){
            that.states = payload.data[0].states;
          }
          
          console.log(payload);
          resolve(that.states);
        }, error => {
          console.log(error);
          reject(error);
        });
      }
    });
  }
}
