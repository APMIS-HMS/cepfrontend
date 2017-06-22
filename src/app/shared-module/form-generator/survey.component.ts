import { Component, Input, OnInit } from '@angular/core';
import * as Survey from 'survey-angular';

@Component({
    selector: 'survey',
    template: `<div class="survey-container contentcontainer codecontainer"><div id="surveyElement"></div></div>`,
})
export class SurveyComponent implements OnInit {
    @Input() json: any;

    ngOnInit() {
        //console.log(JSON.parse(this.json));
        let surveyModel = new Survey.ReactSurveyModel(JSON.parse(this.json));
        Survey.SurveyNG.render('surveyElement', { model: surveyModel });
    }
}
