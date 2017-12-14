import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as Survey from 'survey-angular';
import { SharedService } from '../shared.service';
import { DocumentationService } from '../../services/facility-manager/setup/index';

@Component({
    selector: 'survey',
    template: `<div class="survey-container contentcontainer codecontainer survery"><div id="surveyElement"></div></div>`,
})
export class SurveyComponent implements OnInit, OnDestroy {
    @Input() json: any;
    @Input() isTemplate: boolean = false;
    surveyModel: any;
    constructor(private shareService: SharedService, private documentationService: DocumentationService) {
        this.shareService.newFormAnnounced$.subscribe((payload: any) => {
            this.json = payload.json;
            this.surveyModel = new Survey.ReactSurveyModel(payload.json);
            Survey.Survey.cssType = 'bootstrap';
            // console.log(this.surveyModel);
            // Survey.SurveyNG.render('surveyElement', { model: this.surveyModel });
            Survey.Survey.cssType = 'bootstrap';
            this.surveyModel.onComplete.add(() => {
                this.surveyResult();
            });
            this.surveyModel.onValueChanged.add((a, b) => {
                // console.log(a);
                // console.log(b);
            });
        })

        this.shareService.announceTemplate$.subscribe((payload: any) => {
            this.surveyModel.data = payload.data;
            Survey.SurveyNG.render('surveyElement', { model: this.surveyModel });
        })
    }

    ngOnInit() {
        this.surveyModel = new Survey.ReactSurveyModel(JSON.parse(this.json));
        Survey.Survey.cssType = 'bootstrap';

        // this.surveyModel.data = { "Physician's Name": "Ojo", "General Comments": "Lanre" };
        Survey.SurveyNG.render('surveyElement', { model: this.surveyModel });
        Survey.Survey.cssType = 'bootstrap';

        this.surveyModel.onComplete.add(() => {
            this.surveyResult();
        });
        this.surveyModel.onValueChanged.add((a, b) => {
            // console.log(a);
            // console.log(b);
        });

    }
    surveyResult() {
        if (!this.isTemplate) {
            document.getElementById('surveyElement').innerHTML = 'Document saved successfully!';
            const resultAsString = JSON.stringify(this.surveyModel.data);
            this.shareService.submitForm(this.surveyModel.data);
            this.json = null;
        } else {
            document.getElementById('surveyElement').innerHTML = 'Template saved successfully!';
            const resultAsString = JSON.stringify(this.surveyModel.data);
            this.shareService.submitForm(this.surveyModel.data);
            this.json = null;
        }

    }
    sendDataToServer(survey) {
        // document.getElementById('surveyElement').style.display = 'none';
        document.getElementById('surveyElement').innerHTML = 'Document saved successfully!';
        const resultAsString = JSON.stringify(survey.data);
        this.shareService.submitForm(survey.data)
        // alert(resultAsString); //send Ajax request to your web server.
    }

    ngOnDestroy(): void {
        // this.json = null;
        this.surveyModel = undefined;
        this.isTemplate = false;
        this.ngOnInit();
    }
}
