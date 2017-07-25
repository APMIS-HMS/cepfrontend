import { Component, Input, OnInit } from '@angular/core';
import * as Survey from 'survey-angular';
import { SharedService } from '../shared.service';
import { DocumentationService } from '../../services/facility-manager/setup/index';

@Component({
    selector: 'survey',
    template: `<div class="survey-container contentcontainer codecontainer survery"><div id="surveyElement"></div></div>`,
})
export class SurveyComponent implements OnInit {
    @Input() json: any;
    surveyModel: any;
    constructor(private shareService: SharedService, private documentationService: DocumentationService) {
        this.shareService.newFormAnnounced$.subscribe((payload: any) => {
            this.surveyModel = new Survey.ReactSurveyModel(JSON.parse(payload.json));
            Survey.Survey.cssType = 'bootstrap';
            Survey.SurveyNG.render('surveyElement', { model: this.surveyModel });
            Survey.Survey.cssType = 'bootstrap';
            this.surveyModel.onComplete.add(() => {
                this.surveyResult();
            });
        })
    }

    ngOnInit() {
        this.surveyModel = new Survey.ReactSurveyModel(JSON.parse(this.json));
        Survey.Survey.cssType = 'bootstrap';
        Survey.SurveyNG.render('surveyElement', { model: this.surveyModel });
        Survey.Survey.cssType = 'bootstrap';
        this.surveyModel.onComplete.add(() => {
            this.surveyResult();
        });
    }
    surveyResult() {
        document.getElementById('surveyElement').innerHTML = 'Document saved successfully!';
        const resultAsString = JSON.stringify(this.surveyModel.data);
        this.shareService.submitForm(this.surveyModel.data)
    }
    sendDataToServer(survey) {
        // document.getElementById('surveyElement').style.display = 'none';
        document.getElementById('surveyElement').innerHTML = 'Document saved successfully!';
        const resultAsString = JSON.stringify(survey.data);
        this.shareService.submitForm(survey.data)
        // alert(resultAsString); //send Ajax request to your web server.
    }
}
