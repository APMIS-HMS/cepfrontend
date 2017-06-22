import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule,FormControl,FormGroup }   from '@angular/forms';


@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
 optionShow:boolean= false;
  shortanswerShow: boolean = false;
  numberShow: boolean = false;
  modules: string[];
  constructor() { 
    this.modules = ['pharmacy', 'hospital', 'public', 'private'];
  }

  ngOnInit() {
  }
  userform = new FormGroup({
    module: new FormControl(),
    question: new FormControl(),
    selectbox: new FormControl(),
    inputs: new FormControl(),
    numbers: new FormControl(),
    textarea: new FormControl(),
  });
  onSubmit(value: any){
    console.log(value);
  }
  inputs = [{value: "inputs"}];
  addInput()  {
    this.inputs.push({value: ''});
  }
  onChange(param){
    switch(param){
      case 'Multiple choices':
      this.optionShow = true;
      this.shortanswerShow = false;
      this.numberShow = false;
      break;
      case 'Numbers':
      this.optionShow = false;
      this.shortanswerShow = false;
      this.numberShow = true;
      break;
      case 'Checkboxes':
      this.optionShow = true;
      this.shortanswerShow = false;
      this.numberShow = false;
      break;
      case 'Dropdown':
      this.optionShow = true;
      this.shortanswerShow = false;
      this.numberShow = false;
      break;
      case 'Short answer':
      this.shortanswerShow = true;
      this.numberShow = false;
      this.optionShow= false;

    }


  }
}
