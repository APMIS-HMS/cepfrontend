import { Component, OnInit, Input } from '@angular/core';
import * as SurveyEditor from 'surveyjs-editor';
import { FormsService } from '../../services/facility-manager/setup/index';


@Component({
    selector: 'survey-editor',
    template: `<div class="survery"><div id="surveyEditorContainer"></div></div>`,
})
export class SurveyEditorComponent implements OnInit {
    editor: SurveyEditor.SurveyEditor;
    @Input() defaultStrings: any;
    @Input() editorOptions: any;

    selectedForm: any = <any>{};

    constructor(private formsService: FormsService) {
    }
    ngOnInit() {
        this.formsService.returnAnnounce$.subscribe(form => {
           this.selectedForm = form;
            this.editor.text = form.body;
        });
        SurveyEditor.editorLocalization.locales['fr'] = this.defaultStrings;
        SurveyEditor.editorLocalization.currentLocale = 'fr';
        this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', this.editorOptions);

        this.editor.saveSurveyFunc = this.saveMySurvey;
    }

    saveMySurvey = () => {
        // console.log(JSON.stringify(this.editor.text));
        this.formsService.announceFormCreation(this.editor.text);
    }
}
