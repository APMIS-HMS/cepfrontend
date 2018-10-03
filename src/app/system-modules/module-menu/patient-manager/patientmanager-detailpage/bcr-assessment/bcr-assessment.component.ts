import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-bcr-assessment',
  templateUrl: './bcr-assessment.component.html',
  styleUrls: ['./bcr-assessment.component.scss', '../../../payment/bill-lookup/bill-lookup.component.scss']
})
export class BcrAssessmentComponent implements OnInit {
  bcrFormGroup: FormGroup;

  constructor(
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.bcrFormGroup = this._fb.group({
      Asymptomatic: ['', Validators.required],
      hivCounselling: ['', Validators.required],
      personalHistoryOfBreatCancer: ['', Validators.required],
      mammogram: ['', Validators.required],
      historyOfBreastImplant: ['', Validators.required],
      firstDegreeeHasGeneMutation: ['', Validators.required],
      firstDegreeeHasGeneticCounsellingAndTesting: ['', Validators.required],
      twoOrMoreCasesOfBreastCancerOrOvarianCancer: ['', Validators.required],
      bilateralBreastCancer: ['', Validators.required],
      bothBreastAndOvarianInTheSameWoman: ['', Validators.required],
      seriousInvasiveSeriousOvarian: ['', Validators.required],
      breastOrOvarianCancerInAshkenaziJewishFamily: ['', Validators.required],
      indentifiedGeneMutationInAnyBloodRelative: ['', Validators.required],
      maleBreastCancer: ['', Validators.required],
      knownCarrierOfAGeneMutation: ['', Validators.required],
      firstDegreeHasHadGeneticCounsellingAndHasDeclinedTesting: ['', Validators.required],
      previouslyAssessedAsHavingAGreaterLifetimeRiskOfBreastCancer: ['', Validators.required],
      receiveChestXRayBeforeAge30AndAtLeast8YrsPreviously: ['', Validators.required],
    });
  }

}
