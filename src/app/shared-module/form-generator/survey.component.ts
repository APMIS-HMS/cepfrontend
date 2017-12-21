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
            Survey.Survey.cssType = 'bootstrap';
            this.surveyModel.onComplete.add(() => {
                this.surveyResult();
            });
            this.surveyModel.onValueChanged.add((a, b) => {
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
        Survey.SurveyNG.render('surveyElement', { model: this.surveyModel });
        Survey.Survey.cssType = 'bootstrap';

        this.surveyModel.onComplete.add(() => {
            this.surveyResult();
        });
        this.surveyModel.onValueChanged.add((a, b) => {
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
        document.getElementById('surveyElement').innerHTML = 'Document saved successfully!';
        const resultAsString = JSON.stringify(survey.data);
        this.shareService.submitForm(survey.data)
    }

    ngOnDestroy(): void {
        this.surveyModel = undefined;
        this.isTemplate = false;
        this.ngOnInit();
    }
}
