import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Tag, Facility } from '../../../../../models/index';
import { TagService, TagDictionaryService } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-new-tag',
  templateUrl: './new-tag.component.html',
  styleUrls: ['./new-tag.component.scss']
})
export class NewTagComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = 'you have unresolved errors';
  facility: Facility = <Facility>{};
  dictionaries: any[] = [];
  public frmNewtag: FormGroup;

  constructor(private formBuilder: FormBuilder, private _tagService: TagService,
    private _locker: CoolLocalStorage, private tagDictionaryService: TagDictionaryService) { }

  ngOnInit() {
    this.addNew();
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    const subscribeForTagDictionary = this.frmNewtag.controls['tagName'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: any[]) => this.tagDictionaryService.find({
        query:
        { word: { $regex: this.frmNewtag.controls['tagName'].value, '$options': 'i' } }
      }).
        then(payload => {
          if (this.frmNewtag.controls['tagName'].value.length === 0) {
            this.dictionaries = [];
          } else {
            this.dictionaries = payload.data;
          }

        },
        error => {
          console.log(error);
        })
      );

    subscribeForTagDictionary.subscribe((payload: any) => {
    });
  }

  addNew() {
    this.frmNewtag = this.formBuilder.group({
      tagName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  onSelectDictionary(dic: any) {
    this.frmNewtag.controls['tagName'].setValue(dic.word);
  }
  newTag(model: any, valid: boolean) {
    if (valid) {
      const tag: Tag = <Tag>{};
      tag.name = this.frmNewtag.controls['tagName'].value;
      tag.facilityId = this.facility._id;
      const authObj: any = this._locker.getObject('auth')
      const auth: any = authObj.data;
      tag.createdBy = auth._id;

      this._tagService.create(tag).then(callback => {
        this.frmNewtag.controls['tagName'].setValue('');
      });
      if (this.dictionaries.length === 0) {
        this.tagDictionaryService.create({ word: this.frmNewtag.controls['tagName'].value }).then(inPayload => {
        });
      }
    }
  }
}
