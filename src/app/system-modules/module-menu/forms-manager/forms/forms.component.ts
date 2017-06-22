import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsService } from '../../../../services/facility-manager/setup/index';
import { ModuleViewModel, Facility } from '../../../../models/index';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {
  defaultStrings = {
    ed: {
      addNewPage: 'Add New Page',
      newPageName: 'page',
      newQuestionName: 'question',
      newPanelName: 'panel',
      testSurvey: 'Preview Form',
      testSurveyAgain: 'Preview Form Again',
      testSurveyWidth: 'Form width: ',
      embedSurvey: 'Embed Form',
      saveSurvey: 'Save Form',
      designer: 'Form Designers',
      jsonEditor: 'JSON Editor',
      undo: 'Undo',
      redo: 'Redo',
      options: 'Options',
      generateValidJSON: 'Generate Valid JSON',
      generateReadableJSON: 'Generate Readable JSON',
      toolbox: 'Toolbox',
      delSelObject: 'Delete selected object',
      correctJSON: 'Please correct JSON.',
      surveyResults: 'Form Result: '
    },
    survey: {
      dropQuestion: 'Please drop a form control here.',
      copy: 'Copy',
      addToToolbox: 'Add to toolbox',
      deletePanel: 'Delete Panel',
      deleteQuestion: 'Delete Question'
    },
    qt: {
      checkbox: 'Checkbox',
      comment: 'Comment',
      dropdown: 'Dropdown',
      file: 'File',
      html: 'Html',
      matrix: 'Matrix (single choice)',
      matrixdropdown: 'Matrix (multiple choice)',
      matrixdynamic: 'Matrix (dynamic rows)',
      multipletext: 'Multiple Text',
      panel: 'Panel',
      radiogroup: 'Radiogroup',
      rating: 'Rating',
      text: 'Single Input'
    },
    pe: {
      apply: 'Apply',
      ok: 'OK',
      cancel: 'Cancel',
      reset: 'Reset',
      close: 'Close',
      delete: 'Delete',
      addNew: 'Add New',
      removeAll: 'Remove All',
      edit: 'Edit',
      empty: '<empty>',
      fastEntry: 'Fast Entry',
      formEntry: 'Form Entry',
      testService: 'Test the service',
      // tslint:disable-next-line:max-line-length
      expressionHelp: 'Please enter a boolean expression. It should return true to keep the question/page visible. For example: {question1} = \'value1\' or ({question2} = 3 and {question3} < 5)',

      propertyIsEmpty: 'Please enter value into the property',
      value: 'Value',
      text: 'Text',
      required: 'Required?',
      columnEdit: 'Edit column: {0}',

      hasOther: 'Has other item',
      name: 'Name',
      title: 'Title',
      cellType: 'Cell type',
      colCount: 'Column count',
      choicesOrder: 'Select choices order',
      visible: 'Is visible?',
      isRequired: 'Is required?',
      startWithNewLine: 'Is start with new line?',
      rows: 'Row count',
      placeHolder: 'Input place holder',
      showPreview: 'Is image preview shown?',
      storeDataAsText: 'Store file content in JSON result as text',
      maxSize: 'Maximum file size in bytes',
      imageHeight: 'Image height',
      imageWidth: 'Image width',
      rowCount: 'Row count',
      addRowText: 'Add row button text',
      removeRowText: 'Remove row button text',
      minRateDescription: 'Minimum rate description',
      maxRateDescription: 'Maximum rate description',
      inputType: 'Input type',
      optionsCaption: 'Options caption',

      qEditorTitle: 'Edit question: {0}',
      tabs: {
        general: 'General',
        fileOptions: 'Options',
        html: 'Html Editor',
        columns: 'Columns',
        rows: 'Rows',
        choices: 'Choices',
        visibleIf: 'Visible If',
        rateValues: 'Rate Values',
        choicesByUrl: 'Choices from Web',
        matrixChoices: 'Default Choices',
        multipleTextItems: 'Text Inputs'
      },

      editProperty: "Edit property '{0}'",
      items: '[ Items: {0} ]',

      enterNewValue: 'Please, enter the value.',
      noquestions: 'There is no any question in the survey.',
      createtrigger: 'Please create a trigger',
      triggerOn: 'On ',
      triggerMakePagesVisible: 'Make pages visible:',
      triggerMakeQuestionsVisible: 'Make questions visible:',
      triggerCompleteText: 'Complete the survey if succeed.',
      triggerNotSet: 'The trigger is not set',
      triggerRunIf: 'Run if',
      triggerSetToName: 'Change value of: ',
      triggerSetValue: 'to: ',
      triggerIsVariable: 'Do not put the variable into the survey result.',
      verbChangeType: 'Change type ',
      verbChangePage: 'Change page '
    },
    op: {
      empty: 'is empty',
      notempty: 'is not empty',
      equal: 'equals',
      notequal: 'not equals',
      contains: 'contains',
      notcontains: 'not contains',
      greater: 'greater',
      less: 'less',
      greaterorequal: 'greater or equals',
      lessorequal: 'Less or Equals'
    },
    ew: {
      angular: 'Use Angular version',
      jquery: 'Use jQuery version',
      knockout: 'Use Knockout version',
      react: 'Use React version',
      vue: 'Use Vue version',
      bootstrap: 'For bootstrap framework',
      standard: 'No bootstrap',
      showOnPage: 'Show survey on a page',
      showInWindow: 'Show survey in a window',
      loadFromServer: 'Load Survey JSON from server',
      titleScript: 'Scripts and styles',
      titleHtml: 'HTML',
      titleJavaScript: 'JavaScript'
    },
    p: {
      name: 'name',
      title: { name: 'title', title: "Leave it empty, if it is the same as 'Name'" },
      survey_title: { name: 'title', title: 'It will be shown on every page.' },
      page_title: { name: 'title', title: 'Page title' }
    }
  };
  editorOptions = { showEmbededSurveyTab: false, showJSONEditorTab: false, showSurveyDesignerTab: false, generateValidJSON: true };

  modules: ModuleViewModel[] = [];
  scopeLevels: any[] = [];
  documentTypes: any[] = [];
  forms: any[] = [];
  txtForm = new FormControl();
  frm_document: FormGroup;
  frm_checkboxGroup: FormGroup;
  selectedFacility: Facility = <Facility>{};
  selectedForm: any = <any>{};

  constructor(private route: ActivatedRoute, private formsService: FormsService,
    private locker: CoolLocalStorage,
    private formBuilder: FormBuilder) {

    this.txtForm.valueChanges.subscribe(value => {
      const filteredForms = this.forms.filter(x => x._id === value);
      if (filteredForms.length > 0) {
        this.selectedForm = filteredForms[0];
        this.frm_document.controls['formName'].setValue(this.selectedForm.title);
        this.frm_document.controls['documentType'].setValue(this.selectedForm.typeOfDocumentId);
        this.frm_document.controls['scopeLevel'].setValue(this.selectedForm.scopeLevelId);
        this.formsService.announceFormEdit(this.selectedForm);

        this.modules.forEach((item, i) => {
          const filteredModule = this.selectedForm.moduleIds.filter(x => x === item._id);
          if (filteredModule.length > 0) {
            item.checked = true;
          }
        });
      }
    });

    formsService.announce$.subscribe(payload => {
      console.log(payload);
      const checkedModules = this.modules.filter(x => x.checked);
      const checkedModuleIds = [];
      checkedModules.forEach((item, i) => {
        checkedModuleIds.push(item._id);
      });
      const full = {
        moduleIds: checkedModuleIds,
        typeOfDocumentId: this.frm_document.value.documentType,
        scopeLevelId: this.frm_document.value.scopeLevel,
        title: this.frm_document.value.formName,
        body: payload,
        facilityId: this.selectedFacility._id
      };
      console.log(full);
      this.formsService.create(full).then(payloads => {
      });
    });
    this.frm_document = this.formBuilder.group({
      scopeLevel: ['', [<any>Validators.required]],
      documentType: ['', [<any>Validators.required]],
      formName: ['', [<any>Validators.required]],
    });


  }

  ngOnInit() {
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this.getForms();
    this.route.data.subscribe(data => {
      data['modules'].subscribe((payload) => {
        payload.forEach((item, i) => {
          this.modules.push({
            _id: item._id,
            name: item.name,
            checked: false
          });
        });


        const checkboxArray = new FormArray([]);
        this.modules.forEach((item, i) => {
          checkboxArray.push(new FormControl(item.checked));
        });

        this.frm_checkboxGroup = this.formBuilder.group({
          myValues: checkboxArray
        });

      });
      data['documentTypes'].subscribe((payload) => {
        this.documentTypes = payload;
      });
      data['scopeLevels'].subscribe((payload) => {
        this.scopeLevels = payload;
      });
    });
  }
  onValueChanged(event, model: ModuleViewModel) {
    model.checked = event.value;
  }
  getForms() {
    this.formsService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.forms = payload.data;
    });
  }
  onCreate() {
    this.formsService.announceFormEdit({});
    this.frm_document.reset();
    this.frm_checkboxGroup.reset();
    this.txtForm.reset();
  }
}

