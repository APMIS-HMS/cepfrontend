import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
  ManufacturerService, PresentationService, GenericService, ProductTypeService,
  ProductService, DictionariesService, FacilitiesServiceCategoryService, StrengthService,
  DrugListApiService, DrugDetailsService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, FacilityService } from '../../../../../models/index';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  isManufacturer: boolean = false;
  isPresentation: boolean = false;
  isStrength: boolean = false;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedProduct: any = <any>{};

  mainErr = true;
  errMsg = 'you have unresolved errors';
  productNameLabel = true;

  productName = '';
  presentationName = '';
  strengthName = '';
  productSugestion = false;
  ingridentSugestion = false;
  dictionaries: any[] = [];
  activeIngredients: any[] = [];

  manufacturers: any[] = [];
  presentations: any[] = [];
  generics: any[] = [];
  productTypes: any[] = [];
  categories: any[] = [];
  strengths: any[] = [];
  simpleProducts: any[] = [];
  productDetails: any = <any>{};

  public frm_newProduct: FormGroup;
  public ingredientForm: FormGroup;

  selectedFacility: Facility = <Facility>{};
  selectedFacilityService: FacilityService = <FacilityService>{};

  createText: string = 'Create Product';

  constructor(private formBuilder: FormBuilder, private manufacturerService: ManufacturerService, private genericService: GenericService,
    private presentationService: PresentationService, private productTypeService: ProductTypeService,
    private productService: ProductService, private dictionariesService: DictionariesService, private locker: CoolLocalStorage,
    private facilityServiceCategoryService: FacilitiesServiceCategoryService, private strengthService: StrengthService,
    private drugListApiService: DrugListApiService, private drugDetailsService: DrugDetailsService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frm_newProduct = this.formBuilder.group({
      productTypeId: ['', [<any>Validators.required]],
      categoryId: ['', [<any>Validators.required]],
      name: ['', [<any>Validators.required, Validators.minLength(3)]],
      packLabel: [''],
      packSize: [''],
      presentation: [''],
      manufacturer: ['', [<any>Validators.required]],
      genericName: [''],
      facilityId: [this.selectedFacility._id, [<any>Validators.required]],

    });

    // this.ingredientForm = this.formBuilder.group({
    //   ingredients: this.formBuilder.array([
    //     this.initIngredientsForm(),
    //   ])
    //})
    this.initIngredientsForm();

    this.populateProduct();
    this.frm_newProduct.controls['name'].valueChanges.subscribe(payload => {
      this.ingridentSugestion = false;
      if (payload !== null && payload !== undefined && payload.length > 0) {
        this.productSugestion = true;
        if (this.frm_newProduct.controls['name'].value !== null) {
          this.productName = this.presentationName + ' ' + this.frm_newProduct.controls['name'].value + ' ' + this.strengthName;
        }
      } else {
        this.productSugestion = false;
      }
      this.subscribeToControls();
    });
    // this.frm_newProduct.controls['genericName'].valueChanges.subscribe(payload => {
    //   this.productSugestion = false;
    //   if (payload !== null && payload !== undefined && payload.length > 0) {
    //     this.ingridentSugestion = true;
    //   } else {
    //     this.ingridentSugestion = false;
    //   }
    //   this.subscribeToControls();
    // });
    this.subscribeToControls();

    this.frm_newProduct.controls['presentation'].valueChanges.subscribe(value => {
      let presentation = this.presentations.filter(x => x._id === value);
      if (presentation.length > 0) {
        this.presentationName = presentation[0].name;
        if (this.frm_newProduct.controls['name'].value !== null) {
          this.productName = this.presentationName + ' ' + this.frm_newProduct.controls['name'].value + ' ' + this.strengthName;
        }
      }
    });

    // this.frm_newProduct.controls['strengthId'].valueChanges.subscribe(value => {
    //   let strength = this.strengths.filter(x => x._id === value);
    //   if (strength.length > 0) {
    //     this.strengthName = strength[0].strength;
    //     if (this.frm_newProduct.controls['name'].value !== null) {
    //       this.productName = this.presentationName + ' ' + this.frm_newProduct.controls['name'].value + ' ' + this.strengthName;
    //     }
    //   }
    // });

    this.frm_newProduct.valueChanges.subscribe(value => {
      this.mainErr = true;
      this.productSugestion = false;
    });

    //this.getManufacturers();
    //this.getGenerics();
    //this.getPresentations();
    this.getProductTypes();
    this.getServiceCategories();
    this.getStrengths();
  }

  // initIngredientsForm() {
  //   return this.formBuilder.group({
  //     name: [''],
  //     strength: [''],
  //     strengthUnit: ['']
  //   });
  // }

  initIngredientsForm() {
    this.ingredientForm = this.formBuilder.group({
      'ingredients': this.formBuilder.array([
        this.formBuilder.group({
          name: [''],
          strength: [''],
          strengthUnit: ['']
        })
      ])
    });
    console.log(this.ingredientForm)
    this.ingredientForm.controls['ingredients'] = this.formBuilder.array([]);
  }

  getStrengths() {
    this.strengthService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.strengths = payload.data;
      console.log(this.strengths);
    });
  }
  getServiceCategories() {
    this.facilityServiceCategoryService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      console.log(payload);
      if (payload.data.length > 0) {
        this.selectedFacilityService = payload.data[0];
        this.categories = payload.data[0].categories;
      }
    });
  }
  subscribeToControls() {
    let name = this.frm_newProduct.controls['name'].value;
    let genericName = this.frm_newProduct.controls['genericName'].value;
    if (name !== null && name !== undefined && name.length > 0) {
      let dictionaryObs = this.frm_newProduct.controls['name'].valueChanges.debounceTime(400)
        .distinctUntilChanged()
        .switchMap((dictionaries: any[]) => this.drugListApiService.find({
          query: {
            searchtext: this.frm_newProduct.controls['name'].value,
            "po": false,
            "brandonly": true,
            "genericonly": false
          }
        }));
      dictionaryObs.subscribe((payload: any) => {
        this.productSugestion = true;
        if (payload.length > 0 && payload[0].details.length !== this.frm_newProduct.controls['name'].value.length) {
          this.dictionaries = payload;
          payload.forEach(element => {
            var arrElements = element.details.split('(');
            element.activeIngredient = arrElements[1].replace(')', '');
            this.dictionaries.push(element);
          });
        } else {
          this.dictionaries = [];
          this.productSugestion = false;
        }
      });
    } else {
      this.dictionaries = [];
      this.productSugestion = false;
    }

    // if (genericName !== null && genericName !== undefined && genericName.length > 0) {
    //   let activetIngredientObs = this.frm_newProduct.controls['genericName'].valueChanges.debounceTime(400)
    //     .distinctUntilChanged()
    //     .switchMap((dictionaries: any[]) => this.dictionariesService.find({
    //       query: {
    //         genericName: { $regex: this.frm_newProduct.controls['genericName'].value, '$options': 'i' },
    //         $distinct: 'genericName'
    //       }
    //     }));
    //   activetIngredientObs.subscribe((payload: any) => {
    //     this.productSugestion = false;
    //     this.ingridentSugestion = true;
    //     if (payload.data.length > 0 && payload.data[0].genericName.length
    //       !== this.frm_newProduct.controls['genericName'].value.length) {
    //       this.activeIngredients = payload.data;
    //     } else {
    //       this.activeIngredients = [];
    //       this.ingridentSugestion = false;
    //     }
    //   });
    // } 
    // else {
    //   this.activeIngredients = [];
    //   this.ingridentSugestion = false;
    // }
  }
  populateProduct() {
    if (this.selectedProduct !== undefined && this.selectedProduct._id !== undefined) {
      this.createText = 'Update Product';
      this.frm_newProduct.controls['name'].setValue(this.selectedProduct.name);
      this.frm_newProduct.controls['packLabel'].setValue(this.selectedProduct.packLabel);
      this.frm_newProduct.controls['packSize'].setValue(this.selectedProduct.packSize);
      this.frm_newProduct.controls['presentation'].setValue(this.selectedProduct.presentation);
      this.frm_newProduct.controls['manufacturer'].setValue(this.selectedProduct.manufacturer);
      this.frm_newProduct.controls['genericName'].setValue(this.selectedProduct.genericName);
      this.frm_newProduct.controls['facilityId'].setValue(this.selectedProduct.facilityId);
      this.frm_newProduct.controls['productTypeId'].setValue(this.selectedProduct.productTypeId);
      this.frm_newProduct.controls['categoryId'].setValue(this.selectedProduct.categoryId);
    } else {
      this.createText = 'Create Product';
      this.frm_newProduct.reset();
      this.frm_newProduct.controls['facilityId'].setValue(this.selectedFacility._id);
    }

  }
  getManufacturers() {
    this.manufacturerService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.manufacturers = payload.data;
    });
  }
  getGenerics() {
    this.genericService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.generics = payload.data;
    });
  }
  getPresentations() {
    this.presentationService.findAll().then(payload => {
      this.presentations = payload.data;
    });
  }
  getProductTypes() {
    this.productTypeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.productTypes = payload.data;
    });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

  stringifyGeneric(values: any[]) {
    let generic = "";
    values.forEach((item) => {
      generic += item.name + " " + item.strength + " " + item.strengthUnit + "/ ";
    });
    return generic;
  }

  create(valid, value) {
    if (valid) {
      if (this.selectedProduct === undefined || this.selectedProduct._id === undefined) {
        let service: any = <any>{};
        service.name = value.name;
        this.productDetails.ingredients = [];
        this.productDetails.ingredients = this.ingredientForm.controls['ingredients'].value;
        if (value.genericName == undefined) {
          value.genericName = this.stringifyGeneric(this.productDetails.ingredients);
        }
        value.productDetail = this.productDetails;
        console.log(value);
        this.productService.create(value).then(payload => {
          this.selectedFacilityService.categories.forEach((item, i) => {
            if (item._id === value.categoryId) {
              item.services.push(service);
            }
          });
          this.facilityServiceCategoryService.update(this.selectedFacilityService).subscribe((payResult: FacilityService) => {
            payResult.categories.forEach((itemi, i) => {
              if (itemi._id === value.categoryId) {
                itemi.services.forEach((items, s) => {
                  if (items.name === service.name) {
                    payload.serviceId = items._id;
                    payload.facilityServiceId = this.selectedFacilityService._id;
                    this.productService.update(payload).then(result => {
                      console.log(result);
                    });
                  }
                });
              }
            });
          });
          this.close_onClick();
        }, error => {
          console.log(error);
        });
      } else {
        console.log(value);
        value._id = this.selectedProduct._id;
        this.productService.update(value).then(payload => {
          this.close_onClick();
        });
      }
      this.mainErr = true;
    } else {
      this.mainErr = false;
    }
  }
  onSelectProductSuggestion(suggestion) {
    this.drugDetailsService.find({ query: { productId: suggestion.productId } }).subscribe(payload => {
      console.log(payload);
      this.frm_newProduct.controls['name'].setValue(payload.brand + " " + payload.drugName);
      this.frm_newProduct.controls['genericName'].setValue(suggestion.activeIngredient);
      this.frm_newProduct.controls['presentation'].setValue(payload.form);
      this.frm_newProduct.controls['manufacturer'].setValue(payload.company);
      this.initIngredientsForm();
      this.setIngredientItem(payload.ingredients);
      this.productDetails = payload;
      // this.manufacturers = [];
      // var manufacturerItem : any = <any>{};
      // manufacturerItem = {};
      // manufacturerItem.name = payload.company;
      // manufacturerItem._id = "0";
      // this.manufacturers.push(manufacturerItem);
    })
  }

  onSelectActiveIngredientSuggestion(active) {
    this.frm_newProduct.controls['genericName'].setValue(active.genericName);
    this.dictionaries = [];
    this.productSugestion = false;
    this.activeIngredients = [];
    this.ingridentSugestion = false;
  }
  presentationSlide() {
    this.isManufacturer = false;
    this.isPresentation = true;
    this.isStrength = false;
  }
  manufacturerSlide() {
    this.isManufacturer = true;
    this.isPresentation = false;
    this.isStrength = false;
  }

  strengthSlide() {
    this.isManufacturer = false;
    this.isPresentation = false;
    this.isStrength = true;
  }

  addIngredient() {
    const control = <FormArray>this.ingredientForm.controls['ingredients'];
    control.push(this.ingredientItem());

  }

  ingredientItem() {
    return this.formBuilder.group({
      name: [''],
      strength: [''],
      strengthUnit: ['']
    });
  }

  setIngredientItem(values: any[]) {
    var control = <FormArray>this.ingredientForm.controls['ingredients'];

    values.forEach((item) => {
      control.push(
        this.formBuilder.group({
          name: [item.name],
          strength: [item.strength],
          strengthUnit: [item.strengthUnit]
        }));
    })
  }

  // day: ['', [<any>Validators.required]],
  //       startTime: [this.now, [<any>Validators.required]],
  //       endTime: [this.now, [<any>Validators.required]],
  //       location: ['', [<any>Validators.required]],
  //       readOnly: [false]

  removeIngredient(i: number) {
    const control = <FormArray>this.frm_newProduct.controls['ingredients'];
    control.removeAt(i);
  }
}
